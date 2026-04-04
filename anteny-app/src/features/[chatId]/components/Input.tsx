import { useState, useCallback } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";

interface InputProps {
  onSendMessage: (body: string) => Promise<boolean>;
  isSending?: boolean;
}

export const Input = ({ onSendMessage, isSending = false }: InputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = useCallback(async () => {
    if (!message.trim() || isSending) return;

    const success = await onSendMessage(message);
    if (success) {
      setMessage("");
    }
  }, [message, onSendMessage, isSending]);

  const handleTextChange = (text: string) => {
    setMessage(text);
  };

  const handleSubmit = () => {
    if (message.trim() && !isSending) {
      handleSend();
    }
  };

  return (
    <>
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <Ionicons name="happy-outline" size={22} color={THEME.colors.text_opacity} />

          <TextInput
            placeholder="Message"
            placeholderTextColor={THEME.colors.text_opacity}
            style={styles.input}
            value={message}
            onChangeText={handleTextChange}
            onSubmitEditing={handleSubmit}
            returnKeyType="send"
            blurOnSubmit={false}
            multiline={false}
          />

          <Ionicons name="attach" size={22} color={THEME.colors.text_opacity} />
          <Ionicons name="camera-outline" size={22} color={THEME.colors.text_opacity} />
        </View>

        <TouchableOpacity
          style={[
            styles.micButton,
            (!message.trim() || isSending) && styles.micButtonDisabled
          ]}
          onPress={handleSend}
          disabled={!message.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#002109" />
          ) : (
            <MaterialIcons name="send" size={22} color={message.trim() ? "#002109" : "#888"} />
          )}
        </TouchableOpacity>
      </View >
    </>
  )
}

const styles = StyleSheet.create({

  footer: {
    padding: 8,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    backgroundColor: THEME.colors.secondary
  },

  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.background,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },

  input: {
    flex: 1,
    color: "#e2e2e2",
    maxHeight: 100,
  },

  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  micButtonDisabled: {
    backgroundColor: "#555",
  },

})
