import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { THEME } from "@/src/shared/lib/theme";
import { ActionButton } from "@/src/features/profile/components/ActionButton";
import { Header } from "@/src/features/profile/components/Header";
import { Avatar } from "@/src/features/profile/components/Avatar";
import { Form } from "@/src/features/profile/components/Form";
import { PrivacyTag } from "@/src/features/profile/components/PrivacyTag";
import { DangerZone } from "@/src/features/profile/components/DangerZone";
import { router } from "expo-router";
import { ActionItem } from "@/src/shared/types/contacts";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { useProfile } from "@/src/features/profile/context/ProfileContext";
import { getUsernameFromUserId } from "@/src/shared/utils/format";

const actions: ActionItem[] = [
  { id: "a", type: "action", action: () => { }, title: "My Code", icon: "qr-code" },
  { id: "b", type: "action", action: () => { }, title: "Share Profile", icon: "share-social" },
]

export default function ProfileScreen() {
  const { logout, session } = useAuth()
  const { profile, setProfileStorage, clearProfile } = useProfile()

  // Extraer username del user_id (ej: "@orlando:example.com" → "orlando")
  const username = session ? getUsernameFromUserId(session.user_id) : null;

  // Actualizar display name localmente
  const handleDisplayNameUpdate = async (newDisplayName: string) => {
    if (!session?.user_id) return;

    await setProfileStorage({
      id: session.user_id,
      displayName: newDisplayName,
      status: profile?.status || "",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        {/* AVATAR */}
        <Avatar username={username || undefined} displayName={profile?.displayName} />

        {/* FORM */}
        <Form onDisplayNameUpdate={handleDisplayNameUpdate} />

        {/* ACTIONS */}
        <View style={styles.actions}>
          {
            actions.map((action) => (
              <ActionButton
                key={action.id}
                {...action}
              />
            ))
          }
        </View>

        {/* PRIVACY TAG */}
        <PrivacyTag />

        {/* Danger Zone*/}
        <DangerZone
          onLogout={async () => {
            await logout()
            await clearProfile()
            router.replace("/(auth)/login")
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 120,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
});
