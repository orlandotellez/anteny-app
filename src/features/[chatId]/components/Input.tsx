import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";

export const Input = () => {
  return (
    <>
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <Ionicons name="happy-outline" size={22} color={THEME.colors.text_opacity} />

          <TextInput
            placeholder="Message"
            placeholderTextColor={THEME.colors.text_opacity}
            style={styles.input}
          />

          <Ionicons name="attach" size={22} color={THEME.colors.text_opacity} />
          <Ionicons name="camera-outline" size={22} color={THEME.colors.text_opacity} />
        </View>

        <TouchableOpacity style={styles.micButton}>
          <MaterialIcons name="mic" size={22} color="#002109" />
        </TouchableOpacity>
      </View>

    </>

  )
}

const styles = StyleSheet.create({

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    backgroundColor: THEME.colors.secondary
  },

  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.background,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },

  input: {
    flex: 1,
    color: "#e2e2e2",
  },

  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

})
