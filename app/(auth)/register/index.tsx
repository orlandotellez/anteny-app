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

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background glows */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <View style={styles.iconGlow} />
            <Ionicons name="person-add" size={60} color={THEME.colors.primary} />
          </View>

          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Join and start chatting instantly
          </Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          {/* Name */}
          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor="#bbcbb9"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Username */}
          <View style={styles.field}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="jhondoe"
              placeholderTextColor="#bbcbb9"
              value={username}
              onChangeText={setUsername}
            />
          </View>


          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="jhondoe@example.com"
              placeholderTextColor="#bbcbb9"
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
              placeholderTextColor="#bbcbb9"
              secureTextEntry
            />
          </View>

          {/* Button */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Create account</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#002109" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By creating an account, you agree to our Terms and Privacy Policy.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
  },

  content: {
    flex: 1,
    width: "100%",
    maxWidth: 420,
    padding: 20,
    justifyContent: "center",
  },

  /* Glow effects */
  glowTop: {
    position: "absolute",
    top: -120,
    left: -100,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(42, 177, 132, 0.08)",
  },
  glowBottom: {
    position: "absolute",
    bottom: -140,
    right: -120,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(42, 177, 132, 0.08)",
  },

  /* Header */
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconGlow: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(42, 177, 132, 0.08)",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#e5e2e1",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#bbcbb9",
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
    color: "#bbcbb9",
    textTransform: "uppercase",
    letterSpacing: 1,
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
    height: 54,
    backgroundColor: THEME.colors.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  buttonText: {
    color: "#002109",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    color: "#777",
    textAlign: "center",
  },
});
