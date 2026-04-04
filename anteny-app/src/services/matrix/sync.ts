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
  redactions: Map<string, string[]>;
  editedMessages: Map<string, MatrixEvent[]>;
} => {
  const newMessages = new Map<string, MatrixEvent[]>();
  const newInvites: string[] = [];
  const joinedRooms: string[] = [];
  const leftRooms: string[] = [];
  const redactions = new Map<string, string[]>();
  const editedMessages = new Map<string, MatrixEvent[]>();

  if (syncData.rooms?.join) {
    for (const [roomId, roomData] of Object.entries(syncData.rooms.join)) {
      const timelineEvents = roomData.timeline?.events || [];

      const regularMessages: MatrixEvent[] = [];
      const editedEvents: MatrixEvent[] = [];

      timelineEvents.forEach(e => {
        if (e.type === "m.room.message") {
          const relatesTo = e.content?.["m.relates_to"] as { rel_type?: string; event_id?: string } | undefined;
          if (relatesTo?.rel_type === "m.replace") {
            editedEvents.push(e);
          } else if (e.sender !== currentUserId) {
            regularMessages.push(e);
          }
        }
      });

      const redactedEventIds = timelineEvents
        .filter((e) => e.type === "m.room.redaction")
        .map((e) => e.redacts)
        .filter((id): id is string => !!id);

      if (redactedEventIds.length > 0) {
        redactions.set(roomId, redactedEventIds);
      }

      if (regularMessages.length > 0) {
        newMessages.set(roomId, regularMessages);
      }

      if (editedEvents.length > 0) {
        editedMessages.set(roomId, editedEvents);
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
    redactions,
    editedMessages,
  };
};
