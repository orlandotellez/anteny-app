import { StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";

export const Avatar = () => {
  return (
    <>
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.groupAvatar}>
            <Ionicons name="people" size={40} color="#fff" />
          </View>

          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={16} color="#fff" />
          </View>
        </View>

        <Text style={styles.avatarLabel}>
          Toca para cambiar foto
        </Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: "center",
    padding: 30,
  },
  avatarContainer: {
    position: "relative",
  },
  groupAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: THEME.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: THEME.colors.primary,
    padding: 6,
    borderRadius: 20,
  },
  avatarLabel: {
    color: "#aaa",
    marginTop: 10,
  },


})
