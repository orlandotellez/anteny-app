import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { THEME } from "@/src/shared/lib/theme";
import { getColorFromName } from "@/src/shared/utils/format";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { createDirectChat } from "@/src/services/matrix";
import { useChats } from "@/src/features/chats/context/ChatContext";

interface UserInfoField {
  id: string;
  icon: string;
  label: string;
  value: string;
}

interface ProfileContactProps {
  displayName: string;
  userId: string;
  hasExistingChat?: boolean;
  existingChatRoomId?: string;
  onInvite?: () => void;
  onGoToChat?: () => void;
}

const ProfileContact = ({
  displayName,
  userId,
  hasExistingChat,
  existingChatRoomId,
  onInvite,
  onGoToChat,
}: ProfileContactProps) => {
  const avatarColor = getColorFromName(displayName);
  const initial = displayName ? displayName[0].toUpperCase() : "?";

  const fields: UserInfoField[] = [
    {
      id: "1",
      icon: "at",
      label: "Matrix ID",
      value: userId,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll}>
        {/* PERFIL */}
        <View style={styles.profile}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
        </View>

        {/* INFO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Info</Text>
          {fields.map((field) => (
            <View key={field.id} style={styles.fieldRow}>
              <View style={styles.fieldContent}>
                <View style={styles.fieldText}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <Text style={styles.fieldValue}>{field.value}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ACTIONS */}
        <View style={styles.section}>
          {hasExistingChat ? (
            <TouchableOpacity style={styles.goToChatBtn} onPress={onGoToChat}>
              <Feather name="message-circle" size={20} color="#fff" />
              <Text style={styles.goToChatText}>Ir al chat</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.inviteBtn} onPress={onInvite}>
              <Feather name="user-plus" size={20} color="#fff" />
              <Text style={styles.inviteText}>Invitar a {displayName}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function ContactProfileScreen() {
  const { userId, displayName, chatId, hasChat } = useLocalSearchParams<{
    userId: string;
    displayName: string;
    chatId?: string;
    hasChat?: string;
  }>();

  const { session } = useAuth();
  const { loadChats } = useChats();

  const hasExistingChat = hasChat === "true" && !!chatId;

  const handleInvite = async () => {
    if (!session?.access_token || !userId) return;

    try {
      const room_id = await createDirectChat(userId, session.access_token);
      await loadChats();

      // Navegar al perfil del chat
      router.replace({
        pathname: "/[chatId]/profile",
        params: {
          chatId: room_id,
          userId: userId,
          displayName: displayName,
          isInvited: "true",
        },
      });
    } catch (error) {
      console.error("Error creating chat:", error);
      Alert.alert("Error", "No se pudo invitar al contacto");
    }
  };

  const handleGoToChat = () => {
    if (chatId) {
      router.push(`/${chatId}`);
    }
  };

  return (
    <ProfileContact
      displayName={displayName || "Usuario"}
      userId={userId || ""}
      hasExistingChat={hasExistingChat}
      existingChatRoomId={chatId}
      onInvite={handleInvite}
      onGoToChat={handleGoToChat}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    backgroundColor: THEME.colors.secondary,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  scroll: {
    flex: 1,
  },
  profile: {
    alignItems: "center",
    marginVertical: 25,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 50,
  },
  name: {
    color: "#fff",
    fontSize: 22,
    marginTop: 10,
    fontWeight: "bold",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 10,
  },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  fieldContent: {
    flexDirection: "row",
    flex: 1,
  },
  fieldText: {
    marginLeft: 10,
  },
  fieldLabel: {
    color: "#aaa",
    fontSize: 12,
  },
  fieldValue: {
    color: "#fff",
    fontSize: 16,
  },
  inviteBtn: {
    flexDirection: "row",
    backgroundColor: "#00a884",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  inviteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  goToChatBtn: {
    flexDirection: "row",
    backgroundColor: THEME.colors.primary,
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  goToChatText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
