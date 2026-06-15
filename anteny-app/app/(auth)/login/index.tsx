import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/src/features/auth/login/components/Header";
import { FormLogin } from "@/src/features/auth/login/components/FormLogin";
import { NotAccount } from "@/src/features/auth/login/components/NotAccount";
import { Footer } from "@/src/features/auth/login/components/Footer";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { useProfile } from "@/src/features/profile/context/ProfileContext";
import { useChats } from "@/src/features/chats/context/ChatContext";
import { loginUser } from "@/src/services/matrix/auth";
import { styles } from "@/src/styles/auth/login.styles"

export default function LoginScreen() {
  const { saveSecureStore } = useAuth();
  const { fetchProfileFromMatrix } = useProfile();
  const { loadChats } = useChats();
  const [form, setForm] = useState({
    username: "",
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

  async function handleLogin() {
    setLoading(true);
    setGlobalError(null);
    try {
      const session = await loginUser({ username: form.username, password: form.password });

      // Guardar sesión en SecureStore
      await saveSecureStore(session);

      // Cargar perfil desde Matrix
      await fetchProfileFromMatrix(session.user_id, session.access_token);

      // Cargar chats
      await loadChats();

      // toast de éxito
      triggerToast();

      // Navegar a la pantalla de chat después de 800ms
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
          {/* Decorative background glows */}
          <View style={styles.glowTop} />
          <View style={styles.glowBottom} />

          <View style={styles.content}>
            {/* HEADER */}
            <Header />

            {/* FORM */}
            <FormLogin
              values={form}
              onChange={handleChange}
              onSubmit={handleLogin}
              loading={loading}
              error={globalError}
            />

            {/* Not Account */}
            <NotAccount />

            {showToast && (
              <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
                <Text style={styles.toastText}>¡Inicio se sesión exitoso! 🎉</Text>
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
