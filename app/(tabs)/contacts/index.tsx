import React from "react";
import {
  StyleSheet,
  FlatList,
  Text,
} from "react-native";
import { THEME } from "@/src/shared/lib/theme";
import { contacts } from "@/src/shared/data/contacts";
import type { ActionItem } from "@/src/shared/types/contacts";
import { ContactItem } from "@/src/features/contacts/components/index/ContactItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/src/features/contacts/components/index/Header";
import { router } from "expo-router";
import { ActionButton } from "@/src/features/contacts/components/index/ActionButton";

const actions: ActionItem[] = [
  { id: "a", type: "action", action: () => router.push("/contacts/new-group"), title: "New group", icon: "people" },
  { id: "b", type: "action", action: () => router.push("/contacts/new-contact"), title: "New contact", icon: "person-add" },
]

export default function ContactScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <Header />

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContactItem {...item} />}
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

            <Text style={styles.subtitle}>Your contacts(5)</Text>
          </>
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
    paddingHorizontal: 12
  },
});
