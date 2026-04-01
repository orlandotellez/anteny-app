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

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        {/* AVATAR */}
        <Avatar />

        {/* FORM */}
        <Form />

        {/* ACTIONS */}
        <View style={styles.actions}>
          <ActionButton icon="qr-code" label="My Code" />
          <ActionButton icon="share-social" label="Share Profile" />
        </View>

        {/* PRIVACY TAG */}
        <PrivacyTag />
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
