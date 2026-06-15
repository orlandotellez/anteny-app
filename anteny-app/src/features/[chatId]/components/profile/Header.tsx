import { Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { THEME } from "@/src/shared/lib/theme";
import { styles } from "./Header.styles";

export const Header = () => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text_opacity} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.userInfo} >
          <View>
            <Text style={styles.name}>Info. del contacto</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}
