import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { THEME } from "@/src/shared/lib/theme";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/src/features/auth/login/components/Header";
import { loginUser } from "@/src/shared/services/matrix";
import { FormLogin } from "@/src/features/auth/login/components/FormLogin";
import { NotAccount } from "@/src/features/auth/login/components/NotAccount";
import { Footer } from "@/src/features/auth/login/components/Footer";
import { useAuth } from "@/src/features/auth/context/AuthContext";

export default function LoginScreen() {
  const { saveSecureStore } = useAuth();
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
      const session = await loginUser(form.username, form.password);

      // Guardar sesión en SecureStore
      await saveSecureStore(session);

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
    top: -100,
    left: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: THEME.colors.primary_opacity,
  },
  glowBottom: {
    position: "absolute",
    bottom: -120,
    right: -120,
    width: 250,
    height: 250,
    borderRadius: 125,
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
