import { THEME } from "@/src/shared/lib/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
