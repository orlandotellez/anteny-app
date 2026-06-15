import { Modal, Pressable, Text, View } from "react-native"
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { THEME } from "@/src/shared/lib/theme";
import { styles } from "./OptionsModal.styles";

interface OptionsModalProps {
  showMenu: boolean;
  setShowMenu: (value: boolean) => void;

  handleReply: () => void;
  handleEdit: () => void;
  handleDelete: () => void;

  isSelectedMine: boolean;
}

export const OptionsModal = ({ showMenu, setShowMenu, handleReply, handleEdit, handleDelete, isSelectedMine }: OptionsModalProps) => {
  return (
    <>
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
    </>
  )
}
