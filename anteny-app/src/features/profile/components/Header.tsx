import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { MaterialIcons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";

export const Header = () => {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          <TouchableOpacity style={styles.iconBtn}>
          </TouchableOpacity>
        </View>
      </View>

    </>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: THEME.colors.secondary,
    padding: 16,
  },
  headerTop: {

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    color: THEME.colors.text_title,
    fontSize: 22,
    fontWeight: "bold",
  },
  iconBtn: {
    borderRadius: 20,
  },
})
