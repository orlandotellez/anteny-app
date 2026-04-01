import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { MaterialIcons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";

export const Header = () => {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="more-vert" size={22} color={THEME.colors.text_opacity} />
        </TouchableOpacity>
      </View>

    </>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: THEME.colors.secondary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    color: THEME.colors.primary,
    fontSize: 22,
    fontWeight: "bold",
  },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
  },
})
