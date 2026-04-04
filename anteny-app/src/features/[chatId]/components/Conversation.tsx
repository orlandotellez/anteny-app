import { THEME } from "@/src/shared/lib/theme"
import { Image, StyleSheet, Text, View, ActivityIndicator, Pressable, Alert } from "react-native"
import { Message } from "@/src/shared/types/matrixMessage";
import { formatDate } from "@/src/shared/utils/time";

interface ConversationProps {
  messages: Message[];
  currentUserId: string;
  formatTime: (timestamp: number) => string;
  isLoadingMessages?: boolean;
  onDeleteMessage?: (eventId: string) => void;
  isDeleting?: boolean;
}

export const Conversation = ({
  messages,
  currentUserId,
  formatTime,
  isLoadingMessages = false,
  onDeleteMessage,
  isDeleting = false,
}: ConversationProps) => {
  const isOwnMessage = (sender: string) => sender === currentUserId;

  const handleLongPress = (message: Message) => {
    // Only allow deleting own messages
    if (!isOwnMessage(message.sender)) return;

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
                disabled={!isOwn}
              >
                <View style={isOwn ? styles.sent : styles.received}>
                  <View style={isOwn ? styles.sentBubble : styles.receivedBubble}>
                    <Text style={[styles.text, isDeleted && styles.deletedText]}>
                      {isDeleted ? "Message deleted" : message.body}
                    </Text>
                    <View style={isOwn ? styles.sentMeta : styles.receivedMeta}>
                      <Text style={styles.time}>{formatTime(message.timestamp)}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </>
  )
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
})
