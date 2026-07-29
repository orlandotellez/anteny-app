import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatView } from "@/src/features/[chatId]/components/ChatView";
import { styles } from "@/src/styles/chat/index.styles";
import { IChatData } from "@/src/shared/types/chats";

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();

  const handleProfilePress = (_chatId: string, chatData: IChatData) => {
    if (chatData.isDirect && chatData.otherUser) {
      router.push({
        pathname: "/[chatId]/profile",
        params: {
          chatId: _chatId,
          userId: chatData.otherUser.user_id,
          displayName: chatData.otherUser.displayname || chatData.name,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ChatView
          chatId={chatId || ""}
          onProfilePress={handleProfilePress}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
