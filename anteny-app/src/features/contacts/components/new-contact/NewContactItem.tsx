import { useState } from "react";
import { THEME } from "@/src/shared/lib/theme";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { createDirectChat } from "@/src/services/matrix";
import { useChats } from "@/src/features/chats/context/ChatContext";
import { router } from "expo-router";

interface NewContactItemProps {
  user_id: string;
  displayname: string;
  existingChatRoomId?: string;
}

export const NewContactItem = ({ user_id, displayname, existingChatRoomId }: NewContactItemProps) => {
  const { session } = useAuth();
  const { loadChats } = useChats();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const hasExistingChat = !!existingChatRoomId;

  const handlePress = async () => {
    if (!session?.access_token) return;

    if (hasExistingChat) {
      // Ir al chat existente
      router.push(`/${existingChatRoomId}`);
      return;
    }

    // Crear nuevo chat
    setIsLoading(true);
    try {
      const room_id = await createDirectChat(user_id, session.access_token);

      // Recargar los chats para que aparezcan en la lista
      await loadChats();

      // Redirigir al chat
      router.push(`/${room_id}`);
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile = () => {
    // Navegar a la pantalla de perfil del contacto
    router.push({
      pathname: "/contacts/profile",
      params: {
        userId: user_id,
        displayName: displayname,
        hasChat: hasExistingChat ? "true" : "false",
        chatId: existingChatRoomId || "",
      },
    });
  };

  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          {displayname?.[0] || "?"}
        </Text>
      </View>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name}>{displayname}</Text>
        <Text style={styles.status}>
          {hasExistingChat ? "Chat existente" : "Disponible"}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.profileButton, isLoadingProfile && styles.inviteButtonDisabled]}
        onPress={handleViewProfile}
        disabled={isLoadingProfile}
      >
        {isLoadingProfile ? (
          <ActivityIndicator size="small" color={THEME.colors.primary} />
        ) : (
          <>
            <Feather name="user" size={18} color={THEME.colors.primary} />
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.inviteButton,
          hasExistingChat && styles.goToChatButton,
          isLoading && styles.inviteButtonDisabled
        ]}
        onPress={handlePress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={[styles.buttonText, hasExistingChat && styles.goToChatText]}>
            {hasExistingChat ? "Go to chat" : "Invite"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({

  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: THEME.colors.secondary,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  status: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
  },

  profileButton: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
    marginRight: 8,
    display: "flex",
    flexDirection: "row-reverse",
    gap: 10
  },

  inviteButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: THEME.colors.primary,
    minWidth: 100,
    alignItems: "center",
  },
  goToChatButton: {
    backgroundColor: THEME.colors.background,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  inviteButtonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#000",
    fontWeight: "700",
  },
  goToChatText: {
    color: THEME.colors.primary,
  },
  viewProfile: {
    color: THEME.colors.primary
  }
})
