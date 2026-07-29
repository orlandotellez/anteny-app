import { useState, useMemo, useCallback, useEffect } from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";
import { ChatItem } from "@/src/features/chats/components/ChatItem";
import { Header } from "@/src/features/chats/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChats } from "@/src/features/chats/context/ChatContext";
import { router } from "expo-router";
import { ChatRoom } from "@/src/shared/types/matrixRoom";
import { formatRelativeTime } from "@/src/shared/utils/format";
import { Filters } from "@/src/features/chats/components/Filters";
import { ConfirmDialog } from "@/src/shared/components/common/ConfirmDialog";
import { ChatView } from "@/src/features/[chatId]/components/ChatView";
import { ProfileView } from "@/src/features/[chatId]/components/ProfileView";
import { useResponsive } from "@/src/shared/hooks/useResponsive";
import { IChatData } from "@/src/shared/types/chats";
import { styles } from "@/src/styles/tabs/index.styles";

type FilterType = "all" | "direct" | "groups" | "invites";

export default function ChatScreen() {
  const { chats, isLoading, loadChats, removeChat, acceptInvite, rejectInvite, pendingChatId, setPendingChatId } = useChats();
  const { isWide } = useResponsive();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Split pane: selected chat for wide web layout
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);

  // Auto-seleccionar chat pendiente (cuando venimos de contacts en web ancho)
  useEffect(() => {
    if (isWide && pendingChatId) {
      const chat = chats.find(c => c.room_id === pendingChatId);
      if (chat) {
        setShowProfile(null);
        setSelectedChat(chat);
        setPendingChatId(null);
      }
    }
  }, [isWide, pendingChatId, chats, setPendingChatId]);

  // Split pane: mostrar perfil en vez del chat (inline, sin navegar)
  const [showProfile, setShowProfile] = useState<{
    chatId: string;
    userId: string;
    displayName: string;
  } | null>(null);

  // Estado para el ConfirmDialog de eliminar chat
  const [deleteDialog, setDeleteDialog] = useState<{ roomId: string; chatName: string } | null>(null);

  // Estado para el ConfirmDialog de aceptar invitación (tap)
  const [acceptInviteDialog, setAcceptInviteDialog] = useState<{ roomId: string; chatName: string } | null>(null);

  // Estado para el ConfirmDialog de rechazar invitación (long press)
  const [rejectInviteDialog, setRejectInviteDialog] = useState<{ roomId: string; chatName: string } | null>(null);

  const handleChatPress = (chat: ChatRoom) => {
    if (chat.isInvite) {
      setAcceptInviteDialog({ roomId: chat.room_id, chatName: chat.name || "Chat" });
    } else if (isWide) {
      // En pantalla ancha: seleccionar el chat para mostrar en el panel derecho
      setShowProfile(null);
      setSelectedChat(chat);
    } else {
      router.push(`/${chat.room_id}`);
    }
  };

  const handleChatLongPress = (roomId: string, chatName: string, isInvite?: boolean) => {
    if (isInvite) {
      // Long press en invitación → mostrar diálogo de rechazar
      setRejectInviteDialog({ roomId, chatName });
    } else {
      setDeleteDialog({ roomId, chatName });
    }
  };

  const handleSplitPaneProfilePress = (_chatId: string, chatData: IChatData) => {
    if (chatData.isDirect && chatData.otherUser) {
      if (isWide) {
        // En web ancho: mostrar perfil inline en el panel derecho
        setShowProfile({
          chatId: _chatId,
          userId: chatData.otherUser.user_id,
          displayName: chatData.otherUser.displayname || chatData.name,
        });
      } else {
        // En móvil: navegar a la pantalla de perfil
        router.push({
          pathname: "/[chatId]/profile",
          params: {
            chatId: _chatId,
            userId: chatData.otherUser.user_id,
            displayName: chatData.otherUser.displayname || chatData.name,
          },
        });
      }
    }
  };

  const handleProfileBack = useCallback(() => {
    setShowProfile(null);
  }, []);

  // Filtrar chats
  const filteredChats = useMemo(() => {
    let result = chats;

    // Filtrar por tipo
    if (activeFilter === "direct") {
      result = result.filter(chat => chat.isDirect && !chat.isInvite);
    } else if (activeFilter === "groups") {
      result = result.filter(chat => !chat.isDirect && !chat.isInvite);
    } else if (activeFilter === "invites") {
      result = result.filter(chat => chat.isInvite);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(chat =>
        chat.name?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [chats, activeFilter, searchQuery]);

  // Contar invitaciones pendientes
  const inviteCount = useMemo(() => {
    return chats.filter(chat => chat.isInvite).length;
  }, [chats]);

  // Content: Chat list (left panel)
  const chatListPanel = (
    <View style={{ flex: isWide ? 0 : 1, width: isWide ? '35%' : undefined, minWidth: isWide ? 335 : undefined, maxWidth: isWide ? 420 : undefined, borderRightWidth: isWide ? 1 : 0, borderRightColor: THEME.colors.border }}>
      {/* HEADER */}
      <Header
        onSearchToggle={() => setShowSearch(!showSearch)}
        showSearch={showSearch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* FILTROS */}
      <Filters
        activeFilter={activeFilter}
        setActiveFilter={(f) => setActiveFilter(f as FilterType)}
        inviteCount={inviteCount}
      />

      {/* LIST */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.loadingText}>Cargando chats...</Text>
        </View>
      ) : filteredChats.length > 0 ? (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.room_id}
          renderItem={({ item }) => (
            <ChatItem
              id={item.room_id}
              name={item.name || "Chat"}
              lastMessage={item.isInvite ? "Tap to accept" : (item.lastMessage || (item.isDirect ? "DM" : "Group chat"))}
              time={item.isInvite ? "Invite" : (item.lastMessageTimestamp ? formatRelativeTime(item.lastMessageTimestamp) : "now")}
              onPress={() => handleChatPress(item)}
              onLongPress={() => handleChatLongPress(item.room_id, item.name || "Chat", item.isInvite)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshing={isLoading}
          onRefresh={loadChats}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery ? "No se encontraron chats" : "No tienes chats aún"}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchQuery ? "Intenta con otro término" : "Busca un usuario y crea un chat directo"}
          </Text>
        </View>
      )}

      {/* FAB - only show on mobile */}
      {!isWide && (
        <TouchableOpacity style={styles.fab} onPress={() => router.push("/contacts/new-contact")}>
          <Ionicons name="add" size={25} color="#002109" />
          <Ionicons name="people" size={25} color="#002109" />
        </TouchableOpacity>
      )}
    </View>
  );

  // Content: Chat detail (right panel for wide web)
  const chatDetailPanel = (
    <View style={{ flex: 1, backgroundColor: THEME.colors.background }}>
      {showProfile ? (
        <ProfileView
          key={showProfile.chatId}
          displayName={showProfile.displayName}
          userId={showProfile.userId}
          onBack={handleProfileBack}
        />
      ) : selectedChat ? (
        <ChatView
          key={selectedChat.room_id}
          chatId={selectedChat.room_id}
          onProfilePress={handleSplitPaneProfilePress}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Ionicons name="chatbubbles-outline" size={64} color={THEME.colors.border} />
          <Text style={{ color: THEME.colors.text_opacity, fontSize: 18, marginTop: 16, fontWeight: "600" }}>
            Selecciona un chat
          </Text>
          <Text style={{ color: THEME.colors.muted, fontSize: 14, marginTop: 8 }}>
            Elige una conversación para empezar
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {isWide ? (
        // === SPLIT PANE: Chat list (left) + Chat detail (right) ===
        <View style={{ flex: 1, flexDirection: "row" }}>
          {chatListPanel}
          {chatDetailPanel}
        </View>
      ) : (
        // === MOBILE: Only chat list with navigation ===
        chatListPanel
      )}

      {/* ConfirmDialog: Eliminar chat (long press) */}
      <ConfirmDialog
        open={deleteDialog !== null}
        title="Eliminar chat"
        message={deleteDialog ? `¿Quieres eliminar el chat con "${deleteDialog.chatName}"?` : ''}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        destructive
        onConfirm={async () => {
          if (!deleteDialog) return;
          try {
            await removeChat(deleteDialog.roomId);
            // Clear selected chat if it was the deleted one
            if (selectedChat?.room_id === deleteDialog.roomId) {
              setSelectedChat(null);
              setShowProfile(null);
            }
          } catch {
            // Error manejado internamente
          }
          setDeleteDialog(null);
        }}
        onCancel={() => setDeleteDialog(null)}
      />

      {/* ConfirmDialog: Aceptar invitación (tap) */}
      <ConfirmDialog
        open={acceptInviteDialog !== null}
        title="Aceptar chat"
        message={acceptInviteDialog ? `¿Quieres aceptar el chat con "${acceptInviteDialog.chatName}"?` : ''}
        confirmLabel="Aceptar"
        cancelLabel="Cancelar"
        onConfirm={async () => {
          if (!acceptInviteDialog) return;
          const { roomId } = acceptInviteDialog;
          setAcceptInviteDialog(null);
          try {
            await acceptInvite(roomId);
            if (isWide) {
              // En split pane, seleccionar el chat recién aceptado
              const accepted = chats.find(c => c.room_id === roomId);
              if (accepted) setSelectedChat(accepted);
            } else {
              router.push(`/${roomId}`);
            }
          } catch {
            // Error manejado internamente
          }
        }}
        onCancel={() => setAcceptInviteDialog(null)}
      />

      {/* ConfirmDialog: Rechazar invitación (long press) */}
      <ConfirmDialog
        open={rejectInviteDialog !== null}
        title="Rechazar invitación"
        message={rejectInviteDialog ? `¿Quieres rechazar la invitación de "${rejectInviteDialog.chatName}"?` : ''}
        confirmLabel="Rechazar"
        cancelLabel="Cancelar"
        destructive
        onConfirm={async () => {
          if (!rejectInviteDialog) return;
          const { roomId } = rejectInviteDialog;
          setRejectInviteDialog(null);
          try {
            await rejectInvite(roomId);
            if (selectedChat?.room_id === roomId) {
              setSelectedChat(null);
              setShowProfile(null);
            }
          } catch {
            // Error manejado internamente
          }
        }}
        onCancel={() => setRejectInviteDialog(null)}
      />
    </SafeAreaView>
  );
}
