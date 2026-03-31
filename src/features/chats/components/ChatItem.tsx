import { THEME } from "@/src/shared/lib/theme";
import type { IChatItem } from "@/src/shared/types/chats";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export const ChatItem = ({ avatar, name, message, time, unread, online }: IChatItem) => {
  return (
    <>
      <TouchableOpacity style={styles.chatItem} onPress={() => router.push("/123")}>
        <View>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          {online && <View style={styles.onlineDot} />}
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.name}>{name}</Text>
            <Text
              style={[
                styles.time,
                unread ? { color: THEME.colors.primary, fontWeight: "bold" } : null,
              ]}
            >
              {time}
            </Text>
          </View>

          <View style={styles.messageRow}>
            <Text style={styles.message} numberOfLines={1}>
              {message}
            </Text>

            {unread && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unread}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </>
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
  },

  name: {
    color: THEME.colors.text_title,
    fontWeight: "bold",
    fontSize: 16,
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

