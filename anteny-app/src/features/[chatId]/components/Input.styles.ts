import { THEME } from "@/src/shared/lib/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  footer: {
    padding: 8,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    backgroundColor: THEME.colors.secondary
  },

  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.background,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },

  input: {
    flex: 1,
    color: "#e2e2e2",
    maxHeight: 100,
  },

  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  micButtonDisabled: {
    backgroundColor: "#555",
  },

  // Reply Preview Styles
  replyPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.secondary,
    paddingVertical: 8,
    paddingTop: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  replyLine: {
    width: 3,
    height: "100%",
    backgroundColor: THEME.colors.primary,
    borderRadius: 2,
  },
  replyContent: {
    flex: 1,
  },
  replyLabel: {
    fontSize: 12,
    color: THEME.colors.primary,
    fontWeight: "600",
  },
  replyText: {
    fontSize: 14,
    color: "#888888",
    marginTop: 2,
  },
  cancelReply: {
    padding: 4,
  },
})
