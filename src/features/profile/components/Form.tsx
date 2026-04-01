import { StyleSheet, View } from "react-native"
import { ProfileField } from "./ProfileField"
import { THEME } from "@/src/shared/lib/theme"

export const Form = () => {
  return (
    <>
      <View style={styles.section}>
        <ProfileField
          icon="person"
          label="Name"
          value="Orlando Téllez"
          helper="This name will be visible to your contacts."
        />

        <ProfileField
          icon="information-circle"
          label="About"
          value="Design enthusiast & developer"
          multiline
        />

        <ProfileField
          icon="mail"
          label="Email"
          value="orlandogabrieltellez@gmail.com"
          rightIcon="verified"
        />
      </View>

    </>
  )
}

const styles = StyleSheet.create({
  section: {
    gap: 14,
  },

  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1c1b1b",
    padding: 14,
    borderRadius: 16,
  },
  label: {
    fontSize: 10,
    color: THEME.colors.primary,
    textTransform: "uppercase",
  },
  input: {
    color: THEME.colors.text_title,
    fontSize: 15,
  },

})
