import { useCallback, useEffect, useRef, useState } from "react";
import { MatrixEvent } from "../shared/types/matrixEvent";
import { useSyncLoop } from "./useSyncLoop";
import { authStorage } from "../storage/auth-storage";
import { Message } from "../shared/types/matrixMessage";
import { getRoomMessages, redactMessage, sendRoomMessage, editMessage as editMessageApi } from "../services/matrix/messages";

interface UseRoomMessagesOptions {
  roomId: string;
  initialLimit?: number;
  onNewMessage?: (message: Message) => void;
  onMessageDeleted?: (eventId: string) => void;
  enabled?: boolean;
}

interface UseRoomMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  sendMessage: (body: string, replyTo?: { eventId: string; body: string; sender: string } | null) => Promise<boolean>;
  deleteMessage: (eventId: string) => Promise<boolean>;
  editMessage: (eventId: string, newBody: string) => Promise<boolean>;
  isSending: boolean;
  isDeleting: boolean;
  isEditing: boolean;
  refresh: () => Promise<void>;
}

export const useRoomMessages = (options: UseRoomMessagesOptions): UseRoomMessagesReturn => {
  const { roomId, initialLimit = 50, onNewMessage, enabled = true } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const cursorRef = useRef<string | null>(null);
  const initializedRef = useRef(false);

  // helper parar reemplazar mensajes editados con el original
  const mergeEdits = (messages: Message[]): Message[] => {
    const originals = new Map<string, Message>();
    const edits: Message[] = [];

    messages.forEach(msg => {
      if (msg.isEdited && msg.editedEventId) {
        edits.push(msg);
      } else {
        originals.set(msg.id, msg);
      }
    });

    edits.forEach(edit => {
      const original = originals.get(edit.editedEventId!);
      if (original) {
        original.body = edit.body;
        original.isEdited = true;
        original.editedEventId = edit.id;
      }
    });

    return Array.from(originals.values()).sort((a, b) => a.timestamp - b.timestamp);
  };

  const processEventToMessage = useCallback((event: MatrixEvent, msgRoomId: string): Message => {
    const relatesTo = (event["m.relates_to"] || event.content?.["m.relates_to"]) as { rel_type?: string; event_id?: string } | undefined;
    const isEdited = relatesTo?.rel_type === "m.replace";

    const isReply = relatesTo?.rel_type === "m.in_reply_to";
    const replyToEventId = relatesTo?.event_id;

    const fallbackText = event.content?.["m.fallback_text"] as string | undefined;
    const replyToBody: string | undefined = fallbackText
      ? fallbackText.replace(/^<[^>]+> /, '')
      : (isReply ? (event.content?.body as string | undefined) : undefined);
    const replyToSender = fallbackText
      ? fallbackText.match(/^<([^>]+)>/)?.[1]
      : undefined;

    return {
      id: event.event_id,
      roomId: event.roomId || msgRoomId,
      sender: event.sender,
      body: (event.content?.body as string) || '',
      timestamp: event.origin_server_ts || Date.now(),
      type: event.type,
      msgtype: event.content?.msgtype as string,
      isEdited: isEdited,
      editedEventId: isEdited ? relatesTo?.event_id : undefined,
      replyTo: isReply ? replyToEventId : undefined,
      replyToBody: isReply ? replyToBody : undefined,
      replyToSender: isReply ? replyToSender : undefined,
    };
  }, []);

  const loadInitialMessages = useCallback(async () => {
    if (!enabled || !roomId) return;

    const session = await authStorage.getSession();
    if (!session?.access_token) return;

    setIsLoading(true);

    try {
      const result = await getRoomMessages(
        roomId,
        session.access_token,
        'b',
        undefined,
        initialLimit
      );

      const msgs = result.messages
        .filter(e => e.type === 'm.room.message')
        .map(e => processEventToMessage(e, roomId))
        .sort((a, b) => a.timestamp - b.timestamp);

      const mergedMsgs = mergeEdits(msgs);

      setMessages(mergedMsgs);
      cursorRef.current = result.endCursor;
      setHasMore(result.hasMore);
      initializedRef.current = true;

    } catch (error) {
      console.error('[useRoomMessages] Error loading initial:', error);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, initialLimit, enabled, processEventToMessage]);

  const loadMore = useCallback(async () => {
    if (!enabled || !roomId || isLoading || !hasMore) return;

    const session = await authStorage.getSession();
    if (!session?.access_token) return;

    setIsLoading(true);

    try {
      const result = await getRoomMessages(
        roomId,
        session.access_token,
        'b',
        cursorRef.current || undefined,
        initialLimit
      );

      const newMessages = result.messages
        .filter(e => e.type === 'm.room.message')
        .map(e => processEventToMessage(e, roomId))
        .sort((a, b) => a.timestamp - b.timestamp);

      const mergedNew = mergeEdits(newMessages);

      const existingIds = new Set(messages.map(m => m.id));
      const uniqueNew = mergedNew.filter(m => !existingIds.has(m.id));

      setMessages(prev => [...uniqueNew, ...prev]);
      cursorRef.current = result.endCursor;
      setHasMore(result.hasMore);

    } catch (error) {
      console.error('[useRoomMessages] Error loading more:', error);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, initialLimit, enabled, isLoading, hasMore, messages, processEventToMessage]);

  const sendMessage = useCallback(async (body: string, replyTo?: { eventId: string; body: string; sender: string } | null): Promise<boolean> => {
    if (!roomId || !body.trim()) return false;

    const session = await authStorage.getSession();
    if (!session?.access_token) return false;

    setIsSending(true);

    try {
      const eventId = await sendRoomMessage(roomId, session.access_token, body.trim(), "m.text", replyTo || undefined);

      if (eventId) {
        const tempMessage: Message = {
          id: eventId,
          roomId,
          sender: session.user_id,
          body: body.trim(),
          timestamp: Date.now(),
          type: 'm.room.message',
          msgtype: 'm.text',
          replyTo: replyTo?.eventId,
          replyToBody: replyTo?.body,
          replyToSender: replyTo?.sender,
        };

        setMessages(prev => [...prev, tempMessage]);
        onNewMessage?.(tempMessage);
        return true;
      }

      return false;
    } catch (error) {
      console.error('[useRoomMessages] Error sending:', error);
      return false;
    } finally {
      setIsSending(false);
    }
  }, [roomId, onNewMessage]);

  const deleteMessage = useCallback(async (eventId: string): Promise<boolean> => {
    if (!roomId || !eventId) return false;

    const session = await authStorage.getSession();
    if (!session?.access_token) return false;

    setIsDeleting(true);

    try {
      const success = await redactMessage(roomId, eventId, session.access_token);

      if (success) {
        // marcar como eliminado y reemplazar contenido con Message deleted
        setMessages(prev =>
          prev.map(msg =>
            msg.id === eventId
              ? { ...msg, body: "Message deleted", isDeleted: true }
              : msg
          )
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error('[useRoomMessages] Error deleting:', error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [roomId]);

  const editMessage = useCallback(async (eventId: string, newBody: string): Promise<boolean> => {
    console.log("[useRoomMessages] editMessage called:", eventId, newBody);
    if (!roomId || !eventId || !newBody.trim()) {
      console.log("[useRoomMessages] Invalid params");
      return false;
    }

    const session = await authStorage.getSession();
    if (!session?.access_token) {
      console.log("[useRoomMessages] No session");
      return false;
    }

    setIsEditing(true);

    try {
      console.log("[useRoomMessages] Calling editMessageApi...");
      const newEventId = await editMessageApi(roomId, eventId, session.access_token, newBody.trim());
      console.log("[useRoomMessages] editMessageApi result:", newEventId);

      if (newEventId) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === eventId
              ? {
                ...msg,
                body: newBody.trim(),
                isEdited: true,
                editedEventId: newEventId
              }
              : msg
          )
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error('[useRoomMessages] Error editing:', error);
      return false;
    } finally {
      setIsEditing(false);
    }
  }, [roomId]);

  const refresh = useCallback(async () => {
    cursorRef.current = null;
    setMessages([]);
    setHasMore(true);
    initializedRef.current = false;
    await loadInitialMessages();
  }, [loadInitialMessages]);

  const handleNewMessages = useCallback((eventRoomId: string, events: MatrixEvent[]) => {
    if (eventRoomId !== roomId) return;

    const nonEditedEvents = events.filter(e => {
      const relatesTo = e.content?.["m.relates_to"] as { rel_type?: string } | undefined;
      return relatesTo?.rel_type !== "m.replace";
    });

    if (nonEditedEvents.length > 0) {
      const newMessages = nonEditedEvents
        .filter(e => e.type === 'm.room.message')
        .map(e => processEventToMessage(e, roomId));

      if (newMessages.length > 0) {
        setMessages(prev => {
          // Filtrar duplicados usando event_id
          const existingIds = new Set(prev.map(m => m.id));
          const uniqueNew = newMessages.filter(m => !existingIds.has(m.id));

          if (uniqueNew.length === 0) return prev;

          return [...prev, ...uniqueNew];
        });
        newMessages.forEach(msg => onNewMessage?.(msg));
      }
    }
  }, [roomId, onNewMessage, processEventToMessage]);

  // redacta las eliminaciones cuando el otro usuario elimina un mensaje
  const handleRedaction = useCallback((eventRoomId: string, redactedEventIds: string[]) => {
    if (eventRoomId !== roomId) return;

    if (redactedEventIds.length > 0) {
      setMessages(prev =>
        prev.map(msg =>
          redactedEventIds.includes(msg.id)
            ? { ...msg, body: "Message deleted", isDeleted: true }
            : msg
        )
      );
    }
  }, [roomId]);

  const handleEdit = useCallback((eventRoomId: string, originalEventId: string, newBody: string, newEventId: string) => {
    if (eventRoomId !== roomId) return;

    console.log("[useRoomMessages] handleEdit:", originalEventId, "->", newBody);
    setMessages(prev => {
      const hasOriginal = prev.some(m => m.id === originalEventId);
      const hasNewEvent = prev.some(m => m.editedEventId === newEventId);

      if (!hasOriginal || hasNewEvent) return prev;

      return prev.map(msg =>
        msg.id === originalEventId
          ? { ...msg, body: newBody, isEdited: true, editedEventId: newEventId }
          : msg
      );
    });
  }, [roomId]);

  const syncLoop = useSyncLoop({
    onMessages: handleNewMessages,
    onRedaction: handleRedaction,
    onEdit: handleEdit,
    enabled: enabled,
  });

  useEffect(() => {
    if (!enabled || !roomId) return;

    // Solo iniciar si no está ya corriendo
    if (!syncLoop.isRunning) {
      syncLoop.startSync();
    }

    // Cargar mensajes iniciales solo una vez
    if (!initializedRef.current) {
      loadInitialMessages();
    }

    return () => {
      syncLoop.stopSync();
    };
  }, [roomId, enabled, loadInitialMessages]);

  return {
    messages,
    isLoading,
    hasMore,
    loadMore,
    sendMessage,
    deleteMessage,
    editMessage,
    isSending,
    isDeleting,
    isEditing,
    refresh,
  };
};
