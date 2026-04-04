import { ENV } from "@/src/shared/constants/env";
import { MatrixEvent } from "@/src/shared/types/matrixEvent";

export const sendRoomMessage = async (
  roomId: string,
  token: string,
  body: string,
  msgtype: string = "m.text"
): Promise<string | null> => {
  try {
    const txnId = `m${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const res = await fetch(
      `${ENV.MATRIX_URL}/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/send/m.room.message/${txnId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          msgtype,
          body,
        }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      console.error("[sendRoomMessage] Error:", error);
      return null;
    }

    const data = await res.json();
    return data.event_id;
  } catch (err) {
    console.error("[sendRoomMessage] Network error:", err);
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
        body: JSON.stringify({
          reason,
        }),
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
): Promise<{
  messages: MatrixEvent[];
  endCursor: string | null;
  hasMore: boolean;
}> => {
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

    const data = await res.json();

    return {
      messages: data.chunk || [],
      endCursor: data.end || null,
      hasMore: data.chunk?.length === limit,
    };
  } catch (err) {
    console.error("[getRoomMessages] Network error:", err);
    return { messages: [], endCursor: null, hasMore: false };
  }
};
