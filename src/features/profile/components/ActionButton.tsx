import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";

export const ActionButton = ({ icon, label }: any) => (
  <TouchableOpacity style={styles.actionBtn}>
    <Ionicons name={icon} size={20} color={THEME.colors.primary} />
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  actionBtn: {
    flex: 1,
    backgroundColor: THEME.colors.secondary,
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  actionText: {
    color: THEME.colors.text_title,
    fontWeight: "600",
  },

})
