import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { getColorFromName } from "@/src/shared/utils/format";
import { styles } from "@/src/styles/chat/profile.styles";

export interface UserInfoField {
  id: string;
  icon: string;
  label: string;
  value: string;
}

interface ProfileViewProps {
  displayName: string;
  userId: string;
  onBack?: () => void;
}

export function ProfileView({ displayName, userId, onBack }: ProfileViewProps) {
  const avatarColor = getColorFromName(displayName);
  const initial = displayName ? displayName[0].toUpperCase() : "?";

  const fields: UserInfoField[] = [
    {
      id: "1",
      icon: "at",
      label: "Matrix ID",
      value: userId || "No disponible",
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* Header with back button */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", padding: 14, gap: 12 }}>
          {onBack && (
            <TouchableOpacity onPress={onBack}>
              <Feather name="arrow-left" size={22} color="#fff" />
            </TouchableOpacity>
          )}
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
            Info del contacto
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scroll}>
        {/* PERFIL */}
        <View style={styles.profile}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
        </View>

        {/* INFO */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Info</Text>
          </View>

          {fields.length === 0 ? (
            <Text style={styles.emptyText}>Sin información</Text>
          ) : (
            fields.map((field) => (
              <View key={field.id} style={styles.fieldRow}>
                <View style={styles.fieldContent}>
                  <View style={styles.fieldText}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <Text style={styles.fieldValue}>{field.value}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* MEDIA */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.mediaHeader}>
            <Text style={styles.mediaText}>Ver archivos e imágenes</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#aaa" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
