import { Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";
import { styles } from "./Header.styles";

export const Header = () => {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <View style={styles.iconGlow} />
          <Ionicons name="chatbubble" size={64} color={THEME.colors.primary} />
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Please enter your details to continue
        </Text>
      </View>
    </>
  )
}
