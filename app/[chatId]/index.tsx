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
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
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
  name: {
    color: THEME.colors.text_title,
    fontWeight: "bold",
  },
  chatContainer: {
    padding: 12,
    paddingBottom: 20,
  },
});
