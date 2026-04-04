import { useState, useRef, useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import { matrixSync, processSyncResponse } from '@/src/services/matrix/sync';
import { MatrixEvent } from '@/src/shared/types/matrixEvent';
import { authStorage } from '../storage/auth-storage';

// Long polling para Matrix /sync
interface UseSyncLoopOptions {
  onMessages?: (roomId: string, messages: MatrixEvent[]) => void;
  onInvite?: (roomId: string) => void;
  onJoin?: (roomId: string) => void;
  onLeave?: (roomId: string) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

interface UseSyncLoopReturn {
  startSync: () => void;
  stopSync: () => void;
  isRunning: boolean;
  lastSyncTime: number | null;
}

const MAX_RETRIES = 5;
const BASE_RETRY_DELAY = 1000;
const ACTIVE_POLL_TIMEOUT = 30000;
const BACKGROUND_POLL_TIMEOUT = 5000;

export const useSyncLoop = (options: UseSyncLoopOptions = {}): UseSyncLoopReturn => {
  const {
    onMessages,
    onInvite,
    onJoin,
    onLeave,
    onError,
    enabled = true,
  } = options;

  const [isRunning, setIsRunning] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);

  const shouldStopRef = useRef(false);
  const nextBatchRef = useRef<string | undefined>(undefined);
  const retryCountRef = useRef(0);
  const appStateRef = useRef<'active' | 'background'>('active');
  const isRunningRef = useRef(false);
  const loopIdRef = useRef(0);

  const syncLoop = useCallback(async (loopId: number) => {
    while (!shouldStopRef.current && loopIdRef.current === loopId) {
      try {
        const session = await authStorage.getSession();

        if (!session?.access_token) {
          console.log('[useSyncLoop] No session, stopping');
          break;
        }

        const currentTimeout = appStateRef.current === 'active'
          ? ACTIVE_POLL_TIMEOUT
          : BACKGROUND_POLL_TIMEOUT;

        const syncData = await matrixSync({
          token: session.access_token,
          since: nextBatchRef.current,
          timeout: currentTimeout,
        });

        if (loopIdRef.current !== loopId) {
          break;
        }

        if (!syncData) {
          retryCountRef.current += 1;

          if (retryCountRef.current >= MAX_RETRIES) {
            console.error('[useSyncLoop] Max retries reached, stopping');
            break;
          }

          const delay = BASE_RETRY_DELAY * Math.pow(2, retryCountRef.current - 1);
          console.log(`[useSyncLoop] Retry ${retryCountRef.current} after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        retryCountRef.current = 0;
        nextBatchRef.current = syncData.next_batch;
        setLastSyncTime(Date.now());

        const { newMessages, newInvites, joinedRooms, leftRooms } = processSyncResponse(
          syncData,
          session.user_id
        );

        if (newInvites.length > 0) {
          console.log('[useSyncLoop] New invites:', newInvites);
          newInvites.forEach(roomId => onInvite?.(roomId));
        }

        if (joinedRooms.length > 0) {
          console.log('[useSyncLoop] Joined rooms:', joinedRooms);
          joinedRooms.forEach(roomId => onJoin?.(roomId));
        }

        if (leftRooms.length > 0) {
          console.log('[useSyncLoop] Left rooms:', leftRooms);
          leftRooms.forEach(roomId => onLeave?.(roomId));
        }

        newMessages.forEach((events, roomId) => {
          if (events.length > 0) {
            console.log(`[useSyncLoop] New messages in ${roomId}:`, events.length);
            onMessages?.(roomId, events);
          }
        });

      } catch (error) {
        console.error('[useSyncLoop] Error in loop:', error);

        if (error instanceof Error) {
          onError?.(error);
        }

        retryCountRef.current += 1;

        if (retryCountRef.current >= MAX_RETRIES) {
          console.error('[useSyncLoop] Max retries reached, stopping');
          break;
        }

        const delay = BASE_RETRY_DELAY * Math.pow(2, retryCountRef.current - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    isRunningRef.current = false;
    setIsRunning(false);
    console.log('[useSyncLoop] Loop stopped');
  }, [onMessages, onInvite, onJoin, onLeave, onError]);

  const startSync = useCallback(() => {
    if (isRunningRef.current) {
      console.log('[useSyncLoop] Already running');
      return;
    }

    console.log('[useSyncLoop] Starting sync loop');
    shouldStopRef.current = false;
    retryCountRef.current = 0;
    isRunningRef.current = true;
    setIsRunning(true);

    loopIdRef.current += 1;
    syncLoop(loopIdRef.current);
  }, [syncLoop]);

  const stopSync = useCallback(() => {
    console.log('[useSyncLoop] Stopping sync loop');
    shouldStopRef.current = true;
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      console.log('[useSyncLoop] AppState changed:', appStateRef.current, '->', nextAppState);

      const previousState = appStateRef.current;
      appStateRef.current = nextAppState as 'active' | 'background';

      if (nextAppState === 'active' && previousState !== 'active') {
        if (!isRunningRef.current && enabled) {
          console.log('[useSyncLoop] App became active, starting sync');
          startSync();
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    if (enabled) {
      startSync();
    }

    return () => {
      subscription.remove();
      stopSync();
    };
  }, [enabled, startSync, stopSync]);

  return {
    startSync,
    stopSync,
    isRunning,
    lastSyncTime,
  };
};
