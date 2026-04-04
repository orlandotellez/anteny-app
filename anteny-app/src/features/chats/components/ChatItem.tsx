import { Alert } from "react-native";
import { THEME } from "@/src/shared/lib/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { getColorFromName } from "@/src/shared/utils/format";

interface ChatItemProps {
  id: string;
  name: string;
  lastMessage?: string;
  message?: string;
  time?: string;
  unread?: number;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const ChatItem = ({ id, name, lastMessage, message, time, unread, onPress, onLongPress }: ChatItemProps) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress();
    } else {
      Alert.alert(
        "Eliminar chat",
        `¿Quieres eliminar el chat con "${name}"?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Eliminar", style: "destructive" },
        ]
      );
    }
  };

  const avatarColor = getColorFromName(name);
  const initial = name ? name[0].toUpperCase() : "?";

  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      <View>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.time}>{time || "now"}</Text>
        </View>

        <View style={styles.messageRow}>
          <Text style={styles.message} numberOfLines={1}>
            {lastMessage || message || "Chat"}
          </Text>

          {unread ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unread}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    backgroundColor: THEME.colors.primary,
    borderRadius: 5,
  },

  chatContent: {
    flex: 1,
    marginLeft: 12,
  },

  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    color: THEME.colors.text_title,
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },

  time: {
    color: THEME.colors.text_opacity,
    fontSize: 12,
  },

  messageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },

  message: {
    color: THEME.colors.text_opacity,
    flex: 1,
  },

  badge: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    justifyContent: "center",
  },

  badgeText: {
    color: "#002109",
    fontWeight: "bold",
    fontSize: 12,
  },
});
