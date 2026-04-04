import { THEME } from "@/src/shared/lib/theme"
import { Image, StyleSheet, Text, View, ActivityIndicator, Pressable, TextInput, Modal } from "react-native"
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Message } from "@/src/shared/types/matrixMessage";
import { formatDate } from "@/src/shared/utils/time";
import { useState } from "react";

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
  const [showMenu, setShowMenu] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleLongPress = (message: Message) => {
    // Only show menu for own messages and non-deleted
    if (message.isDeleted) return;

    setSelectedMessage(message);
    setShowMenu(true);
  };

  const handleEdit = () => {
    if (selectedMessage) {
      setEditingMessage(selectedMessage);
      setEditText(selectedMessage.body);
    }
    setShowMenu(false);
    setSelectedMessage(null);
  };

  const handleDelete = () => {
    if (selectedMessage) {
      // Show confirmation and delete
      onDeleteMessage?.(selectedMessage.id);
    }
    setShowMenu(false);
    setSelectedMessage(null);
  };

  const handleReply = () => {
    setShowMenu(false);
    setSelectedMessage(null);
  };

  const handleSaveEdit = async () => {
    if (editingMessage && editText.trim()) {
      const result = await onEditMessage?.(editingMessage.id, editText.trim());
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
  const isSelectedMine = selectedMessage ? isOwnMessage(selectedMessage.sender) : false;

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
                disabled={isDeleted}
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

      {/* Options Menu Modal */}
      <Modal transparent visible={showMenu} animationType="fade" onRequestClose={() => setShowMenu(false)}>
        <Pressable style={styles.modalBackdrop} onPressOut={() => setShowMenu(false)}>
          <View style={styles.menuBox}>
            <Pressable style={styles.menuButton} onPress={handleReply}>
              <MaterialCommunityIcons name="reply-outline" size={24} color={THEME.colors.primary} />
              <Text style={styles.menuText}>Responder</Text>
            </Pressable>

            {isSelectedMine && (
              <>
                <Pressable style={styles.menuButton} onPress={handleEdit}>
                  <MaterialCommunityIcons name="pencil-outline" size={24} color={THEME.colors.primary} />
                  <Text style={styles.menuText}>Editar</Text>
                </Pressable>

                <Pressable style={styles.menuButton} onPress={handleDelete}>
                  <Feather name="trash-2" size={24} color={THEME.colors.danger} />
                  <Text style={[styles.menuText, { color: THEME.colors.danger }]}>Eliminar</Text>
                </Pressable>
              </>
            )}

            <Pressable style={styles.menuCancel} onPress={() => setShowMenu(false)}>
              <Text style={styles.menuCancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

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
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuBox: {
    backgroundColor: THEME.colors.secondary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 40,
    minWidth: 200,
  },
  menuButton: {
    paddingVertical: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: THEME.colors.primary,
  },
  menuCancel: {
    marginTop: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  menuCancelText: {
    fontSize: 15,
    color: "#888888",
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
