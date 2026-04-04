import { THEME } from "@/src/shared/lib/theme"
import { Image, StyleSheet, Text, View, ActivityIndicator, Pressable, Alert, TextInput, Modal, TextInput as TextInputRN } from "react-native"
import { Message } from "@/src/shared/types/matrixMessage";
import { formatDate } from "@/src/shared/utils/time";
import { useState, useRef } from "react";

interface ConversationProps {
  messages: Message[];
  currentUserId: string;
  formatTime: (timestamp: number) => string;
  isLoadingMessages?: boolean;
  onDeleteMessage?: (eventId: string) => void;
  onEditMessage?: (eventId: string, newBody: string) => void;
  isDeleting?: boolean;
  isEditing?: boolean;
}

export const Conversation = ({
  messages,
  currentUserId,
  formatTime,
  isLoadingMessages = false,
  onDeleteMessage,
  onEditMessage,
  isDeleting = false,
  isEditing = false,
}: ConversationProps) => {
  const isOwnMessage = (sender: string) => sender === currentUserId;

  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editText, setEditText] = useState("");

  const handleLongPress = (message: Message) => {
    console.log("[Conversation] Long press:", message.id, "isOwn:", isOwnMessage(message.sender), "isDeleted:", message.isDeleted);

    // solo editar/borrar mensajes que son nuestros
    if (!isOwnMessage(message.sender)) {
      console.log("[Conversation] Not own message, skipping");
      return;
    }
    if (message.isDeleted) {
      console.log("[Conversation] Message is deleted, skipping");
      return;
    }

    Alert.alert(
      "Message Options",
      "Choose an action",
      [
        {
          text: "Edit",
          onPress: () => {
            setEditingMessage(message);
            setEditText(message.body);
          }
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Delete Message",
              "Are you sure you want to delete this message for everyone?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => onDeleteMessage?.(message.id)
                },
              ]
            );
          }
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleSaveEdit = async () => {
    console.log("[Conversation] handleSaveEdit called, editingMessage:", editingMessage?.id, "editText:", editText);
    if (editingMessage && editText.trim()) {
      console.log("[Conversation] Calling onEditMessage with:", editingMessage.id);
      const result = await onEditMessage?.(editingMessage.id, editText.trim());
      console.log("[Conversation] onEditMessage result:", result);
      // Only close modal after edit completes
      if (result) {
        setEditingMessage(null);
        setEditText("");
      }
    }
  };

  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = [];

    messages.forEach((msg) => {
      const dateKey = formatDate(msg.timestamp);
      const lastGroup = groups[groups.length - 1];

      if (lastGroup && lastGroup.date === dateKey) {
        lastGroup.messages.push(msg);
      } else {
        groups.push({ date: dateKey, messages: [msg] });
      }
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate();

  if (messages.length === 0 && !isLoadingMessages) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No messages yet</Text>
        <Text style={styles.emptySubtext}>Send a message to start the conversation</Text>
      </View>
    );
  }

  return (
    <>
      {isLoadingMessages && (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="small" color={THEME.colors.primary} />
        </View>
      )}

      {messageGroups.map((group, groupIndex) => (
        <View key={`${group.date}-${groupIndex}`}>
          <Text style={styles.date}>{group.date}</Text>

          {group.messages.map((message) => {
            const isOwn = isOwnMessage(message.sender);
            const isDeleted = message.isDeleted;

            if (message.msgtype === "m.image" && !isDeleted) {
              return (
                <Pressable
                  key={message.id}
                  onLongPress={() => handleLongPress(message)}
                  delayLongPress={500}
                >
                  <View style={isOwn ? styles.sent : styles.received}>
                    <View style={isOwn ? styles.sentBubble : styles.receivedBubble}>
                      <Image
                        source={{ uri: message.body }}
                        style={styles.image}
                      />
                      <Text style={styles.time}>{formatTime(message.timestamp)}</Text>
                    </View>
                  </View>
                </Pressable>
              );
            }

            return (
              <Pressable
                key={message.id}
                onLongPress={() => handleLongPress(message)}
                delayLongPress={500}
                disabled={!isOwn || isDeleted}
              >
                <View style={isOwn ? styles.sent : styles.received}>
                  <View style={isOwn ? styles.sentBubble : styles.receivedBubble}>
                    <Text style={[styles.text, isDeleted && styles.deletedText]}>
                      {isDeleted ? "Message deleted" : message.body}
                    </Text>
                    <View style={isOwn ? styles.sentMeta : styles.receivedMeta}>
                      <Text style={styles.time}>
                        {formatTime(message.timestamp)}
                        {message.isEdited && " (edited)"}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}

      {/* Edit Modal */}
      <Modal
        visible={editingMessage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingMessage(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Message</Text>
            <TextInput
              style={styles.editInput}
              value={editText}
              onChangeText={setEditText}
              multiline
              autoFocus
              blurOnSubmit={false}
              returnKeyType="done"
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => {
                  setEditingMessage(null);
                  setEditText("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.saveButton, !editText.trim() && styles.saveButtonDisabled]}
                onPress={handleSaveEdit}
                disabled={!editText.trim() || isEditing}
              >
                <Text style={styles.saveButtonText}>
                  {isEditing ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: THEME.colors.text_title,
    fontSize: 16,
    fontWeight: "600",
  },
  emptySubtext: {
    color: THEME.colors.text_opacity,
    marginTop: 8,
    fontSize: 14,
  },
  loadingMore: {
    padding: 10,
    alignItems: "center",
  },
  date: {
    alignSelf: "center",
    color: THEME.colors.text_opacity,
    backgroundColor: "#1b1b1b",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 10,
    marginVertical: 10,
  },

  received: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  sent: {
    alignItems: "flex-end",
    marginBottom: 10,
  },

  receivedBubble: {
    backgroundColor: "#2a2a2a",
    padding: 10,
    borderRadius: 12,
    maxWidth: "85%",
  },
  sentBubble: {
    backgroundColor: THEME.colors.secondary,
    padding: 10,
    borderRadius: 12,
    maxWidth: "85%",
  },

  text: {
    color: "#e2e2e2",
  },
  deletedText: {
    color: "#888888",
    fontStyle: "italic",
  },
  time: {
    fontSize: 10,
    color: THEME.colors.text_opacity,
    marginTop: 4,
  },
  sentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    justifyContent: "flex-end",
    marginTop: 4,
  },
  receivedMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    maxWidth: 400,
  },
  modalTitle: {
    color: "#e2e2e2",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  editInput: {
    backgroundColor: "#1b1b1b",
    borderRadius: 8,
    padding: 12,
    color: "#e2e2e2",
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: "#888888",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: "#555555",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
