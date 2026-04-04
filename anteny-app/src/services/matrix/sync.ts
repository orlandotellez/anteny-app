import { SyncOptions, SyncResponse } from "@/src/shared/types/matrixSync";
import { ENV } from "../../shared/constants/env";
import { MatrixEvent } from "@/src/shared/types/matrixEvent";

const DEFAULT_TIMEOUT = 30000;
const DEFAULT_FILTER = {
  room: {
    timeline: {
      limit: 50,
      lazy_load_members: true,
    },
    state: {
      lazy_load_members: true,
    },
  },
  presence: {
    send: [],
  },
};

export const matrixSync = async (options: SyncOptions): Promise<SyncResponse | null> => {
  const { token, since, timeout = DEFAULT_TIMEOUT, setPresence = "online" } = options;

  try {
    const url = new URL(`${ENV.MATRIX_URL}/_matrix/client/v3/sync`);

    url.searchParams.set("timeout", String(timeout));

    if (since) {
      url.searchParams.set("since", since);
    }

    url.searchParams.set("filter", JSON.stringify(DEFAULT_FILTER));
    url.searchParams.set("set_presence", setPresence);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("[matrixSync] Error response:", error);
      return null;
    }

    const data = await res.json();
    return data as SyncResponse;
  } catch (err) {
    console.error("[matrixSync] Network error:", err);
    return null;
  }
};

export const processSyncResponse = (
  syncData: SyncResponse,
  currentUserId: string
): {
  newMessages: Map<string, MatrixEvent[]>;
  newInvites: string[];
  joinedRooms: string[];
  leftRooms: string[];
} => {
  const newMessages = new Map<string, MatrixEvent[]>();
  const newInvites: string[] = [];
  const joinedRooms: string[] = [];
  const leftRooms: string[] = [];

  if (syncData.rooms?.join) {
    for (const [roomId, roomData] of Object.entries(syncData.rooms.join)) {
      const timelineEvents = roomData.timeline?.events || [];
      const messageEvents = timelineEvents.filter(
        (e) =>
          e.type === "m.room.message" &&
          e.sender !== currentUserId
      );

      if (messageEvents.length > 0) {
        newMessages.set(roomId, messageEvents);
      }

      joinedRooms.push(roomId);
    }
  }

  if (syncData.rooms?.invite) {
    for (const roomId of Object.keys(syncData.rooms.invite)) {
      newInvites.push(roomId);
    }
  }

  if (syncData.rooms?.leave) {
    for (const roomId of Object.keys(syncData.rooms.leave)) {
      leftRooms.push(roomId);
    }
  }

  return {
    newMessages,
    newInvites,
    joinedRooms,
    leftRooms,
  };
};

export const processTimelineEvent = (
  event: MatrixEvent,
  currentUserId: string
): {
  type: "message" | "redaction" | "member" | "call" | "other";
  data: {
    eventId: string;
    roomId: string | undefined;
    sender: string;
    body: string;
    msgtype?: string;
    timestamp: number;
    redacts?: string;
    isSelf?: boolean;
    newMember?: {
      userId: string;
      membership: string;
      displayname?: string;
    };
  };
} | null => {
  const { type, sender, content, event_id, roomId, origin_server_ts } = event;

  const isSelf = sender === currentUserId;

  if (type === "m.room.message") {
    return {
      type: "message",
      data: {
        eventId: event_id,
        roomId,
        sender,
        body: (content.body as string) || "",
        msgtype: content.msgtype as string,
        timestamp: origin_server_ts || Date.now(),
      },
    };
  }

  if (type === "m.room.redaction") {
    return {
      type: "redaction",
      data: {
        eventId: event_id,
        roomId,
        sender,
        body: "",
        timestamp: origin_server_ts || Date.now(),
        redacts: event.redacts,
      },
    };
  }

  if (type === "m.room.member") {
    const newMember = {
      userId: (content as any).state_key || sender,
      membership: (content as any).membership || "join",
      displayname: (content as any).displayname,
    };

    return {
      type: "member",
      data: {
        eventId: event_id,
        roomId,
        sender,
        body: "",
        timestamp: origin_server_ts || Date.now(),
        newMember,
      },
    };
  }

  if (type.startsWith("m.call.")) {
    return {
      type: "call",
      data: {
        eventId: event_id,
        roomId,
        sender,
        body: "",
        timestamp: origin_server_ts || Date.now(),
      },
    };
  }

  return {
    type: "other",
    data: {
      eventId: event_id,
      roomId,
      sender,
      body: "",
      timestamp: origin_server_ts || Date.now(),
    },
  };
};

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
    const res = await fetch(
      `${ENV.MATRIX_URL}/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/redact/${encodeURIComponent(eventId)}`,
      {
        method: "PUT",
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
