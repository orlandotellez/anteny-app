import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";

export const Avatar = () => {
  return (
    <>
      <View style={styles.avatarSection}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri: "https://avatars.githubusercontent.com/u/109451741?v=4",
            }}
            style={styles.avatar}
          />

          <TouchableOpacity style={styles.cameraBtn}>
            <Ionicons name="camera" size={18} color="#002109" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>Orlando Téllez</Text>
        <Text style={styles.username}>@orlandotellez</Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: THEME.colors.primary,
    padding: 10,
    borderRadius: 20,
  },
  name: {
    color: THEME.colors.text_title,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 12,
  },
  username: {
    color: "#888",
    fontSize: 13,
  },
})
