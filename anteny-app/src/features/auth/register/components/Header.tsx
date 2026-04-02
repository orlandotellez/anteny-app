import { StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";

export const Header = () => {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <View style={styles.iconGlow} />
          <Ionicons name="person-add" size={60} color={THEME.colors.primary} />
        </View>

        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>
          Join and start chatting instantly
        </Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  /* Header */
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconGlow: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: THEME.colors.primary_opacity,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#e5e2e1",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.text_opacity,
    textAlign: "center",
  },

})
