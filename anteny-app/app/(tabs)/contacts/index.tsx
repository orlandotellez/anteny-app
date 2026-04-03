import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  View,
} from "react-native";
import { THEME } from "@/src/shared/lib/theme";
import type { ActionItem } from "@/src/shared/types/contacts";
import { ContactItem } from "@/src/features/contacts/components/index/ContactItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/src/features/contacts/components/index/Header";
import { router } from "expo-router";
import { ActionButton } from "@/src/features/contacts/components/index/ActionButton";
import { useChats } from "@/src/features/chats/context/ChatContext";

const actions: ActionItem[] = [
  { id: "a", type: "action", action: () => router.push("/contacts/new-group"), title: "New group", icon: "people" },
  { id: "b", type: "action", action: () => router.push("/contacts/new-contact"), title: "New contact", icon: "person-add" },
]

export default function ContactScreen() {
  const { chats } = useChats();

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleContactPress = (roomId: string) => {
    router.push(`/${roomId}`);
  };

  // Filtrar solo DMs (chats directos)
  const directChats = useMemo(() => {
    let result = chats.filter(chat => chat.isDirect);

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(chat =>
        chat.name?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [chats, searchQuery]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <Header
        onSearchToggle={() => setShowSearch(!showSearch)}
        showSearch={showSearch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <FlatList
        data={directChats}
        keyExtractor={(item) => item.room_id}
        renderItem={({ item }) => (
          <ContactItem
            id={item.room_id}
            name={item.name || "Chat"}
            status={item.isDirect ? "Online" : "Group"}
            isOnline={true}
            onPress={() => handleContactPress(item.room_id)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            {/* ActionButton */}
            {actions.map((action) => (
              <ActionButton
                key={action.id}
                {...action}
              />
            ))}

            <Text style={styles.subtitle}>Your contacts({directChats.length})</Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? "No se encontraron contactos" : "No tienes contactos aún"}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? "Intenta con otro término" : "Busca usuarios y crea un chat para verlo aquí"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  subtitle: {
    color: THEME.colors.text_opacity,
    fontSize: 12,
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: THEME.colors.text_title,
    fontSize: 16,
    fontWeight: "600",
  },
  emptySubtext: {
    color: "#888",
    marginTop: 8,
    textAlign: "center",
  },
});
