import { StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";

export const ProfileField = ({
  icon,
  label,
  value,
  helper,
  multiline,
  rightIcon,
}: any) => {
  return (
    <View style={styles.field}>
      <Ionicons name={icon} size={20} color={THEME.colors.primary} />

      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>

        <TextInput
          style={[styles.input, multiline && { height: 60 }]}
          defaultValue={value}
          multiline={multiline}
        />

        {helper && <Text style={styles.helper}>{helper}</Text>}
      </View>

      {rightIcon && (
        <MaterialIcons name={rightIcon} size={18} color="#777" />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: THEME.colors.secondary,
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
  helper: {
    fontSize: 11,
    color: THEME.colors.text_opacity,
    marginTop: 4,
  },
});
