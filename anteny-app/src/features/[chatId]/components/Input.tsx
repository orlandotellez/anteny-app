import { useState, useCallback } from "react";
import { TextInput, TouchableOpacity, View, ActivityIndicator, Text } from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";
import { Message } from "@/src/shared/types/matrixMessage";
import { getUsernameFromUserId } from "@/src/shared/utils/format";
import { styles } from "./Input.styles";

interface InputProps {
  onSendMessage: (body: string, replyTo?: { eventId: string; body: string; sender: string }) => Promise<boolean>;
  isSending?: boolean;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
}

export const Input = ({ onSendMessage, isSending = false, replyingTo, onCancelReply }: InputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = useCallback(async () => {
    if (!message.trim() || isSending) return;

    const replyInfo = replyingTo ? {
      eventId: replyingTo.id,
      body: replyingTo.body,
      sender: replyingTo.sender,
    } : undefined;

    const success = await onSendMessage(message, replyInfo);
    if (success) {
      setMessage("");
    }
  }, [message, onSendMessage, isSending, replyingTo]);

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
      {/* Reply Preview */}
      {replyingTo && (
        <View style={styles.replyPreview}>
          <View style={styles.replyLine} />
          <View style={styles.replyContent}>
            <Text style={styles.replyLabel}>
              Respondiendo a {getUsernameFromUserId(replyingTo.sender)}
            </Text>
            <Text style={styles.replyText} numberOfLines={1}>
              {replyingTo.body}
            </Text>
          </View>
          <TouchableOpacity onPress={onCancelReply} style={styles.cancelReply}>
            <Ionicons name="close" size={20} color={THEME.colors.text_opacity} />
          </TouchableOpacity>
        </View>
      )}

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
