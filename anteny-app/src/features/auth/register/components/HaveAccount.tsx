import { THEME } from "@/src/shared/lib/theme"
import { Link } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

export const HaveAccount = () => {
  return (
    <>
      <View style={styles.haveAccount}>
        <Text style={styles.textHaveAccount}>
          Do you already have an account?
        </Text>
        <Link href={"/login"} style={styles.loginHere}>
          Login in
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  haveAccount: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },
  textHaveAccount: {
    color: THEME.colors.text_title,
    display: "flex",
  },
  loginHere: {
    color: THEME.colors.primary
  },
})
