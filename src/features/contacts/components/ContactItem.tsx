import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";
import { ActionItem, HeaderItem, LetterItem, PersonItem } from "@/src/shared/types/contacts";

// Tipo que representa todas las propiedades posibles de un contacto
type ContactItemProps = ActionItem | HeaderItem | LetterItem | PersonItem;

export const ContactItem = (item: ContactItemProps) => {
  const type = (item as ActionItem | HeaderItem | LetterItem).type;
  const title = (item as ActionItem | HeaderItem | LetterItem).title;
  const icon = (item as ActionItem).icon as React.ComponentProps<typeof Ionicons>['name'] | undefined;
  const name = (item as PersonItem).name;
  const avatar = (item as PersonItem).avatar;
  const status = (item as PersonItem).status;
  // ACTION BUTTONS
  if (type === "action") {
    return (
      <TouchableOpacity style={styles.actionItem}>
        <View style={styles.actionIcon}>
          <Ionicons name={icon} size={22} color={THEME.colors.primary} />
        </View>
        <View>
          <Text style={styles.actionText}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // HEADER
  if (type === "header") {
    return <Text style={styles.sectionHeader}>{title}</Text>;
  }

  // LETTER
  if (type === "letter") {
    return <Text style={styles.letter}>{title}</Text>;
  }

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

  sectionHeader: {
    color: THEME.colors.text_opacity,
    fontSize: 11,
    marginTop: 10,
    marginLeft: 16,
  },

  letter: {
    color: THEME.colors.primary,
    marginLeft: 16,
    marginTop: 10,
    fontWeight: "bold",
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
