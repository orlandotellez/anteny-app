import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";
import { ActionItem, PersonItem } from "@/src/shared/types/contacts";

type ContactItemProps = ActionItem | PersonItem;

export const ContactItem = (item: ContactItemProps) => {
  const name = (item as PersonItem).name;
  const avatar = (item as PersonItem).avatar;
  const status = (item as PersonItem).status;

  return (
    // CONTACT ITEM
    <TouchableOpacity style={styles.contactItem}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={20} color="#8e9192" />
        </View>
      )}

      <View style={styles.contactInfo}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.status}>{status}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  sectionHeader: {
    color: THEME.colors.text_opacity,
    fontSize: 11,
    marginTop: 10,
    marginLeft: 16,
  },
  contactItem: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 24,
  },

  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },

  contactInfo: {
    marginLeft: 12,
  },

  name: {
    color: THEME.colors.text_title,
    fontWeight: "500",
  },

  status: {
    color: THEME.colors.text_opacity,
    fontSize: 12,
  },
});
