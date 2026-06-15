import { THEME } from "@/src/shared/lib/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuBox: {
    backgroundColor: THEME.colors.secondary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 40,
    minWidth: 200,
  },
  menuButton: {
    paddingVertical: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: THEME.colors.primary,
  },
  menuCancel: {
    marginTop: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  menuCancelText: {
    fontSize: 15,
    color: "#888888",
  },
})
