import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";
import { ChatItem } from "@/src/features/chats/components/ChatItem";
import { Header } from "@/src/features/chats/components/Header";
import type { IChatItem } from "@/src/shared/types/chats"
import { chats } from "@/src/shared/data/chats";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <Header />

      {/* LIST */}
      <FlatList<IChatItem>
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem {...item} />
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
});
