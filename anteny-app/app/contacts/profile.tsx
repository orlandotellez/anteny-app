import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Alert, } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { createDirectChat } from "@/src/services/matrix";
import { getUsernameFromUserId } from "@/src/shared/utils/format";
import { useChats } from "@/src/features/chats/context/ChatContext";
import { Header } from "@/src/features/[chatId]/components/profile/Header";
import { AvatarProfile } from "@/src/features/contacts/components/profile/AvatarProfile";
import { Info } from "@/src/features/contacts/components/profile/Info";
import { Actions } from "@/src/features/contacts/components/profile/Actions";
import { THEME } from "@/src/shared/lib/theme";

export default function ContactProfileScreen() {
  const router = useRouter();

  const { userId, displayName, chatId, hasChat } = useLocalSearchParams<{
    userId: string;
    displayName?: string;
    chatId?: string;
    hasChat?: string;
  }>();

  const { session } = useAuth();
  const { loadChats } = useChats();

  const hasExistingChat = hasChat === "true" && !!chatId;

  // Nombre final seguro
  const finalDisplayName =
    displayName && displayName !== "undefined" && displayName !== ""
      ? displayName
      : getUsernameFromUserId(userId || "");

  // INVITAR
  const handleInvite = async () => {
    if (!session?.access_token || !userId) return;

    try {
      const room_id = await createDirectChat(userId, session.access_token);

      await loadChats();

      router.replace({
        pathname: "/[chatId]/profile",
        params: {
          chatId: room_id,
          userId: userId,
          displayName: finalDisplayName,
          isInvited: "true",
        },
      });
    } catch (error) {
      console.error("Error creating chat:", error);
      Alert.alert("Error", "No se pudo invitar al contacto");
    }
  };

  // IR AL CHAT
  const handleGoToChat = () => {
    if (chatId) {
      router.push(`/${chatId}`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* HEADER */}
      <Header />

      <ScrollView style={styles.scroll}>
        {/* PERFIL */}
        <AvatarProfile
          userId={userId || ""}
          displayName={finalDisplayName}
        />

        {/* INFO */}
        <Info userId={userId || ""} />

        {/* ACTIONS */}
        <Actions
          userId={userId || ""}
          displayName={finalDisplayName}
          hasExistingChat={hasExistingChat}
          onGoToChat={handleGoToChat}
          onInvite={handleInvite}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background
  },
  scroll: {
    flex: 1,
  },
});
