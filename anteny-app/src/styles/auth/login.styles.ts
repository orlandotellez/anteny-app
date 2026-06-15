import { THEME } from "@/src/shared/lib/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: "center",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    width: "100%",
    padding: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  glowTop: {
    position: "absolute",
    top: -100,
    left: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: THEME.colors.primary_opacity,
  },
  glowBottom: {
    position: "absolute",
    bottom: -120,
    right: -120,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: THEME.colors.primary_opacity,
  },
  toast: {
    backgroundColor: THEME.colors.primary,
    position: "absolute",
    bottom: 50,
    paddingHorizontal: 20, paddingVertical: 14, borderRadius: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5,
  },
  toastText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center"
  },
});
