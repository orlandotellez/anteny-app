import { StyleSheet, View } from "react-native"
import { ProfileField } from "./ProfileField"
import { THEME } from "@/src/shared/lib/theme"
import { useAuth } from "@/src/features/auth/context/AuthContext"
import { useProfile } from "@/src/features/profile/context/ProfileContext"
import { getUsernameFromUserId } from "@/src/shared/utils/format"
import { setDisplayName } from "@/src/services/matrix/profile"

interface FormProps {
  onDisplayNameUpdate?: (newName: string) => Promise<void>;
}

export const Form = ({ onDisplayNameUpdate }: FormProps) => {
  const { session } = useAuth();
  const { profile } = useProfile();

  const handleDisplayNameSave = async (newDisplayName: string) => {
    if (!session?.access_token || !session?.user_id) {
      throw new Error("No session");
    }

    // Actualizar en Matrix
    await setDisplayName({ userId: session.user_id, token: session.access_token, displayName: newDisplayName });

    // Actualizar localmente
    if (onDisplayNameUpdate) {
      await onDisplayNameUpdate(newDisplayName);
    }
  };

  const username = session ? getUsernameFromUserId(session.user_id) : null;
  const displayName = profile?.displayName || "";

  return (
    <>
      <View style={styles.section}>
        <ProfileField
          icon="person"
          label="Name"
          value={displayName}
          helper="This name will be visible to your contacts."
          editable
          onSave={handleDisplayNameSave}
        />

        <ProfileField
          icon="at"
          label="Username"
          value={username || ""}
          helper="Your unique identifier."
        />

        <ProfileField
          icon="information-circle"
          label="About"
          value={profile?.status || "Design enthusiast & developer"}
          multiline
        />

        {/*        
        <ProfileField
          icon="mail"
          label="Email"
          value="orlandogabrieltellez@gmail.com"
          rightIcon="verified"
        />
        */}
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
