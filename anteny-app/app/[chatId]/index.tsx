import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { THEME } from "@/src/shared/lib/theme";
import { useLocalSearchParams } from "expo-router";
import { Header } from "@/src/features/[chatId]/components/Header";
import { Input } from "@/src/features/[chatId]/components/Input";
import { Conversation } from "@/src/features/[chatId]/components/Conversation";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChats } from "@/src/features/chats/context/ChatContext";
import { getRoomMembers } from "@/src/services/matrix";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { RoomMember } from "@/src/shared/types/room";

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { getChatById, loadChats } = useChats();
  const { session } = useAuth();
  const [isLoadingChat, setIsLoadingChat] = useState(true);
  const [chatData, setChatData] = useState<{
    name: string;
    otherUser?: { user_id: string; displayname: string };
    isDirect: boolean;
  } | null>(null);

  useEffect(() => {
    const loadChatData = async () => {
      // Primero intentar obtener del context
      const existingChat = getChatById(chatId);

      if (existingChat) {
        setChatData({
          name: existingChat.name || "Chat",
          otherUser: existingChat.otherUser,
          isDirect: existingChat.isDirect,
        });
        setIsLoadingChat(false);
        return;
      }

      // Si no está en el context, cargar desde Matrix
      if (!session?.access_token) {
        setIsLoadingChat(false);
        return;
      }

      try {
        setIsLoadingChat(true);

        // Recargar los chats
        await loadChats();

        // Intentar nuevamente después de recargar
        const reloadedChat = getChatById(chatId);

        if (reloadedChat) {
          setChatData({
            name: reloadedChat.name || "Chat",
            otherUser: reloadedChat.otherUser,
            isDirect: reloadedChat.isDirect,
          });
        } else {
          // Si aún no está, cargar los miembros directamente
          const members = await getRoomMembers(chatId, session.access_token);
          const currentUserId = session.user_id;

          const otherMembers = members.filter(
            (m: RoomMember) => m.user_id !== currentUserId
          );

          const isDirect = otherMembers.length === 1;

          setChatData({
            name: isDirect
              ? (otherMembers[0]?.display_name || otherMembers[0]?.user_id || "Chat")
              : `Group (${members.length})`,
            otherUser: isDirect ? {
              user_id: otherMembers[0].user_id,
              displayname: otherMembers[0].display_name || otherMembers[0].user_id,
            } : undefined,
            isDirect,
          });
        }
      } catch (error) {
        console.error("Error loading chat data:", error);
        setChatData({
          name: "Chat",
          isDirect: false,
        });
      } finally {
        setIsLoadingChat(false);
      }
    };

    if (chatId) {
      loadChatData();
    }
  }, [chatId, session]);

  if (isLoadingChat) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.loadingText}>Cargando chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!chatData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.name}>Chat no encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* HEADER */}
        <Header
          //id={chatData.otherUser?.user_id || chatId}
          avatar={chatData.otherUser?.user_id || ""}
          name={chatData.name}
          isOnline={true}
          status={chatData.isDirect ? "DM" : "Group"}
        />


        {/* CHAT */}
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.chatContainer}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            <Conversation />
          </ScrollView>
        </View>

        {/* INPUT */}
        <Input />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#888",
    marginTop: 10,
  },
  name: {
    color: THEME.colors.text_title,
    fontWeight: "bold",
  },
  chatContainer: {
    padding: 12,
    paddingBottom: 20,
  },
});
