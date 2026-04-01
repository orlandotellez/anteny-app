import { THEME } from "@/src/shared/lib/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";

interface NewContactItem {
  displayname: string
}

export const NewContactItem = ({ displayname }: NewContactItem) => (
  <View style={styles.row}>
    <View style={styles.avatar}>
      <Text style={{ color: "#fff", fontWeight: "700" }}>
        {displayname[0]}
      </Text>
    </View>

    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.name}>{displayname}</Text>
      <Text style={styles.status}>Disponible</Text>
    </View>

    <TouchableOpacity style={styles.profileButton}>
      <Feather name="user" size={18} color={THEME.colors.primary} />
    </TouchableOpacity>

    <TouchableOpacity style={styles.inviteButton}>
      <Text style={styles.buttonText}>Invitar</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({

  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: THEME.colors.secondary,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  status: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
  },

  profileButton: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
    marginRight: 8,
  },

  inviteButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: THEME.colors.primary,
  },
  buttonText: {
    color: "#000",
    fontWeight: "700",
  },
})
