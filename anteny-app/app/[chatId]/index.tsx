import React, { useEffect, useState, useCallback, useRef } from "react";
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
import { RoomMember } from "@/src/shared/types/matrixRoom";
import { useRoomMessages } from "@/src/hooks/useRoomMessages";

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { getChatById, loadChats } = useChats();
  const { session } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);

  const [isLoadingChat, setIsLoadingChat] = useState(true);
  const [chatData, setChatData] = useState<{
    name: string;
    otherUser?: { user_id: string; displayname: string };
    isDirect: boolean;
  } | null>(null);

  const {
    messages,
    isLoading: isLoadingMessages,
    hasMore,
    loadMore,
    sendMessage,
    deleteMessage,
    editMessage,
    isSending,
    isDeleting,
    isEditing,
  } = useRoomMessages({
    roomId: chatId || "",
    initialLimit: 50,
    onNewMessage: (msg) => {
      console.log("[ChatScreen] Nuevo mensaje:", msg.body);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    },
    enabled: !!chatId,
  });

  useEffect(() => {
    const loadChatData = async () => {
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

      if (!session?.access_token) {
        setIsLoadingChat(false);
        return;
      }

      try {
        setIsLoadingChat(true);
        await loadChats();
        const reloadedChat = getChatById(chatId);

        if (reloadedChat) {
          setChatData({
            name: reloadedChat.name || "Chat",
            otherUser: reloadedChat.otherUser,
            isDirect: reloadedChat.isDirect,
          });
        } else {
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
  }, [chatId, session, getChatById, loadChats]);

  const handleSendMessage = useCallback(async (body: string) => {
    if (!body.trim()) return false;
    const success = await sendMessage(body);
    if (success) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
    return success;
  }, [sendMessage]);

  const handleScroll = useCallback((event: any) => {
    const { contentOffset } = event.nativeEvent;
    const isAtTop = contentOffset.y < 50;

    if (!isLoadingMessages && hasMore && isAtTop) {
      loadMore();
    }
  }, [isLoadingMessages, hasMore, loadMore]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
          avatar={chatData.otherUser?.user_id || ""}
          name={chatData.name}
          isOnline={true}
          status={chatData.isDirect ? "DM" : "Group"}
        />

        {/* CHAT */}
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.chatContainer}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            onScroll={handleScroll}
            scrollEventThrottle={400}
          >
            <Conversation
              messages={messages}
              currentUserId={session?.user_id || ""}
              formatTime={formatTime}
              isLoadingMessages={isLoadingMessages}
              onDeleteMessage={deleteMessage}
              onEditMessage={editMessage}
              isDeleting={isDeleting}
              isEditing={isEditing}
            />
          </ScrollView>
        </View>

        {/* INPUT */}
        <Input
          onSendMessage={handleSendMessage}
          isSending={isSending}
        />
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
