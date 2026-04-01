import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
} from "react-native";
import { THEME } from "@/src/shared/lib/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { NewContactItem } from "@/src/features/contacts/new-contact/components/NewContactItem";
import { Header } from "@/src/features/contacts/new-contact/components/Header";
import { SearchNewContact } from "@/src/features/contacts/new-contact/components/SearchNewContact";

const mockContacts = [
  { id: "a", user_id: "1", displayname: "Marcus Chen" },
  { id: "b", user_id: "2", displayname: "Elena Rodriguez" },
  { id: "c", user_id: "3", displayname: "David Kim" },
];

export default function NewContactScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <Header />

      {/* SEARCH */}
      <SearchNewContact />

      {/* LIST */}
      <FlatList
        data={mockContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NewContactItem key={item.id} {...item} />
        )}
        contentContainerStyle={{ padding: 14, paddingBottom: 30 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  link: {
    color: THEME.colors.primary,
    fontWeight: "700",
  },
});
