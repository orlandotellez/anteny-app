import { StyleSheet, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { THEME } from "../../lib/theme"

interface NotFoundProps {
  text: string
}

export const NotFound = ({ text }: NotFoundProps) => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.name}>{text}</Text>
      </SafeAreaView>
    </>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  name: {
    color: THEME.colors.text_title,
    fontWeight: "bold",
  },

})
