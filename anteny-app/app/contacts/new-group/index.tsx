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
import { THEME } from "@/src/shared/lib/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { renderUserItem } from "@/src/features/contacts/components/new-group/UserItem";
import { Header } from "@/src/features/contacts/components/new-group/Header";
import { Avatar } from "@/src/features/contacts/components/new-group/Avatar";

const mockUsers = [
  { id: "1", name: "Juan Pérez", mxid: "@juan:matrix.org" },
  { id: "2", name: "María López", mxid: "@maria:matrix.org" },
];

export default function CreateGroupScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          {/* Header */}
          <Header />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Avatar */}
            <Avatar />

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
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

