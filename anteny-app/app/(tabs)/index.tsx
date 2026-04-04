import { useState, useMemo } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";
import { ChatItem } from "@/src/features/chats/components/ChatItem";
import { Header } from "@/src/features/chats/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChats } from "@/src/features/chats/context/ChatContext";
import { router } from "expo-router";
import { ChatRoom } from "@/src/shared/types/room";

type FilterType = "all" | "direct" | "groups" | "invites";

export default function ChatScreen() {
  const { chats, isLoading, loadChats, removeChat, acceptInvite, rejectInvite } = useChats();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const handleChatPress = (chat: ChatRoom) => {
    if (chat.isInvite) {
      Alert.alert(
        "Aceptar chat",
        `¿Quieres aceptar el chat con "${chat.name}"?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Aceptar",
            onPress: async () => {
              try {
                await acceptInvite(chat.room_id);
              } catch (error) {
                Alert.alert("Error", "No se pudo aceptar la invitación");
              }
            },
          },
        ]
      );
    } else {
      router.push(`/${chat.room_id}`);
    }
  };

  const handleChatLongPress = (roomId: string, chatName: string, isInvite?: boolean) => {
    if (isInvite) {
      // Para invitaciones, rechazar o aceptar
      Alert.alert(
        "Invitación",
        `¿Qué quieres hacer con "${chatName}"?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Aceptar",
            onPress: async () => {
              try {
                await acceptInvite(roomId);
              } catch (error) {
                Alert.alert("Error", "No se pudo aceptar la invitación");
              }
            },
          },
          {
            text: "Rechazar",
            style: "destructive",
            onPress: async () => {
              try {
                await rejectInvite(roomId);
              } catch (error) {
                Alert.alert("Error", "No se pudo rechazar la invitación");
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Eliminar chat",
        `¿Quieres eliminar el chat con "${chatName}"?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: async () => {
              try {
                await removeChat(roomId);
              } catch (error) {
                Alert.alert("Error", "No se pudo eliminar el chat");
              }
            },
          },
        ]
      );
    }
  };

  // Filtrar chats
  const filteredChats = useMemo(() => {
    let result = chats;

    // Filtrar por tipo
    if (activeFilter === "direct") {
      result = result.filter(chat => chat.isDirect && !chat.isInvite);
    } else if (activeFilter === "groups") {
      result = result.filter(chat => !chat.isDirect && !chat.isInvite);
    } else if (activeFilter === "invites") {
      result = result.filter(chat => chat.isInvite);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(chat =>
        chat.name?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [chats, activeFilter, searchQuery]);

  // Contar invitaciones pendientes
  const inviteCount = useMemo(() => {
    return chats.filter(chat => chat.isInvite).length;
  }, [chats]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <Header
        onSearchToggle={() => setShowSearch(!showSearch)}
        showSearch={showSearch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* FILTROS */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterBtn, activeFilter === "all" && styles.filterBtnActive]}
          onPress={() => setActiveFilter("all")}
        >
          <Text style={[styles.filterText, activeFilter === "all" && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, activeFilter === "direct" && styles.filterBtnActive]}
          onPress={() => setActiveFilter("direct")}
        >
          <Text style={[styles.filterText, activeFilter === "direct" && styles.filterTextActive]}>
            Direct
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, activeFilter === "groups" && styles.filterBtnActive]}
          onPress={() => setActiveFilter("groups")}
        >
          <Text style={[styles.filterText, activeFilter === "groups" && styles.filterTextActive]}>
            Groups
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, activeFilter === "invites" && styles.filterBtnActive]}
          onPress={() => setActiveFilter("invites")}
        >
          <Text style={[styles.filterText, activeFilter === "invites" && styles.filterTextActive]}>
            Invites ({inviteCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.loadingText}>Cargando chats...</Text>
        </View>
      ) : filteredChats.length > 0 ? (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.room_id}
          renderItem={({ item }) => (
            <ChatItem
              id={item.room_id}
              name={item.name || "Chat"}
              lastMessage={item.isInvite ? "Tap to accept" : (item.isDirect ? "DM" : "Group chat")}
              time={item.isInvite ? "Invite" : "now"}
              isOnline={!item.isInvite}
              onPress={() => handleChatPress(item)}
              onLongPress={() => handleChatLongPress(item.room_id, item.name || "Chat", item.isInvite)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshing={isLoading}
          onRefresh={loadChats}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery ? "No se encontraron chats" : "No tienes chats aún"}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchQuery ? "Intenta con otro término" : "Busca un usuario y crea un chat directo"}
          </Text>
        </View>
      )}

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
  filterContainer: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: THEME.colors.secondary,
  },
  filterBtnActive: {
    backgroundColor: THEME.colors.primary,
  },
  filterText: {
    color: THEME.colors.text_opacity,
    fontSize: 14,
  },
  filterTextActive: {
    color: "#000",
    fontWeight: "600",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    color: THEME.colors.text_title,
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    color: "#888",
    marginTop: 8,
    textAlign: "center",
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
