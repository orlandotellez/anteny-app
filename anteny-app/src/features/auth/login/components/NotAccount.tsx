import { THEME } from "@/src/shared/lib/theme"
import { Link } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

export const NotAccount = () => {
  return (
    <>
      <View style={styles.notAccount}>
        <Text style={styles.textNotAccount}>
          Don't have an account?
        </Text>
        <Link href={"/register"} style={styles.registerHere}>
          Register here
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  notAccount: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },
  textNotAccount: {
    color: THEME.colors.text_title,
    display: "flex",
  },
  registerHere: {
    color: THEME.colors.primary,
  },
})
