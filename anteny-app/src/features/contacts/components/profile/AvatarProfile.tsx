import { getColorFromName, getUsernameFromUserId } from "@/src/shared/utils/format";
import { StyleSheet, Text, View } from "react-native"

export const AvatarProfile = ({ userId, displayName }: { userId: string, displayName: string }) => {
  const hasValidDisplayName = displayName && displayName !== "undefined" && displayName !== "";
  const displayNameToShow = hasValidDisplayName ? displayName : getUsernameFromUserId(userId);
  const avatarColor = getColorFromName(displayNameToShow);
  const initial = displayNameToShow ? displayNameToShow[0].toUpperCase() : "?";


  return (
    <>
      <View style={styles.profile}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.name}>{displayNameToShow}</Text>
      </View>

    </>
  )
}

const styles = StyleSheet.create({
  profile: {
    alignItems: "center",
    marginVertical: 25,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 50,
  },
  name: {
    color: "#fff",
    fontSize: 22,
    marginTop: 10,
    fontWeight: "bold",
  },
})
