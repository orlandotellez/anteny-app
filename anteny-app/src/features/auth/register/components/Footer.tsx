import { StyleSheet, Text, View } from "react-native"

export const Footer = () => {
  return (
    <>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By creating an account, you agree to our Terms and Privacy Policy.
        </Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    color: "#777",
    textAlign: "center",
  },
})
