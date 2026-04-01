import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Decorative background glows */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <View style={styles.iconGlow} />
            <Ionicons name="chatbubble" size={64} color={THEME.colors.primary} />
          </View>

          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Please enter your details to continue
          </Text>
        </View>



        {/* FORM */}
        <View style={styles.form}>
          {/* Password */}
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="example@example.com"
              placeholderTextColor={THEME.colors.text_opacity}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={THEME.colors.text_opacity}
              secureTextEntry
            />
          </View>

          {/* Button */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
            <MaterialIcons name="arrow-forward" size={20} color={THEME.colors.surface} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By clicking Next, you agree to the Terms of Service and Privacy Policy.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: "center",
  },

  content: {
    flex: 1,
    width: "100%",
    maxWidth: 420,
    padding: 20,
    justifyContent: "center",
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
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: THEME.colors.primary_opacity,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#e5e2e1",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.text_opacity,
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: THEME.colors.text_title,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  phoneRow: {
    flexDirection: "row",
    gap: 10,
    height: 56,
  },
  countryBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    backgroundColor: "#0e0e0e",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#444748",
  },
  countryText: {
    color: "#e5e2e1",
    marginRight: 6,
  },
  input: {
    flex: 1,
    backgroundColor: "#0e0e0e",
    borderRadius: 10,
    paddingHorizontal: 16,
    padding: 12,
    color: "#e5e2e1",
    borderWidth: 1,
    borderColor: "#444748",
  },
  button: {
    height: 56,
    backgroundColor: THEME.colors.primary,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  buttonText: {
    color: THEME.colors.surface,
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    color: "#777",
    textAlign: "center",
  },
});
