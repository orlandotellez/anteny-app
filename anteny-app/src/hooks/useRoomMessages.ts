import { useCallback, useEffect, useRef, useState } from "react";
import { getRoomMessages, sendRoomMessage } from "../services/matrix";
import { MatrixEvent } from "../shared/types/matrixEvent";
import { useSyncLoop } from "./useSyncLoop";
import { authStorage } from "../storage/auth-storage";
import { Message } from "../shared/types/matrixMessage";

interface UseRoomMessagesOptions {
  roomId: string;
  initialLimit?: number;
  onNewMessage?: (message: Message) => void;
  enabled?: boolean;
}

interface UseRoomMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  sendMessage: (body: string) => Promise<boolean>;
  isSending: boolean;
  refresh: () => Promise<void>;
}

export const useRoomMessages = (options: UseRoomMessagesOptions): UseRoomMessagesReturn => {
  const { roomId, initialLimit = 50, onNewMessage, enabled = true } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const cursorRef = useRef<string | null>(null);
  const initializedRef = useRef(false);

  const processEventToMessage = useCallback((event: MatrixEvent, msgRoomId: string): Message => {
    return {
      id: event.event_id,
      roomId: event.roomId || msgRoomId,
      sender: event.sender,
      body: (event.content?.body as string) || '',
      timestamp: event.origin_server_ts || Date.now(),
      type: event.type,
      msgtype: event.content?.msgtype as string,
    };
  }, []);

  const loadInitialMessages = useCallback(async () => {
    if (!enabled || !roomId) return;

    const session = await authStorage.getSession();
    if (!session?.access_token) return;

    setIsLoading(true);

    try {
      const result = await getRoomMessages(
        roomId,
        session.access_token,
        'b',
        undefined,
        initialLimit
      );

      const msgs = result.messages
        .filter(e => e.type === 'm.room.message')
        .map(e => processEventToMessage(e, roomId))
        .sort((a, b) => a.timestamp - b.timestamp);

      setMessages(msgs);
      cursorRef.current = result.endCursor;
      setHasMore(result.hasMore);
      initializedRef.current = true;

    } catch (error) {
      console.error('[useRoomMessages] Error loading initial:', error);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, initialLimit, enabled, processEventToMessage]);

  const loadMore = useCallback(async () => {
    if (!enabled || !roomId || isLoading || !hasMore) return;

    const session = await authStorage.getSession();
    if (!session?.access_token) return;

    setIsLoading(true);

    try {
      const result = await getRoomMessages(
        roomId,
        session.access_token,
        'b',
        cursorRef.current || undefined,
        initialLimit
      );

      const newMessages = result.messages
        .filter(e => e.type === 'm.room.message')
        .map(e => processEventToMessage(e, roomId))
        .sort((a, b) => a.timestamp - b.timestamp);

      const existingIds = new Set(messages.map(m => m.id));
      const uniqueNew = newMessages.filter(m => !existingIds.has(m.id));

      setMessages(prev => [...prev, ...uniqueNew]);
      cursorRef.current = result.endCursor;
      setHasMore(result.hasMore);

    } catch (error) {
      console.error('[useRoomMessages] Error loading more:', error);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, initialLimit, enabled, isLoading, hasMore, messages, processEventToMessage]);

  const sendMessage = useCallback(async (body: string): Promise<boolean> => {
    if (!roomId || !body.trim()) return false;

    const session = await authStorage.getSession();
    if (!session?.access_token) return false;

    setIsSending(true);

    try {
      const eventId = await sendRoomMessage(roomId, session.access_token, body.trim());

      if (eventId) {
        const tempMessage: Message = {
          id: eventId,
          roomId,
          sender: session.user_id,
          body: body.trim(),
          timestamp: Date.now(),
          type: 'm.room.message',
          msgtype: 'm.text',
        };

        setMessages(prev => [...prev, tempMessage]);
        onNewMessage?.(tempMessage);
        return true;
      }

      return false;
    } catch (error) {
      console.error('[useRoomMessages] Error sending:', error);
      return false;
    } finally {
      setIsSending(false);
    }
  }, [roomId, onNewMessage]);

  const refresh = useCallback(async () => {
    cursorRef.current = null;
    setMessages([]);
    setHasMore(true);
    initializedRef.current = false;
    await loadInitialMessages();
  }, [loadInitialMessages]);

  const handleNewMessages = useCallback((eventRoomId: string, events: MatrixEvent[]) => {
    if (eventRoomId !== roomId) return;

    const newMessages = events
      .filter(e => e.type === 'm.room.message')
      .map(e => processEventToMessage(e, roomId));

    if (newMessages.length > 0) {
      setMessages(prev => {
        // Filtrar duplicados usando event_id
        const existingIds = new Set(prev.map(m => m.id));
        const uniqueNew = newMessages.filter(m => !existingIds.has(m.id));

        if (uniqueNew.length === 0) return prev;

        return [...prev, ...uniqueNew];
      });
      newMessages.forEach(msg => onNewMessage?.(msg));
    }
  }, [roomId, onNewMessage, processEventToMessage]);

  const syncLoop = useSyncLoop({
    onMessages: handleNewMessages,
    enabled: enabled,
  });

  useEffect(() => {
    if (!enabled || !roomId) return;

    // Solo iniciar si no está ya corriendo
    if (!syncLoop.isRunning) {
      syncLoop.startSync();
    }

    // Cargar mensajes iniciales solo una vez
    if (!initializedRef.current) {
      loadInitialMessages();
    }

    return () => {
      syncLoop.stopSync();
    };
  }, [roomId, enabled, loadInitialMessages]);

  return {
    messages,
    isLoading,
    hasMore,
    loadMore,
    sendMessage,
    isSending,
    refresh,
  };
};
