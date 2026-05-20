import { ENV } from "@/src/shared/constants/env";
import { LastRoomMessage, MatrixMessagesApiResponse, MatrixSendMessageApiResponse, RoomMessagesResult } from "@/src/shared/types/matrix-api";
import { MSG_TYPE, MatrixMessageContent } from "@/src/shared/types/matrixMessage";

// Tipos de dominio
interface ReplyTo {
  eventId: string;
  body: string;
  sender: string;
}

// Obtiene el último mensaje de una sala (para mostrar en la lista de chats)
export const getLastRoomMessage = async (roomId: string, token: string): Promise<LastRoomMessage | null> => {
  try {
    const url = new URL(
      `${ENV.MATRIX_URL}/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/messages`
    );

    // direction "b" = backwards, desde el final hacia atrás
    url.searchParams.set("dir", "b");
    url.searchParams.set("limit", "1");

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return null;
    }

    const data: MatrixMessagesApiResponse = await res.json();
    const messages = data.chunk ?? [];

    if (messages.length === 0) {
      return null;
    }

    const lastEvent = messages[0];

    // Solo mostrar mensajes (no eventos de membresía, redacciones, etc.)
    if (lastEvent.type !== "m.room.message") {
      return null;
    }

    const content = lastEvent.content as unknown as MatrixMessageContent | undefined;
    const body = content?.body ?? "";

    const result: LastRoomMessage = {
      body,
      timestamp: lastEvent.origin_server_ts ?? Date.now(),
    }

    return result
  } catch (err) {
    console.error("[getLastRoomMessage] Error:", err);
    return null;
  }
};

export const sendRoomMessage = async (
  roomId: string,
  token: string,
  body: string,
  msgtype: MSG_TYPE = "m.text",
  replyTo?: ReplyTo | null
): Promise<string | null> => {
  try {
    const txnId = `m${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const content: MatrixMessageContent = {
      msgtype,
      body,
    };

    if (replyTo) {
      content["m.relates_to"] = {
        rel_type: "m.in_reply_to",
        event_id: replyTo.eventId,
        "m.in_reply_to": { event_id: replyTo.eventId },
      };
      content["m.fallback_text"] = `<${replyTo.sender}> ${replyTo.body}`;
    }

    const res = await fetch(
      `${ENV.MATRIX_URL}/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/send/m.room.message/${txnId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      console.error("[sendRoomMessage] Error:", error);
      return null;
    }

    const data: MatrixSendMessageApiResponse = await res.json();

    return data.event_id;
  } catch (err) {
    console.error("[sendRoomMessage] Network error:", err);
    return null;
  }
};

export const editMessage = async (
  roomId: string,
  eventId: string,
  token: string,
  newBody: string,
  msgtype: MSG_TYPE = "m.text"
): Promise<string | null> => {
  try {
    const txnId = `m${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const content: MatrixMessageContent = {
      msgtype,
      body: newBody,
      "m.new_content": {
        msgtype,
        body: newBody,
      },
      "m.relates_to": {
        rel_type: "m.replace",
        event_id: eventId,
      },
    };

    const res = await fetch(
      `${ENV.MATRIX_URL}/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/send/m.room.message/${txnId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      console.error("[editMessage] Error:", error);
      return null;
    }

    const data: MatrixSendMessageApiResponse = await res.json();

    return data.event_id;
  } catch (err) {
    console.error("[editMessage] Network error:", err);
    return null;
  }
};

export const redactMessage = async (
  roomId: string,
  eventId: string,
  token: string,
  reason?: string
): Promise<boolean> => {
  try {
    // Synapse implements POST endpoint (unspecced but supported)
    const res = await fetch(
      `${ENV.MATRIX_URL}/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/redact/${encodeURIComponent(eventId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      console.error("[redactMessage] Error:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[redactMessage] Network error:", err);
    return false;
  }
};

export const getRoomMessages = async (
  roomId: string,
  token: string,
  direction: "b" | "f" = "b",
  from?: string,
  limit: number = 20
): Promise<RoomMessagesResult> => {
  try {
    const url = new URL(
      `${ENV.MATRIX_URL}/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/messages`
    );

    url.searchParams.set("dir", direction);
    url.searchParams.set("limit", String(limit));

    if (from) {
      url.searchParams.set("from", from);
    }

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("[getRoomMessages] Error:", error);
      return { messages: [], endCursor: null, hasMore: false };
    }

    const data: MatrixMessagesApiResponse = await res.json();

    const result: RoomMessagesResult = {
      messages: data.chunk ?? [],
      endCursor: data.end ?? null,
      hasMore: (data.chunk?.length ?? 0) >= limit,
    }

    return result
  } catch (err) {
    console.error("[getRoomMessages] Network error:", err);
    return { messages: [], endCursor: null, hasMore: false };
  }
};
