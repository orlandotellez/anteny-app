import React from "react";
import {
  StyleSheet,
  FlatList,
} from "react-native";
import { THEME } from "@/src/shared/lib/theme";
import { contacts } from "@/src/shared/data/contacts";
import type { IContactItem } from "@/src/shared/types/contacts";
import { ContactItem } from "@/src/features/contacts/components/ContactItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActionsButtons } from "@/src/features/contacts/components/ActionsButtons";
import { Header } from "@/src/features/contacts/components/Header";

export default function ContactScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <Header />

      {/* ACTIONS BUTTONS */}
      <ActionsButtons />

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
