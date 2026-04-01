import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";
import { ActionItem } from "@/src/shared/types/contacts";

export const ActionButton = ({ icon, title }: ActionItem) => (
  <TouchableOpacity style={styles.actionBtn}>
    <Ionicons name={icon} size={20} color={THEME.colors.primary} />
    <Text style={styles.actionText}>{title}</Text>
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
