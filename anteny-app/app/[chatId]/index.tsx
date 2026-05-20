import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { THEME } from "@/src/shared/lib/theme";
import { formatDate, formatTime } from "@/src/shared/utils/time";
import { useLocalSearchParams, router } from "expo-router";
import { Header } from "@/src/features/[chatId]/components/Header";
import { Input } from "@/src/features/[chatId]/components/Input";
import { Conversation } from "@/src/features/[chatId]/components/Conversation";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChats } from "@/src/features/chats/context/ChatContext";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { MatrixEvent, MemberEventContent } from "@/src/shared/types/matrixEvent";
import { useRoomMessages } from "@/src/hooks/useRoomMessages";
import { Loading } from "@/src/shared/components/common/Loading";
import { NotFound } from "@/src/shared/components/common/NotFound";
import { getRoomMembers } from "@/src/services/matrix/rooms";
import { IChatData } from "@/src/shared/types/chats";

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { getChatById, loadChats } = useChats();
  const { session } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);

  const [isLoadingChat, setIsLoadingChat] = useState(true);
  const [chatData, setChatData] = useState<IChatData | null>(null);
  const [replyingToMessage, setReplyingToMessage] = useState<any | null>(null);
  const [visibleDate, setVisibleDate] = useState<string>("Today");

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
    //    onNewMessage: (msg) => {
    //      console.log("[ChatScreen] Nuevo mensaje:", msg.body);
    //      setTimeout(() => {
    //        scrollViewRef.current?.scrollToEnd({ animated: true });
    //      }, 100);
    //    },
    enabled: !!chatId,
  });

  // empezar hacia abajo con los mensajes más recientes
  useEffect(() => {
    if (messages.length > 0 && !isLoadingMessages) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages.length, isLoadingMessages]);

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
          const memberEvents = await getRoomMembers(chatId, session.access_token);
          const currentUserId = session.user_id;

          // Convertir eventos de miembros a objetos con user_id
          const otherMembers = memberEvents
            .filter((m: MatrixEvent) => {
              const content = m.content as unknown as MemberEventContent | undefined;
              const userId = m.state_key ?? m.sender;
              return content?.membership === 'join' && userId !== currentUserId;
            })
            .map((m: MatrixEvent) => {
              const content = m.content as unknown as MemberEventContent | undefined;
              return {
                user_id: m.state_key ?? m.sender,
                display_name: content?.displayname ?? null,
              };
            });

          const isDirect = otherMembers.length === 1;

          setChatData({
            name: isDirect
              ? (otherMembers[0]?.display_name || otherMembers[0]?.user_id || "Chat")
              : `Group (${memberEvents.length})`,
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

  const handleSendMessage = useCallback(async (body: string, replyTo?: { eventId: string; body: string; sender: string }) => {
    if (!body.trim()) return false;
    const success = await sendMessage(body, replyTo);
    if (success) {
      // Clear reply after sending
      setReplyingToMessage(null);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
    return success;
  }, [sendMessage]);

  const handleCancelReply = useCallback(() => {
    setReplyingToMessage(null);
  }, []);

  const handleScroll = useCallback((event: any) => {
    const { contentOffset } = event.nativeEvent;
    const isAtTop = contentOffset.y < 50;

    if (!isLoadingMessages && hasMore && isAtTop) {
      loadMore();
    }

    const scrollY = contentOffset.y;
    const approximateVisibleIndex = Math.floor(scrollY / 60); // approximate message height

    if (messages.length > 0 && approximateVisibleIndex >= 0) {
      const visibleIndex = Math.min(approximateVisibleIndex, messages.length - 1);
      const visibleMessage = messages[visibleIndex];
      if (visibleMessage) {
        const newDate = formatDate(visibleMessage.timestamp);
        if (newDate !== visibleDate) {
          setVisibleDate(newDate);
        }
      }
    }
  }, [isLoadingMessages, hasMore, loadMore, messages, visibleDate]);


  if (isLoadingChat) {
    return <Loading text="Loading chats..." />;
  }

  if (!chatData) {
    return <NotFound text="Chat not found" />
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
          onProfilePress={() => {
            if (chatData.isDirect && chatData.otherUser) {
              router.push({
                pathname: "/[chatId]/profile",
                params: {
                  chatId,
                  userId: chatData.otherUser.user_id,
                  displayName: chatData.otherUser.displayname || chatData.name,
                },
              });
            }
          }}
        />

        {/* CHAT */}
        <View style={{ flex: 1 }}>
          {/* Sticky Date Header */}
          <View style={styles.stickyDateContainer}>
            <View style={styles.stickyDateBadge}>
              <Text style={styles.stickyDateText}>{visibleDate}</Text>
            </View>
          </View>

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
              onReplyMessage={setReplyingToMessage}
              isDeleting={isDeleting}
              isEditing={isEditing}
            />
          </ScrollView>
        </View>

        {/* INPUT */}
        <Input
          onSendMessage={handleSendMessage}
          isSending={isSending}
          replyingTo={replyingToMessage}
          onCancelReply={handleCancelReply}
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
  name: {
    color: THEME.colors.text_title,
    fontWeight: "bold",
  },
  chatContainer: {
    padding: 12,
    paddingBottom: 20,
    paddingTop: 40, // Space for sticky date
  },
  stickyDateContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
    paddingVertical: 8,
  },
  stickyDateBadge: {
    backgroundColor: "#1b1b1b",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stickyDateText: {
    color: THEME.colors.text_opacity,
    fontSize: 12,
    fontWeight: "600",
  },
});
