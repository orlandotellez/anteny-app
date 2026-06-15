import { THEME } from "@/src/shared/lib/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  name: {
    color: THEME.colors.text_title,
    fontWeight: "bold",
  },
  chatContainer: {
    padding: 12,
    paddingBottom: 20,
    paddingTop: 40, // Space for sticky date
  },
  stickyDateContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
    paddingVertical: 8,
  },
  stickyDateBadge: {
    backgroundColor: "#1b1b1b",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stickyDateText: {
    color: THEME.colors.text_opacity,
    fontSize: 12,
    fontWeight: "600",
  },
});
