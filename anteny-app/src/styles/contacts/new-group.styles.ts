import { THEME } from "@/src/shared/lib/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    marginBottom: 10,
    fontWeight: "600",
  },
  groupInput: {
    backgroundColor: THEME.colors.secondary,
    padding: 14,
    borderRadius: 12,
    color: "#fff",
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.secondary,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    padding: 12,
  },
  usersSection: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  sectionTitle: {
    color: "#fff",
    marginBottom: 10,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: THEME.colors.secondary,
  },
  createButton: {
    backgroundColor: THEME.colors.primary,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});

