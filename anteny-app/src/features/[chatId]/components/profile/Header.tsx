import { Text, TouchableOpacity, View, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { THEME } from "@/src/shared/lib/theme";

export const Header = () => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text_opacity} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.userInfo} >
          <View>
            <Text style={styles.name}>Info. del contacto</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: THEME.colors.secondary,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconBtn: {
    padding: 7,
    paddingLeft: 6,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  name: {
    color: THEME.colors.text_title,
    fontWeight: "bold",
  },
  status: {
    color: THEME.colors.primary,
    fontSize: 12,
  },
})
