import { THEME } from "@/src/shared/lib/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  form: {
    gap: 16,
    width: "100%",
    maxWidth: 500
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: THEME.colors.text_title,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    flex: 1,
    backgroundColor: "#0e0e0e",
    borderRadius: 10,
    paddingHorizontal: 16,
    padding: 12,
    color: "#e5e2e1",
    borderWidth: 1,
    borderColor: "#444748",
  },
  button: {
    height: 56,
    backgroundColor: THEME.colors.primary,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  buttonText: {
    color: THEME.colors.surface,
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: THEME.colors.danger,
    marginTop: 10,
    textAlign: "center",
  },
  helperText: {
    color: THEME.colors.text_opacity
  }
})
