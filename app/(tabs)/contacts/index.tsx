import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";
import { contacts } from "@/src/shared/data/contacts";
import type { IContactItem } from "@/src/shared/types/contacts";
import { ContactItem } from "@/src/features/contacts/components/ContactItem";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ContactScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View>
            <Text style={styles.title}>Contacts</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Ionicons name="search" size={22} color={THEME.colors.text_opacity} />
          <MaterialIcons name="more-vert" size={22} color={THEME.colors.text_opacity} />
        </View>
      </View>

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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: THEME.colors.secondary,
    padding: 16,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  headerRight: {
    flexDirection: "row",
    gap: 16,
  },
  title: {
    color: THEME.colors.primary,
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    color: THEME.colors.text_opacity,
    fontSize: 12,
  },
});
