import { THEME } from "@/src/shared/lib/theme";
import { Message } from "@/src/shared/types/matrixMessage";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface EditModalProps {
  editingMessage: Message | null;

  setEditingMessage: (value: Message | null) => void;

  setEditText: (value: string) => void;
  editText: string;

  handleSaveEdit: () => void;

  isEditing: boolean;
}

export const EditModal = ({ editingMessage, setEditingMessage, editText, setEditText, handleSaveEdit, isEditing }: EditModalProps) => {
  return (
    <>
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
  )
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
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
})
