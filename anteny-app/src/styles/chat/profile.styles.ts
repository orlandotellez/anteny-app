import { THEME } from "@/src/shared/lib/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {

    backgroundColor: THEME.colors.secondary
  },
  headerTop: {
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 15,
  },
  scroll: {
    flex: 1,
  },
  profile: {
    alignItems: "center",
    marginVertical: 25,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 50
  },

  name: {
    color: "#fff",
    fontSize: 22,
    marginTop: 10,
    fontWeight: "bold",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 16,
  },
  emptyText: {
    color: "#777",
    fontSize: 14,
  },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  fieldContent: {
    flexDirection: "row",
    flex: 1,
  },
  fieldText: {
    marginLeft: 10,
  },
  fieldLabel: {
    color: "#aaa",
    fontSize: 12,
  },
  fieldValue: {
    color: "#fff",
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  inviteBtn: {
    flexDirection: "row",
    backgroundColor: "#00a884",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  inviteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  mediaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  mediaText: {
    color: "#aaa",
    fontSize: 16,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
  },
});
