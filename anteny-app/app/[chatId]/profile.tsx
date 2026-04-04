import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { THEME } from "@/src/shared/lib/theme";
import { Header } from "@/src/features/[chatId]/components/profile/Header";
import { getColorFromName } from "@/src/shared/utils/format";

interface UserInfoField {
  id: string;
  icon: string;
  label: string;
  value: string;
}

interface ProfileChatIdProps {
  displayName: string;
  avatarUrl?: string;
  fields: UserInfoField[];
  images?: string[];

  onBack?: () => void;
  onAddField?: () => void;
  onEditField?: (field: UserInfoField) => void;
  onDeleteField?: (id: string) => void;
  onOpenMedia?: () => void;

  showInviteButton?: boolean;
}

const ProfileChatId = ({
  displayName,
  avatarUrl,
  fields,
  images = [],
  onBack,
  onAddField,
  onEditField,
  onDeleteField,
  onOpenMedia,
  showInviteButton = false,
}: ProfileChatIdProps) => {
  const avatarColor = getColorFromName(displayName);
  const initial = displayName ? displayName[0].toUpperCase() : "?";

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* HEADER */}
      <Header />

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

            {onAddField && (
              <TouchableOpacity onPress={onAddField}>
                <Feather name="plus-circle" size={20} color="#00a884" />
              </TouchableOpacity>
            )}
          </View>

          {fields.length === 0 ? (
            <Text style={styles.emptyText}>
              Sin información
            </Text>
          ) : (
            fields.map((field) => (
              <View key={field.id} style={styles.fieldRow}>
                <View style={styles.fieldContent}>
                  <View style={styles.fieldText}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <Text style={styles.fieldValue}>{field.value}</Text>
                  </View>
                </View>

                <View style={styles.actions}>
                  {onEditField && (
                    <TouchableOpacity onPress={() => onEditField(field)}>
                      <Feather name="edit-2" size={16} color="#00a884" />
                    </TouchableOpacity>
                  )}
                  {onDeleteField && (
                    <TouchableOpacity onPress={() => onDeleteField(field.id)}>
                      <Feather name="trash-2" size={16} color="#ff6b6b" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {/* MEDIA */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.mediaHeader}
            onPress={onOpenMedia}
          >
            <Text style={styles.mediaText}>
              Ver archivos e imágenes
            </Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#aaa" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function ProfileScreen() {
  const { userId, displayName, isInvited } = useLocalSearchParams<{
    userId: string;
    displayName: string;
    isInvited?: string;
  }>();

  const handleBack = () => {
    router.back();
  };

  // Placeholder fields - could be expanded with actual user data from Matrix
  const fields: UserInfoField[] = [
    {
      id: "1",
      icon: "at",
      label: "Matrix ID",
      value: userId || "No disponible",
    },
  ];

  return (
    <ProfileChatId
      displayName={displayName || "Usuario"}
      fields={fields}
      onBack={handleBack}
      showInviteButton={isInvited !== "true"}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {

    backgroundColor: THEME.colors.secondary
  },
  headerTop: {
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 15,
  },
  scroll: {
    flex: 1,
  },
  profile: {
    alignItems: "center",
    marginVertical: 25,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 50
  },

  name: {
    color: "#fff",
    fontSize: 22,
    marginTop: 10,
    fontWeight: "bold",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 16,
  },
  emptyText: {
    color: "#777",
    fontSize: 14,
  },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  fieldContent: {
    flexDirection: "row",
    flex: 1,
  },
  fieldText: {
    marginLeft: 10,
  },
  fieldLabel: {
    color: "#aaa",
    fontSize: 12,
  },
  fieldValue: {
    color: "#fff",
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  inviteBtn: {
    flexDirection: "row",
    backgroundColor: "#00a884",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  inviteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  mediaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  mediaText: {
    color: "#aaa",
    fontSize: 16,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
  },
});
