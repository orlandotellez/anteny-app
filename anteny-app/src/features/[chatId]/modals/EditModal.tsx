import { Message } from "@/src/shared/types/matrixMessage";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "./EditModal.styles";

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
