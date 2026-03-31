import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";
import { router, useLocalSearchParams } from "expo-router";
import { users } from "@/src/shared/data/users";

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
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={THEME.colors.text_opacity} />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={20} color={THEME.colors.text_opacity} />
              </View>
            )}
            <View>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.status}>{user.isOnline ? "online" : user.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Ionicons name="call-outline" size={22} color={THEME.colors.text_opacity} />
          <MaterialIcons name="more-vert" size={22} color={THEME.colors.text_opacity} />
        </View>
      </View>

      {/* CHAT */}
      <ScrollView contentContainerStyle={styles.chatContainer}>
        <Text style={styles.date}>Today</Text>

        {/* Received */}
        <View style={styles.received}>
          <View style={styles.receivedBubble}>
            <Text style={styles.text}>
              Hey! Did you see the new design system update for the monolith
              project? 🌑
            </Text>
            <Text style={styles.time}>10:42 AM</Text>
          </View>
        </View>

        {/* Sent */}
        <View style={styles.sent}>
          <View style={styles.sentBubble}>
            <Text style={styles.text}>
              Yes! The pitch-black foundation looks incredible. 🚀
            </Text>
            <View style={styles.sentMeta}>
              <Text style={styles.time}>10:44 AM</Text>
              <MaterialIcons name="done-all" size={16} color={THEME.colors.primary} />
            </View>
          </View>
        </View>

        {/* Image message */}
        <View style={styles.received}>
          <View style={styles.receivedBubble}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZQHdqDgSI2EUZmDi7TMVsscd_rJhSdM35M_fqiToXA8a7TeFhZvpodIfm8r0b_R_NgwVfrroUWygT61VitMcS3jB4sjbbr-z4aHbQM7mTrMWzLDIr_ast7i0fnp1zswyVb0KyORZ3HFdPovANf0ubsGSOoIDOIOlRdtDrsk4n0QcajwqZh0wk2yffE60wf4fR7gS4BOhrBprLEEoeROLN3TncXpiHmu8bp48R60i_f7Nl_95UtWSp9ouysLo_lV17-Ts_IrXimPg",
              }}
              style={styles.image}
            />
            <Text style={styles.text}>
              This is the reference I was talking about.
            </Text>
            <Text style={styles.time}>10:45 AM</Text>
          </View>
        </View>

        {/* Typing */}
        <View style={styles.typing}>
          <Text style={styles.typingText}>Alex is typing...</Text>
        </View>
      </ScrollView>

      {/* INPUT */}
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <Ionicons name="happy-outline" size={22} color={THEME.colors.text_opacity} />

          <TextInput
            placeholder="Message"
            placeholderTextColor={THEME.colors.text_opacity}
            style={styles.input}
          />

          <Ionicons name="attach" size={22} color={THEME.colors.text_opacity} />
          <Ionicons name="camera-outline" size={22} color={THEME.colors.text_opacity} />
        </View>

        <TouchableOpacity style={styles.micButton}>
          <MaterialIcons name="mic" size={22} color="#002109" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: THEME.colors.secondary,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconBtn: {
    padding: 4,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    color: THEME.colors.text_title,
    fontWeight: "bold",
  },
  status: {
    color: THEME.colors.primary,
    fontSize: 12,
  },

  chatContainer: {
    padding: 12,
    paddingBottom: 80,
  },
  date: {
    alignSelf: "center",
    color: THEME.colors.text_opacity,
    backgroundColor: "#1b1b1b",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 10,
    marginVertical: 10,
  },

  received: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  sent: {
    alignItems: "flex-end",
    marginBottom: 10,
  },

  receivedBubble: {
    backgroundColor: "#2a2a2a",
    padding: 10,
    borderRadius: 12,
    maxWidth: "85%",
  },
  sentBubble: {
    backgroundColor: THEME.colors.secondary,
    padding: 10,
    borderRadius: 12,
    maxWidth: "85%",
  },

  text: {
    color: "#e2e2e2",
  },
  time: {
    fontSize: 10,
    color: THEME.colors.text_opacity,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  sentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    justifyContent: "flex-end",
    marginTop: 4,
  },

  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 6,
  },

  typing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  typingText: {
    color: THEME.colors.text_opacity,
    fontSize: 12,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },

  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0e0e0e",
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },

  input: {
    flex: 1,
    color: "#e2e2e2",
  },

  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
