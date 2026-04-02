import { StyleSheet, Text, View } from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";

export const Header = () => {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View>
            <Text style={styles.title}>Contacts</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Ionicons name="search" size={22} color={THEME.colors.text_opacity} />
          <MaterialIcons name="more-vert" size={22} color={THEME.colors.text_opacity} />
        </View>
      </View>

    </>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: THEME.colors.secondary,
    padding: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerRight: {
    flexDirection: "row",
    gap: 16,
  },
  title: {
    color: THEME.colors.text_title,
    fontSize: 22,
    fontWeight: "bold",
  },
})
