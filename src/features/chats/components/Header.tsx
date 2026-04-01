import { StyleSheet, Text, View } from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";

export const Header = () => {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Anteny App</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search" size={22} color={THEME.colors.text_opacity} />
          <MaterialIcons name="more-vert" size={22} color={THEME.colors.text_opacity} />
        </View>
      </View>

    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: THEME.colors.secondary,
    padding: 16,
  },
  title: {
    color: THEME.colors.primary,
    fontSize: 22,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },
})
