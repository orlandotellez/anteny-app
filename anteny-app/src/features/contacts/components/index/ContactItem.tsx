import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "@/src/shared/lib/theme";
import { getColorFromName } from "@/src/shared/utils/format";

interface ContactItemProps {
  id: string;
  name: string;
  avatar?: string;
  status?: string;
  isOnline?: boolean;
  onPress?: () => void;
}

export const ContactItem = ({ name, status, isOnline, onPress }: ContactItemProps) => {
  const avatarColor = getColorFromName(name);
  const initial = name ? name[0].toUpperCase() : "?";

  return (
    <TouchableOpacity 
      style={styles.contactItem}
      onPress={onPress}
    >
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <View style={styles.contactInfo}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.status}>
          {isOnline ? "Online" : status}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  contactItem: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  contactInfo: {
    marginLeft: 12,
  },

  name: {
    color: THEME.colors.text_title,
    fontWeight: "500",
    fontSize: 16,
  },

  status: {
    color: THEME.colors.text_opacity,
    fontSize: 12,
    marginTop: 2,
  },
});
