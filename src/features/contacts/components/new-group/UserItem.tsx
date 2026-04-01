import { THEME } from "@/src/shared/lib/theme";
import { StyleSheet, Text, View } from "react-native";

export const renderUserItem = ({ item }: any) => (
  <View style={styles.userRow}>
    <View style={styles.avatarPlaceholder}>
      <Text style={styles.avatarInitial}>
        {item.name.charAt(0).toUpperCase()}
      </Text>
    </View>

    <View style={{ flex: 1 }}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userSubName}>{item.mxid}</Text>
    </View>

    <View style={styles.selectionIndicator} />
  </View>
);

const styles = StyleSheet.create({
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2d3748",
  },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: THEME.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarInitial: {
    color: "#fff",
    fontWeight: "700",
  },
  userName: {
    color: "#fff",
    fontWeight: "600",
  },
  userSubName: {
    color: "#aaa",
    fontSize: 12,
  },
  selectionIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#444",
  },
})
