import { Link } from "expo-router"
import { Text, View } from "react-native"
import { styles } from "./NotAccount.styles"

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
