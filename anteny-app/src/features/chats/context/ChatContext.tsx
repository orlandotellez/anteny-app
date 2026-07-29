import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { getUsernameFromUserId } from '@/src/shared/utils/format';
import { ChatRoom, RoomMember, InvitedRoom } from '@/src/shared/types/matrixRoom';
import { MatrixEvent, MemberEventContent } from '@/src/shared/types/matrixEvent';
import { authStorage } from '@/src/storage/auth-storage';
import { getInvitedRooms, getJoinedRooms, getRoomMembers, getRoomName, joinRoom, leaveRoom, rejectInvite } from '@/src/services/matrix/rooms';
import { getLastRoomMessage } from '@/src/services/matrix/messages';
import { useSyncLoop } from '@/src/hooks/useSyncLoop';

interface ChatContextType {
  chats: ChatRoom[];
  isLoading: boolean;
  loadChats: () => Promise<void>;
  getChatById: (roomId: string) => ChatRoom | undefined;
  removeChat: (roomId: string) => Promise<void>;
  acceptInvite: (roomId: string) => Promise<void>;
  rejectInvite: (roomId: string) => Promise<void>;
  pendingChatId: string | null;
  setPendingChatId: (roomId: string | null) => void;
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

  // Pending chat to auto-select when navigating to chats tab (used by contacts -> chat)
  const [pendingChatId, setPendingChatId] = useState<string | null>(null);

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
        getInvitedRooms({ token: session.access_token }).catch(() => []),
      ]);
      console.log('[loadChats] joinedRoomIds:', joinedRoomIds);
      console.log('[loadChats] invitedRooms:', invitedRooms);

      console.log('[loadChats] Processing rooms...');
      // Para cada sala, obtener miembros, nombre y último mensaje
      const chatRooms: (ChatRoom | null)[] = await Promise.all(
        joinedRoomIds.map(async (roomId: string) => {
          try {
            const memberEvents = await getRoomMembers({ roomId, token: session.access_token! }).catch(() => []);
            const roomName = await getRoomName({ roomId, token: session.access_token! }).catch(() => null);
            const currentUserId = session.user_id;

            // Obtener el último mensaje de la sala
            const lastMessageData = await getLastRoomMessage({
              roomId: roomId,
              token: session.access_token!
            }).catch(() => null);

            // Convertir eventos de miembros a RoomMember
            const members: RoomMember[] = memberEvents
              .filter((m: MatrixEvent) => {
                const content = m.content as unknown as MemberEventContent | undefined;
                return content?.membership === 'join';
              })
              .map((m: MatrixEvent) => {
                const content = m.content as unknown as MemberEventContent | undefined;
                return {
                  user_id: m.state_key ?? m.sender,
                  display_name: content?.displayname,
                  avatar_url: content?.avatar_url,
                };
              });

            // El endpoint /members devuelve eventos, no miembros directos
            // Para membership "join" → usar state_key (o sender si no hay state_key)
            // Para membership "invite" → usar state_key
            const otherMembers = memberEvents
              .filter((m: MatrixEvent) => {
                const content = m.content as unknown as MemberEventContent | undefined;
                const memberUserId = m.state_key ?? m.sender;
                return memberUserId !== currentUserId;
              })
              .map((m: MatrixEvent) => {
                const content = m.content as unknown as MemberEventContent | undefined;
                return {
                  user_id: m.state_key ?? m.sender,
                  display_name: content?.displayname || null,
                };
              });

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
        if (chat && !seenRoomIds.has(chat.room_id)) {
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

      // Remover de la UI inmediatamente (incluso si el server falla)
      setChats(prev => prev.filter(chat => chat.room_id !== roomId));

      if (!session?.access_token) return;

      // Best-effort: intentar abandonar la sala en el server
      // Si el otro usuario ya eliminó el room, esto va a fallar (404),
      // pero el chat ya se removió de la UI.
      await leaveRoom({ roomId, token: session.access_token }).catch(() => {
        console.warn(`[removeChat] Could not leave room ${roomId} on server, removed locally`);
      });
    } catch (error) {
      console.error('Error removing chat:', error);
    }
  }, []);

  const acceptInvite = useCallback(async (roomId: string) => {
    try {
      const session = await authStorage.getSession();
      if (!session?.access_token) return;

      rejectedInvitesRef.current.delete(roomId);

      // Remover la invitación de la UI inmediatamente
      setChats(prev => prev.filter(chat => chat.room_id !== roomId));

      // Unirse a la sala en Matrix
      await joinRoom({ roomId, token: session.access_token });

      // NO llamamos a loadChats() porque puede haber race condition:
      // el server a veces todavía reporta el room como invitado en getInvitedRooms()
      // y loadChats lo volvería a agregar causando un loop.
      // En su lugar, el caller (chats screen) navega al room y los datos
      // se cargan al entrar. El próximo sync/poll refrescará la lista.
    } catch (error) {
      console.error('Error accepting invite:', error);
      // Si falló, recargar para restaurar estado
      await loadChats();
      throw error;
    }
  }, [loadChats]);

  const handleRejectInvite = useCallback(async (roomId: string) => {
    const session = await authStorage.getSession();

    // Marcar como rechazada ANTES de remover, para que no se vuelva a agregar
    // aunque el server falle o el sync loop la traiga de vuelta
    rejectedInvitesRef.current.add(roomId);

    // Remover de la UI inmediatamente (incluso si el server falla)
    setChats(prev => {
      console.log('[handleRejectInvite] Removing room:', roomId);
      return prev.filter(chat => chat.room_id !== roomId);
    });

    if (!session?.access_token) return;

    // Best-effort: intentar rechazar en el server
    // Si la sala ya no existe (stale invite), el server devuelve error
    // pero la invitación ya se eliminó de la UI y no se volverá a agregar
    await rejectInvite({ roomId, token: session.access_token }).catch((err) => {
      console.warn(`[handleRejectInvite] Server rejected failed for ${roomId}, removed locally:`, err);
    });
  }, []);

  // === SYNC LOOP ÚNICO: invitaciones en TIEMPO REAL vía Matrix /sync ===
  // El sync loop hace long-polling (30s timeout) al endpoint /sync de Matrix.
  // Cuando el server detecta una invitación nueva, responde al INSTANTE.
  // Los datos de la invite (invitador, nombre) vienen DIRECTAMENTE del sync,
  // SIN llamadas HTTP secundarias.
  const handleInvite = useCallback((invite: InvitedRoom) => {
    setChats(prev => {
      // No agregar si ya existe o fue rechazada
      if (prev.some(c => c.room_id === invite.room_id)) return prev;
      if (rejectedInvitesRef.current.has(invite.room_id)) return prev;

      const inviterName = invite.inviter_name ||
        (invite.inviter_user_id ? getUsernameFromUserId(invite.inviter_user_id) : 'Unknown');

      const newChat: ChatRoom = {
        room_id: invite.room_id,
        members: [],
        isDirect: true,
        otherUser: invite.inviter_user_id ? {
          user_id: invite.inviter_user_id,
          displayname: inviterName,
        } : undefined,
        name: inviterName,
        isInvite: true,
      };

      console.log('[ChatContext] New invite via sync:', invite.room_id, inviterName);
      return [...prev, newChat];
    });
  }, []);

  useSyncLoop({
    onInvite: handleInvite,
    enabled: true,
  });

  // === Cargar chats al montar ===
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const value: ChatContextType = {
    chats,
    isLoading,
    loadChats,
    getChatById,
    removeChat,
    acceptInvite,
    rejectInvite: handleRejectInvite,
    pendingChatId,
    setPendingChatId,
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
