import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";
import { ActionItem } from "@/src/shared/types/contacts";

export const ActionButton = ({ id, icon, title, action }: ActionItem) => {
  return (
    <>
      <TouchableOpacity style={styles.actionItem} id={id} key={id} onPress={action}>
        <View style={styles.actionIcon}>
          <Ionicons name={icon} size={22} color={THEME.colors.primary} />
        </View>
        <View>
          <Text style={styles.actionText}>{title}</Text>
        </View>
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 24,
    backgroundColor: "#1b1b1b",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  actionText: {
    color: "#e2e2e2",
    fontSize: 14,
  },
});
