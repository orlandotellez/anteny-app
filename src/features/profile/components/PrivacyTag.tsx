import { StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";

export const PrivacyTag = () => {
  return (
    <>
      <View style={styles.privacyBox}>
        <Ionicons name="lock-closed" size={22} color={THEME.colors.primary} />

        <View style={{ flex: 1 }}>
          <Text style={styles.privacyTitle}>
            End-to-end encrypted
          </Text>
          <Text style={styles.privacyText}>
            Your profile and chats are protected.
          </Text>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  privacyBox: {
    marginTop: 30,
    flexDirection: "row",
    gap: 12,
    backgroundColor: THEME.colors.primary_opacity,
    padding: 16,
    borderRadius: 20,
  },
  privacyTitle: {
    color: THEME.colors.primary,
    fontWeight: "700",
  },
  privacyText: {
    color: THEME.colors.text_opacity,
    fontSize: 12,
  },
})
