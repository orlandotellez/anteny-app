import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Text,
} from "react-native";
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
import { styles } from "@/src/styles/auth/register.styles";

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
