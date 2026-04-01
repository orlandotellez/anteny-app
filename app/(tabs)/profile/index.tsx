import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { THEME } from "@/src/shared/lib/theme";
import { ProfileField } from "@/src/features/profile/components/ProfileField";
import { ActionButton } from "@/src/features/profile/components/ActionButton";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="more-vert" size={22} color={THEME.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* AVATAR */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: "https://avatars.githubusercontent.com/u/109451741?v=4",
              }}
              style={styles.avatar}
            />

            <TouchableOpacity style={styles.cameraBtn}>
              <Ionicons name="camera" size={18} color="#002109" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>Orlando Téllez</Text>
          <Text style={styles.username}>@orlandotellez</Text>
        </View>

        {/* FORM */}
        <View style={styles.section}>
          <ProfileField
            icon="person"
            label="Name"
            value="Orlando Téllez"
            helper="This name will be visible to your contacts."
          />

          <ProfileField
            icon="information-circle"
            label="About"
            value="Design enthusiast & developer"
            multiline
          />

          <ProfileField
            icon="mail"
            label="Email"
            value="orlandogabrieltellez@gmail.com"
            rightIcon="verified"
          />
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <ActionButton icon="qr-code" label="My Code" />
          <ActionButton icon="share-social" label="Share Profile" />
        </View>

        {/* PRIVACY */}
        <View style={styles.privacyBox}>
          <Ionicons name="lock-closed" size={22} color={THEME.colors.primary} />

          <View style={{ flex: 1 }}>
            <Text style={styles.privacyTitle}>
              End-to-end encrypted
            </Text>
            <Text style={styles.privacyText}>
              Your profile and chats are protected.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    height: 60,
    backgroundColor: THEME.colors.secondary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    color: THEME.colors.primary,
    fontSize: 22,
    fontWeight: "bold",
  },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
  },
  content: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 120,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: THEME.colors.primary,
    padding: 10,
    borderRadius: 20,
  },
  name: {
    color: THEME.colors.text_title,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 12,
  },
  username: {
    color: "#888",
    fontSize: 13,
  },
  section: {
    gap: 14,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1c1b1b",
    padding: 14,
    borderRadius: 16,
  },
  label: {
    fontSize: 10,
    color: THEME.colors.primary,
    textTransform: "uppercase",
  },
  input: {
    color: THEME.colors.text_title,
    fontSize: 15,
  },
  helper: {
    fontSize: 11,
    color: "#888",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  privacyBox: {
    marginTop: 30,
    flexDirection: "row",
    gap: 12,
    backgroundColor: THEME.colors.primary_opacity,
    padding: 16,
    borderRadius: 20,
  },
  privacyTitle: {
    color: THEME.colors.primary,
    fontWeight: "700",
  },
  privacyText: {
    color: THEME.colors.text_opacity,
    fontSize: 12,
  },
});
