import React from "react";
import {
  StyleSheet,
  FlatList,
} from "react-native";
import { THEME } from "@/src/shared/lib/theme";
import { contacts } from "@/src/shared/data/contacts";
import type { ActionItem, IContactItem } from "@/src/shared/types/contacts";
import { ContactItem } from "@/src/features/contacts/components/ContactItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/src/features/contacts/components/Header";
import { router } from "expo-router";
import { ActionButton } from "@/src/features/profile/components/ActionButton";

const actions: ActionItem[] = [
  { id: "a", type: "action", action: () => router.push("/contacts/new-group"), title: "New group", icon: "people" },
  { id: "b", type: "action", action: () => router.push("/contacts/new-contact"), title: "New contact", icon: "person-add" },
]

export default function ContactScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <Header />

      {/* ACTIONS BUTTONS */}
      {
        actions.map((action) => (
          <ActionButton
            id={action.id}
            type={action.type}
            action={action.action}
            title={action.title}
            icon={action.icon}
          />
        ))
      }

      {/* LIST */}
      <FlatList<IContactItem>
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContactItem {...item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
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
  },
});
