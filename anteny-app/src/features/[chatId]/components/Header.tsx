import { Text, TouchableOpacity, View, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { THEME } from "@/src/shared/lib/theme";
import { getColorFromName } from "@/src/shared/utils/format";
import { styles } from "./Header.styles";

interface HeaderProps {
  avatar?: string;
  name: string;
  isOnline?: boolean;
  status?: string;
  onProfilePress?: () => void;
}

export const Header = ({ name, isOnline, status, onProfilePress }: HeaderProps) => {
  const avatarColor = getColorFromName(name);
  const initial = name ? name[0].toUpperCase() : "?";

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text_opacity} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.userInfo} onPress={onProfilePress} disabled={!onProfilePress}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View>
            <Text style={styles.name}>{name}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.headerRight}>
        <Ionicons name="call-outline" size={22} color={THEME.colors.text_opacity} />
      </View>
    </View>
  )
}
