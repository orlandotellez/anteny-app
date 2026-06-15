import { THEME } from "@/src/shared/lib/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  notAccount: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },
  textNotAccount: {
    color: THEME.colors.text_title,
    display: "flex",
  },
  registerHere: {
    color: THEME.colors.primary,
  },
})
