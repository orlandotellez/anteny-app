import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";
import { THEME } from "@/src/shared/lib/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/src/features/contacts/components/new-contact/Header";
import { SearchNewContact } from "@/src/features/contacts/components/new-contact/SearchNewContact";
import { NewContactItem } from "@/src/features/contacts/components/new-contact/NewContactItem";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { useChats } from "@/src/features/chats/context/ChatContext";
import { searchUsers } from "@/src/services/matrix/users";

interface UserResult {
  user_id: string;
  displayname?: string;
}

export default function NewContactScreen() {
  const { session } = useAuth();
  const { chats } = useChats();
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (term: string) => {
    if (!session?.access_token) return;

    setIsSearching(true);
    try {
      const results = await searchUsers(term, session.access_token);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Función para encontrar si ya existe un chat con el usuario
  const findChatWithUser = (userId: string) => {
    return chats.find(chat =>
      chat.otherUser?.user_id === userId
    );
  };

  // Mostrar usuarios vacio al inicio
  const displayData = searchResults.length > 0 ? searchResults : [];

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <Header />

      {/* SEARCH */}
      <SearchNewContact onSearch={handleSearch} />

      {/* LIST */}
      {displayData.length > 0 ? (
        <FlatList
          data={displayData}
          keyExtractor={(item) => item.user_id}
          renderItem={({ item }) => {
            const existingChat = findChatWithUser(item.user_id);
            return (
              <NewContactItem
                user_id={item.user_id}
                displayname={item.displayname}
                existingChatRoomId={existingChat?.room_id}
              />
            );
          }}
          contentContainerStyle={{ padding: 14, paddingBottom: 30 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Busca usuarios por nombre de usuario
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
  },
});
