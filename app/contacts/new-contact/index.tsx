import React from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { THEME } from "@/src/shared/lib/theme";

const mockContacts = [
  { user_id: "1", displayname: "Marcus Chen" },
  { user_id: "2", displayname: "Elena Rodriguez" },
  { user_id: "3", displayname: "David Kim" },
];

export default function NewContactScreen() {
  const renderItem = ({ item }: any) => (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          {item.displayname[0]}
        </Text>
      </View>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name}>{item.displayname}</Text>
        <Text style={styles.status}>Disponible</Text>
      </View>

      <TouchableOpacity style={styles.profileButton}>
        <Feather name="user" size={18} color={THEME.colors.primary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.inviteButton}>
        <Text style={styles.buttonText}>Invitar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Nuevo contacto</Text>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#aaa" />

        <TextInput
          placeholder="Buscar usuario..."
          placeholderTextColor="#888"
          style={styles.searchInput}
        />

        <TouchableOpacity style={styles.btnSearch}>
          <Feather name="arrow-right" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={mockContacts}
        keyExtractor={(item) => item.user_id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 14, paddingBottom: 30 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: THEME.colors.secondary
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },

  link: {
    color: THEME.colors.primary,
    fontWeight: "700",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    margin: 14,
    backgroundColor: THEME.colors.secondary,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: "#fff",
  },

  btnSearch: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: THEME.colors.primary,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: THEME.colors.secondary,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  status: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
  },

  profileButton: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
    marginRight: 8,
  },

  inviteButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: THEME.colors.primary,
  },

  buttonText: {
    color: "#000",
    fontWeight: "700",
  },
});
