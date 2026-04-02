import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { THEME } from "@/src/shared/lib/theme";
import { IUser } from "@/src/shared/types/user";

export const Header = ({ avatar, name, isOnline, status }: IUser) => {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={THEME.colors.text_opacity} />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={20} color={THEME.colors.text_opacity} />
              </View>
            )}
            <View>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.status}>{isOnline ? "online" : status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Ionicons name="call-outline" size={22} color={THEME.colors.text_opacity} />
          <MaterialIcons name="more-vert" size={22} color={THEME.colors.text_opacity} />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: THEME.colors.secondary,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconBtn: {
    padding: 4,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    color: THEME.colors.text_title,
    fontWeight: "bold",
  },
  status: {
    color: THEME.colors.primary,
    fontSize: 12,
  },

})
