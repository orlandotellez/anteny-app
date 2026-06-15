import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { renderUserItem } from "@/src/features/contacts/components/new-group/UserItem";
import { Header } from "@/src/features/contacts/components/new-group/Header";
import { Avatar } from "@/src/features/contacts/components/new-group/Avatar";
import { styles } from "@/src/styles/contacts/new-group.styles";

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
