import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { THEME } from "@/src/shared/lib/theme";

const mockUsers = [
  { id: "1", name: "Juan Pérez", mxid: "@juan:matrix.org" },
  { id: "2", name: "María López", mxid: "@maria:matrix.org" },
];

export default function CreateGroupScreen() {
  const renderUserItem = ({ item }: any) => (
    <View style={styles.userRow}>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarInitial}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userSubName}>{item.mxid}</Text>
      </View>

      <View style={styles.selectionIndicator} />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Crear Grupo</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.groupAvatar}>
                <Ionicons name="people" size={40} color="#fff" />
              </View>

              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </View>

            <Text style={styles.avatarLabel}>
              Toca para cambiar foto
            </Text>
          </View>

          {/* Nombre */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Nombre del grupo</Text>

            <TextInput
              placeholder="Escribe un nombre para el grupo..."
              placeholderTextColor="#888"
              style={styles.groupInput}
            />
          </View>

          {/* Buscador */}
          <View style={styles.searchSection}>
            <Text style={styles.label}>Buscar participantes</Text>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#888" />
              <TextInput
                placeholder="Buscar..."
                placeholderTextColor="#888"
                style={styles.searchInput}
              />
            </View>
          </View>

          {/* Lista */}
          <View style={styles.usersSection}>
            <Text style={styles.sectionTitle}>Contactos</Text>

            <FlatList
              data={mockUsers}
              keyExtractor={(item) => item.id}
              renderItem={renderUserItem}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.createButton}>
            <Ionicons name="people" size={20} color="#fff" />
            <Text style={styles.createButtonText}>
              Crear Grupo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: THEME.colors.secondary,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  headerSpacer: {
    width: 40,
  },

  avatarSection: {
    alignItems: "center",
    padding: 30,
  },

  avatarContainer: {
    position: "relative",
  },

  groupAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: THEME.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: THEME.colors.primary,
    padding: 6,
    borderRadius: 20,
  },

  avatarLabel: {
    color: "#aaa",
    marginTop: 10,
  },

  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  label: {
    color: "#fff",
    marginBottom: 10,
    fontWeight: "600",
  },

  groupInput: {
    backgroundColor: THEME.colors.secondary,
    padding: 14,
    borderRadius: 12,
    color: "#fff",
  },

  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.secondary,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  searchInput: {
    flex: 1,
    color: "#fff",
    padding: 12,
  },

  usersSection: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },

  sectionTitle: {
    color: "#fff",
    marginBottom: 10,
    fontWeight: "600",
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2d3748",
  },

  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: THEME.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avatarInitial: {
    color: "#fff",
    fontWeight: "700",
  },

  userName: {
    color: "#fff",
    fontWeight: "600",
  },

  userSubName: {
    color: "#aaa",
    fontSize: 12,
  },

  selectionIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#444",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: THEME.colors.secondary,
  },

  createButton: {
    backgroundColor: THEME.colors.primary,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  createButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});

