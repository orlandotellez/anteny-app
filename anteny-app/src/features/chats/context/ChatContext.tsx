import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode, useMemo } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { getJoinedRooms, getInvitedRooms, getRoomMembers, leaveRoom, getRoomName, joinRoom, rejectInvite, getLastRoomMessage } from '@/src/services/matrix';
import { getUsernameFromUserId } from '@/src/shared/utils/format';
import { ChatRoom } from '@/src/shared/types/matrixRoom';
import { authStorage } from '@/src/storage/auth-storage';

interface ChatContextType {
  chats: ChatRoom[];
  isLoading: boolean;
  loadChats: () => Promise<void>;
  getChatById: (roomId: string) => ChatRoom | undefined;
  removeChat: (roomId: string) => Promise<void>;
  acceptInvite: (roomId: string) => Promise<void>;
  rejectInvite: (roomId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Track rejected invites to prevent them from being re-added
  const rejectedInvitesRef = useRef<Set<string>>(new Set());

  const loadChats = useCallback(async () => {
    console.log('[loadChats] Starting...');
    setIsLoading(true);
    try {
      const session = await authStorage.getSession();
      console.log('[loadChats] Session:', session ? 'exists' : 'null');
      if (!session?.access_token) {
        console.log('[loadChats] No session, setting empty chats');
        setChats([]);
        return;
      }

      console.log('[loadChats] Fetching rooms...');
      // Obtener salas unidas Y salas invitadas
      const [joinedRoomIds, invitedRooms] = await Promise.all([
        getJoinedRooms(session.access_token).catch(() => []),
        getInvitedRooms(session.access_token).catch(() => []),
      ]);
      console.log('[loadChats] joinedRoomIds:', joinedRoomIds);
      console.log('[loadChats] invitedRooms:', invitedRooms);

      console.log('[loadChats] Processing rooms...');
      // Para cada sala, obtener miembros, nombre y último mensaje
      const chatRooms: ChatRoom[] = await Promise.all(
        joinedRoomIds.map(async (roomId: string) => {
          try {
            const members = await getRoomMembers(roomId, session.access_token!).catch(() => []);
            const roomName = await getRoomName(roomId, session.access_token!).catch(() => null);
            const currentUserId = session.user_id;

            // Obtener el último mensaje de la sala
            const lastMessageData = await getLastRoomMessage(roomId, session.access_token!).catch(() => null);

            // El endpoint /members devuelve eventos, no miembros directos
            // Para membership "join" → usar user_id
            // Para membership "invite" → usar state_key
            const otherMembers = members.filter((m: any) => {
              const memberUserId = m.content?.membership === 'invite'
                ? m.state_key
                : m.user_id;
              return memberUserId !== currentUserId;
            }).map((m: any) => ({
              user_id: m.content?.membership === 'invite' ? m.state_key : m.user_id,
              display_name: m.content?.displayname || null,
            }));

            // Es un DM si tiene exactamente 1 otro miembro
            const isDirect = otherMembers.length === 1;

            // Determinar el nombre del chat
            let chatName: string;
            if (isDirect) {
              // Para DMs, usar el display_name del otro usuario, o el username si no tiene
              const otherUser = otherMembers[0];
              chatName = otherUser.display_name || getUsernameFromUserId(otherUser.user_id);
            } else {
              // Para grupos, usar el nombre de la sala si existe, o "Group"
              chatName = roomName || `Group (${members.length})`;
            }

            return {
              room_id: roomId,
              members,
              isDirect,
              otherUser: isDirect ? {
                user_id: otherMembers[0].user_id,
                displayname: otherMembers[0].display_name || getUsernameFromUserId(otherMembers[0].user_id),
              } : undefined,
              name: chatName,
              lastMessage: lastMessageData?.body || undefined,
              lastMessageTimestamp: lastMessageData?.timestamp,
            };
          } catch (error) {
            console.error(`Error loading room ${roomId}:`, error);
            return null;
          }
        })
      );

      // Procesar salas invitadas (agregar como "invitaciones pendientes")
      for (const invitedRoom of invitedRooms) {
        const roomId = invitedRoom.room_id;
        const inviterUserId = invitedRoom.inviter_user_id;
        // Use displayname if available, otherwise extract username from user_id
        const inviterName = invitedRoom.inviter_name ||
          (inviterUserId ? getUsernameFromUserId(inviterUserId) : 'Unknown');

        // Agregar como chat con flag de invitación
        chatRooms.push({
          room_id: roomId,
          members: [],
          isDirect: true,
          otherUser: inviterUserId ? {
            user_id: inviterUserId,
            displayname: inviterName,
          } : undefined,
          name: inviterName,
          isInvite: true, // Flag para indicar que es una invitación pendiente
        });
      }

      // FILTRAR DUPLICADOS: remover salas invitadas que ya están en salas unidas
      // (el usuario ya se unió a esa sala)
      const seenRoomIds = new Set<string>();
      const uniqueChats: ChatRoom[] = [];

      for (const chat of chatRooms) {
        if (!seenRoomIds.has(chat.room_id)) {
          seenRoomIds.add(chat.room_id);
          uniqueChats.push(chat);
        }
      }

      // Filtrar salas que no se pudieron cargar y ordenar por nombre
      const validChats = uniqueChats
        .filter((chat): chat is ChatRoom => chat !== null)
        // Also filter out rejected invites
        .filter(chat => !rejectedInvitesRef.current.has(chat.room_id))
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

      setChats(validChats);
      console.log('[loadChats] Chats loaded:', validChats.length);
    } catch (error) {
      console.error('[loadChats] Error:', error);
    } finally {
      console.log('[loadChats] Finished, setting isLoading to false');
      setIsLoading(false);
    }
  }, []);

  const getChatById = useCallback((roomId: string) => {
    return chats.find(chat => chat.room_id === roomId);
  }, [chats]);

  const removeChat = useCallback(async (roomId: string) => {
    try {
      const session = await authStorage.getSession();
      if (!session?.access_token) return;

      // Abandonar la sala en Matrix
      await leaveRoom(roomId, session.access_token);

      // Actualizar el estado local
      setChats(prev => prev.filter(chat => chat.room_id !== roomId));
    } catch (error) {
      console.error('Error removing chat:', error);
      throw error;
    }
  }, []);

  const acceptInvite = useCallback(async (roomId: string) => {
    try {
      const session = await authStorage.getSession();
      if (!session?.access_token) return;

      rejectedInvitesRef.current.delete(roomId);

      setChats(prev => prev.filter(chat => chat.room_id !== roomId));

      // Unirse a la sala (aceptar invitación)
      await joinRoom(roomId, session.access_token);

      // Recargar los chats
      await loadChats();
    } catch (error) {
      console.error('Error accepting invite:', error);
      throw error;
    }
  }, [loadChats]);

  const handleRejectInvite = useCallback(async (roomId: string) => {
    try {
      const session = await authStorage.getSession();
      if (!session?.access_token) return;

      rejectedInvitesRef.current.add(roomId);

      setChats(prev => {
        console.log('[handleRejectInvite] Current chats:', prev.map(c => c.room_id));
        console.log('[handleRejectInvite] Removing room:', roomId);
        const filtered = prev.filter(chat => chat.room_id !== roomId);
        console.log('[handleRejectInvite] After filter:', filtered.map(c => c.room_id));
        return filtered;
      });

      // Rechazar la invitación en Matrix
      await rejectInvite(roomId, session.access_token);

      console.log('[handleRejectInvite] Invite rejected successfully');
    } catch (error) {
      console.error('Error rejecting invite:', error);
      // Remove from rejected set on error so it can be retried
      rejectedInvitesRef.current.delete(roomId);
      // Reload chats on error to restore state
      await loadChats();
      throw error;
    }
  }, [loadChats]);

  // Cargar chats al montar
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    let isMounted = true;
    let activeIntervalId: ReturnType<typeof setInterval> | null = null;
    let backgroundIntervalId: ReturnType<typeof setInterval> | null = null;

    // Intervalos configurables
    const ACTIVE_POLL_INTERVAL = 3000;  // 3 segundos cuando app está activa
    const BACKGROUND_POLL_INTERVAL = 10000; // 10 segundos cuando app está en background

    const checkForInvites = async () => {
      if (!isMounted) return;
      try {
        const session = await authStorage.getSession();
        if (!session?.access_token) return;

        // Solo verificar invitaciones, no recargar todo
        const invitedRooms = await getInvitedRooms(session.access_token).catch(() => []);

        if (!isMounted) return;

        if (invitedRooms.length > 0) {
          // Agregar solo las invitaciones nuevas que no estén en la lista
          setChats(prev => {
            const existingIds = new Set(prev.map(c => c.room_id));

            // Filter out invites that were rejected
            const newInvites = invitedRooms.filter(r =>
              !existingIds.has(r.room_id) && !rejectedInvitesRef.current.has(r.room_id)
            );

            if (newInvites.length === 0) return prev;

            const inviteChats: ChatRoom[] = newInvites.map(invitedRoom => {
              const inviterUserId = invitedRoom.inviter_user_id;
              const inviterName = invitedRoom.inviter_name ||
                (inviterUserId ? getUsernameFromUserId(inviterUserId) : 'Unknown');

              return {
                room_id: invitedRoom.room_id,
                members: [],
                isDirect: true,
                otherUser: inviterUserId ? {
                  user_id: inviterUserId,
                  displayname: inviterName,
                } : undefined,
                name: inviterName,
                isInvite: true,
              };
            });

            console.log('[ChatContext] New invites found:', newInvites.length);
            return [...prev, ...inviteChats];
          });
        }
      } catch (error) {
        // Silently ignore polling errors
      }
    };

    // Iniciar polling activo (app en foreground)
    const startActivePolling = () => {
      console.log('[ChatContext] Starting active polling (3s)');
      if (backgroundIntervalId) {
        clearInterval(backgroundIntervalId);
        backgroundIntervalId = null;
      }
      if (!activeIntervalId) {
        checkForInvites(); // Ejecutar inmediatamente
        activeIntervalId = setInterval(checkForInvites, ACTIVE_POLL_INTERVAL);
      }
    };

    // Iniciar polling pasivo (app en background)
    const startBackgroundPolling = () => {
      console.log('[ChatContext] Starting background polling (10s)');
      if (activeIntervalId) {
        clearInterval(activeIntervalId);
        activeIntervalId = null;
      }
      if (!backgroundIntervalId) {
        backgroundIntervalId = setInterval(checkForInvites, BACKGROUND_POLL_INTERVAL);
      }
    };

    // Manejar cambios de AppState
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('[ChatContext] AppState changed to:', nextAppState);

      if (nextAppState === 'active') {
        // App viene al foreground → polling activo + recargar ahora
        startActivePolling();
        checkForInvites(); // Recargar inmediatamente
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App va a background → polling pasivo
        startBackgroundPolling();
      }
    };

    // Escuchar cambios de AppState
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Iniciar con polling activo por defecto (asumimos que la app arranca activa)
    startActivePolling();

    const timeoutId = setTimeout(checkForInvites, 1000);

    return () => {
      isMounted = false;
      subscription.remove();
      if (activeIntervalId) clearInterval(activeIntervalId);
      if (backgroundIntervalId) clearInterval(backgroundIntervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  const value: ChatContextType = {
    chats,
    isLoading,
    loadChats,
    getChatById,
    removeChat,
    acceptInvite,
    rejectInvite: handleRejectInvite,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChats() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChats must be used within a ChatProvider');
  }
  return context;
}
