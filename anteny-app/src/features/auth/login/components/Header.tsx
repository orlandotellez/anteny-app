import { StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";

export const Header = () => {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <View style={styles.iconGlow} />
          <Ionicons name="chatbubble" size={64} color={THEME.colors.primary} />
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Please enter your details to continue
        </Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: THEME.colors.primary_opacity,
  },
  title: {
    fontSize: 28,
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
