import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Text,
} from "react-native";
import { THEME } from "@/src/shared/lib/theme";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/src/features/auth/register/components/Header";
import { FormRegister } from "@/src/features/auth/register/components/FormRegister";
import { HaveAccount } from "@/src/features/auth/register/components/HaveAccount";
import { Footer } from "@/src/features/auth/register/components/Footer";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { useProfile } from "@/src/features/profile/context/ProfileContext";
import { useChats } from "@/src/features/chats/context/ChatContext";
import { registerUser } from "@/src/services/matrix/auth";
import { setDisplayName } from "@/src/services/matrix/profile";

export default function RegisterScreen() {
  const { saveSecureStore } = useAuth();
  const { setProfileStorage } = useProfile()
  const { loadChats } = useChats()
  const [form, setForm] = useState({
    displayName: "",
    username: "",
    email: "",
    password: "",
  });

  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  // Toast animado
  const [showToast, setShowToast] = useState(false);
  const toastOpacity = useState(new Animated.Value(0))[0];

  function triggerToast() {
    setShowToast(true);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1500),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setShowToast(false));
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function handleRegister() {
    setLoading(true);
    setGlobalError(null);
    try {
      // Registrar usuario en Matrix
      const session = await registerUser({ username: form.username, password: form.password });

      // Guardar sesión
      await saveSecureStore(session);

      // Actualizar display name en Matrix
      await setDisplayName({ userId: session.user_id, token: session.access_token, displayName: form.displayName });

      // Guardar perfil en storage
      await setProfileStorage({
        id: session.user_id,
        displayName: form.displayName,
        status: "",
      });

      // Cargar chats
      await loadChats();

      // toast de éxito
      triggerToast();

      // Navegar al home después de 800ms
      setTimeout(() => router.replace("/"), 800);
    } catch (e: any) {
      setGlobalError(e.message || "Error de red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, width: "100%" }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Background glows */}
          <View style={styles.glowTop} />
          <View style={styles.glowBottom} />

          <View style={styles.content}>
            {/* HEADER */}
            <Header />

            {/* FORM */}
            <FormRegister
              values={form}
              onChange={handleChange}
              onSubmit={handleRegister}
              loading={loading}
              error={globalError}
            />

            {/* HAVE ACCOUNT */}
            <HaveAccount />

            {showToast && (
              <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
                <Text style={styles.toastText}>¡Guardado con éxito! 🎉</Text>
              </Animated.View>
            )}

            {/* Footer */}
            <Footer />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: "center",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    width: "100%",
    padding: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  glowTop: {
    position: "absolute",
    top: -120,
    left: -100,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: THEME.colors.primary_opacity,
  },
  glowBottom: {
    position: "absolute",
    bottom: -140,
    right: -120,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: THEME.colors.primary_opacity,
  },
  toast: {
    backgroundColor: THEME.colors.primary,
    position: "absolute",
    bottom: 50,
    paddingHorizontal: 20, paddingVertical: 14, borderRadius: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5,
  },
  toastText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center"
  },
});
