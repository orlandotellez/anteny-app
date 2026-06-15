import { THEME } from "@/src/shared/lib/theme"
import { Image, Text, View, ActivityIndicator, Pressable } from "react-native"
import { Message } from "@/src/shared/types/matrixMessage";
import { formatDate } from "@/src/shared/utils/time";
import { useState } from "react";
import { getUsernameFromUserId } from "@/src/shared/utils/format";
import { OptionsModal } from "../modals/OptionsModal";
import { EditModal } from "../modals/EditModal";
import { styles } from "./Conversation.styles";

interface ConversationProps {
  messages: Message[];
  currentUserId: string;
  formatTime: (timestamp: number) => string;
  isLoadingMessages?: boolean;
  onDeleteMessage?: (eventId: string) => void;
  onEditMessage?: (eventId: string, newBody: string) => void;
  onReplyMessage?: (message: Message) => void;
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
  onReplyMessage,
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
    if (selectedMessage) {
      onReplyMessage?.(selectedMessage);
    }
    setShowMenu(false);
    setSelectedMessage(null);
  };

  const handleSaveEdit = async () => {
    if (editingMessage && editText.trim()) {
      const result = onEditMessage?.(editingMessage.id, editText.trim());
      if (result) {
        setEditingMessage(null);
        setEditText("");
      }
    }
  };

  const groupMessagesByDate = () => {
    const groups: { date: string; dateKey: string; messages: Message[] }[] = [];

    messages.forEach((msg) => {
      const dateKey = formatDate(msg.timestamp);
      const lastGroup = groups[groups.length - 1];

      if (lastGroup && lastGroup.dateKey === dateKey) {
        lastGroup.messages.push(msg);
      } else {
        groups.push({ date: dateKey, dateKey, messages: [msg] });
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
        <View key={`${group.dateKey}-${groupIndex}`}>
          <View style={styles.dateContainer}>
            <View style={styles.dateBadge}>
              <Text style={styles.date}>{group.date}</Text>
            </View>
          </View>

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
                    {/* Reply Preview */}
                    {message.replyTo && (
                      <View style={styles.replyPreviewContainer}>
                        <View style={styles.replyLine} />
                        <View style={styles.replyContent}>
                          <Text style={styles.replyLabel}>{getUsernameFromUserId(message.replyToSender as string)}</Text>
                          <Text style={styles.replyText} numberOfLines={1}>
                            {message.replyToBody}
                          </Text>
                        </View>
                      </View>
                    )}

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
      <OptionsModal
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        handleReply={handleReply}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        isSelectedMine={isSelectedMine}
      />

      {/* Edit Modal */}
      <EditModal
        editingMessage={editingMessage}
        setEditingMessage={(value) => setEditingMessage(value)}
        setEditText={setEditText}
        editText={editText}
        handleSaveEdit={handleSaveEdit}
        isEditing={isEditing}
      />
    </>
  );
}
