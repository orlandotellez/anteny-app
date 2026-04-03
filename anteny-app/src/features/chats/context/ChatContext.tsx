import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getJoinedRooms, getRoomMembers, leaveRoom, getRoomName } from '@/src/services/matrix';
import { authStorage } from '@/src/shared/storage/auth-storage';
import { getUsernameFromUserId } from '@/src/shared/utils/format';
import { ChatRoom } from '@/src/shared/types/room';

interface ChatContextType {
  chats: ChatRoom[];
  isLoading: boolean;
  loadChats: () => Promise<void>;
  getChatById: (roomId: string) => ChatRoom | undefined;
  removeChat: (roomId: string) => Promise<void>;
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

      // Obtener salas unidas
      const roomIds = await getJoinedRooms(session.access_token);

      // Para cada sala, obtener miembros y nombre
      const chatRooms: ChatRoom[] = await Promise.all(
        roomIds.map(async (roomId: string) => {
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

      // Filtrar salas que no se pudieron cargar y ordenar por nombre
      const validChats = chatRooms
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
