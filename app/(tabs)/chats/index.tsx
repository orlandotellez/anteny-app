import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";
import { ChatItem } from "@/src/features/chats/components/ChatItem";
import type { IChatItem } from "@/src/shared/types/chats"
import { chats } from "@/src/shared/data/chats";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Anteny App</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search" size={22} color={THEME.colors.text_opacity} />
          <MaterialIcons name="more-vert" size={22} color={THEME.colors.text_opacity} />
        </View>
      </View>

      {/* LIST */}
      <FlatList<IChatItem>
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem
            id={item.id}
            avatar={item.avatar}
            name={item.name}
            message={item.message}
            time={item.time}
            unread={item.unread}
            online={item.online}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="chatbubble" size={24} color="#002109" />
      </TouchableOpacity>
    </SafeAreaView>
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
    backgroundColor: THEME.colors.secondary,
    padding: 16,
  },

  title: {
    color: THEME.colors.primary,
    fontSize: 22,
    fontWeight: "bold",
  },

  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },
  chatItem: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },

  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    backgroundColor: THEME.colors.primary,
    borderRadius: 5,
  },

  chatContent: {
    flex: 1,
    marginLeft: 12,
  },

  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    color: THEME.colors.text_title,
    fontWeight: "bold",
    fontSize: 16,
  },

  time: {
    color: THEME.colors.text_opacity,
    fontSize: 12,
  },

  messageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },

  message: {
    color: THEME.colors.text_opacity,
    flex: 1,
  },

  badge: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    justifyContent: "center",
  },

  badgeText: {
    color: "#002109",
    fontWeight: "bold",
    fontSize: 12,
  },

  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: THEME.colors.primary,
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#131313",
  },

  bottomItem: {
    alignItems: "center",
  },

  bottomItemActive: {
    alignItems: "center",
  },

  bottomText: {
    color: THEME.colors.text_opacity,
    fontSize: 10,
  },

  bottomTextActive: {
    color: THEME.colors.primary,
    fontSize: 10,
  },
});

