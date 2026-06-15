import { THEME } from "@/src/shared/lib/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: THEME.colors.text_title,
    fontSize: 16,
    fontWeight: "600",
  },
  emptySubtext: {
    color: THEME.colors.text_opacity,
    marginTop: 8,
    fontSize: 14,
  },
  loadingMore: {
    padding: 10,
    alignItems: "center",
  },
  dateContainer: {
    alignItems: "center",
    marginVertical: 12,
    borderRadius: 12,
  },
  dateBadge: {
    backgroundColor: "#1b1b1b",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  date: {
    color: THEME.colors.text_opacity,
    fontSize: 12,
    fontWeight: "600",
  },
  received: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  sent: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  receivedBubble: {
    backgroundColor: "#2a2a2a",
    padding: 10,
    borderRadius: 12,
    width: "100%",
    maxWidth: 150
  },
  sentBubble: {
    backgroundColor: THEME.colors.secondary,
    padding: 10,
    borderRadius: 12,
    width: "100%",
    maxWidth: 150

  },
  text: {
    color: "#e2e2e2",
  },
  deletedText: {
    color: "#888888",
    fontStyle: "italic",
  },
  time: {
    fontSize: 10,
    color: THEME.colors.text_opacity,
    marginTop: 4,
  },
  sentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    justifyContent: "flex-end",
    marginTop: 4,
  },
  receivedMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 6,
  },
  // Reply Preview in Message
  replyPreviewContainer: {
    flexDirection: "row",
    marginBottom: 6,
    gap: 6,
  },
  replyLine: {
    width: 3,
    backgroundColor: THEME.colors.primary,
    borderRadius: 2,
  },
  replyContent: {
    flex: 1,
  },
  replyLabel: {
    fontSize: 11,
    color: THEME.colors.primary,
    fontWeight: "600",
  },
  replyText: {
    fontSize: 13,
    color: "#888888",
    marginTop: 1,
  },
});
