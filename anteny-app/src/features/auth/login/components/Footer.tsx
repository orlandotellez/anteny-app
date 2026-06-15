import { Text, View } from "react-native"
import { styles } from "./Footer.styles"

export const Footer = () => {
  return (
    <>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By clicking Next, you agree to the Terms of Service and Privacy Policy.
        </Text>
      </View>
    </>
  )
}
