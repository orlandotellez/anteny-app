import { StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";
import { useState } from "react";

interface ProfileFieldProps {
  icon: string;
  label: string;
  value: string;
  helper?: string;
  multiline?: boolean;
  rightIcon?: string;
  editable?: boolean;
  onSave?: (value: string) => Promise<void>;
}

export const ProfileField = ({
  icon,
  label,
  value,
  helper,
  multiline,
  rightIcon,
  editable = false,
  onSave,
}: ProfileFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!onSave || isSaving) return;
    
    setIsSaving(true);
    try {
      await onSave(inputValue);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setInputValue(value);
    setIsEditing(false);
  };

  return (
    <View style={styles.field}>
      <Ionicons name={icon as any} size={20} color={THEME.colors.primary} />

      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>

        {isEditing ? (
          <TextInput
            style={[styles.input, multiline && { height: 60 }]}
            value={inputValue}
            onChangeText={setInputValue}
            multiline={multiline}
            autoFocus
          />
        ) : (
          <Text style={[styles.input, !value && styles.placeholder]}>
            {value || "Not set"}
          </Text>
        )}

        {helper && <Text style={styles.helper}>{helper}</Text>}
      </View>

      {editable && !isEditing && (
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <Ionicons name="pencil" size={18} color={THEME.colors.primary} />
        </TouchableOpacity>
      )}

      {editable && isEditing && (
        <View style={styles.editActions}>
          <TouchableOpacity onPress={handleCancel} style={styles.actionBtn}>
            <Ionicons name="close" size={18} color="#ff6b6b" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleSave} 
            style={styles.actionBtn}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={THEME.colors.primary} />
            ) : (
              <Ionicons name="checkmark" size={18} color={THEME.colors.primary} />
            )}
          </TouchableOpacity>
        </View>
      )}

      {!editable && rightIcon && (
        <MaterialIcons name={rightIcon as any} size={18} color="#777" />
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
  placeholder: {
    color: THEME.colors.text_opacity,
    fontStyle: "italic",
  },
  helper: {
    fontSize: 11,
    color: THEME.colors.text_opacity,
    marginTop: 4,
  },
  editActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    padding: 4,
  },
});
