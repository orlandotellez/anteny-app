import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";

interface DangerZoneProps {
  onLogout?: () => void;
}

export const DangerZone = ({ onLogout }: DangerZoneProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danger Zone</Text>

      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={20} color={THEME.colors.danger} />
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 16,
    borderRadius: 20,
    backgroundColor: THEME.colors.danger_opacity,
    borderWidth: 1,
  },

  title: {
    color: THEME.colors.danger,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: "uppercase",
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: THEME.colors.danger_card,
  },

  buttonText: {
    color: THEME.colors.danger,
    fontSize: 15,
    fontWeight: "600",
  },
});
