import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getJoinedRooms, getInvitedRooms, getRoomMembers, leaveRoom, getRoomName, joinRoom } from '@/src/services/matrix';
import { authStorage } from '@/src/shared/storage/auth-storage';
import { getUsernameFromUserId } from '@/src/shared/utils/format';
import { ChatRoom } from '@/src/shared/types/room';

interface ChatContextType {
  chats: ChatRoom[];
  isLoading: boolean;
  loadChats: () => Promise<void>;
  getChatById: (roomId: string) => ChatRoom | undefined;
  removeChat: (roomId: string) => Promise<void>;
  acceptInvite: (roomId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadChats = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = await authStorage.getSession();
      if (!session?.access_token) {
        setChats([]);
        return;
      }

      // Obtener salas unidas Y salas invitadas
      const [joinedRoomIds, invitedRooms] = await Promise.all([
        getJoinedRooms(session.access_token),
        getInvitedRooms(session.access_token).catch(() => []),
      ]);

      // Para cada sala, obtener miembros y nombre
      const chatRooms: ChatRoom[] = await Promise.all(
        joinedRoomIds.map(async (roomId: string) => {
          try {
            const members = await getRoomMembers(roomId, session.access_token!);
            const roomName = await getRoomName(roomId, session.access_token!);
            const currentUserId = session.user_id;

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
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

      setChats(validChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
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

  // Cargar chats al montar
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
