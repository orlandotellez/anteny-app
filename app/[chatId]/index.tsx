import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { THEME } from "@/src/shared/lib/theme";
import { useLocalSearchParams } from "expo-router";
import { users } from "@/src/shared/data/users";
import { Header } from "@/src/features/[chatId]/components/Header";
import { Input } from "@/src/features/[chatId]/components/Input";
import { Conversation } from "@/src/features/[chatId]/components/Conversation";

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const user = users.find((u) => u.id === chatId);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>Chat not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      {/* HEADER */}
      <Header
        id={user.id}
        avatar={user.avatar}
        name={user.name}
        isOnline={user.isOnline}
        status={user.status}
      />

      {/* CHAT */}
      <ScrollView contentContainerStyle={styles.chatContainer}>
        <Conversation />
      </ScrollView>

      {/* INPUT */}
      <Input />
    </KeyboardAvoidingView>
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
    paddingBottom: 80,
  },
});
