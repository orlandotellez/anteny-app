import { StyleSheet, Text, View } from "react-native"

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

const styles = StyleSheet.create({
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    color: "#777",
    textAlign: "center",
  },
})
