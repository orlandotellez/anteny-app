import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Feather } from "@expo/vector-icons";
import { getUsernameFromUserId } from "@/src/shared/utils/format";
import { THEME } from "@/src/shared/lib/theme";

interface ActionsProps {
  userId: string,
  displayName: string,
  hasExistingChat?: boolean,
  onGoToChat?: () => void,
  onInvite?: () => void
}

export const Actions = ({ userId, displayName, hasExistingChat, onGoToChat, onInvite }: ActionsProps) => {
  const hasValidDisplayName = displayName && displayName !== "undefined" && displayName !== "";
  const displayNameToShow = hasValidDisplayName ? displayName : getUsernameFromUserId(userId);

  return (
    <>
      <View style={styles.section}>
        {hasExistingChat ? (
          <TouchableOpacity style={styles.goToChatBtn} onPress={onGoToChat}>
            <Feather name="message-circle" size={20} color="#fff" />
            <Text style={styles.goToChatText}>Ir al chat</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.inviteBtn} onPress={onInvite}>
            <Feather name="user-plus" size={20} color="#fff" />
            <Text style={styles.inviteText}>Invitar a {displayNameToShow}</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  inviteBtn: {
    flexDirection: "row",
    backgroundColor: "#00a884",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  inviteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  goToChatBtn: {
    flexDirection: "row",
    backgroundColor: THEME.colors.primary,
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  goToChatText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})
