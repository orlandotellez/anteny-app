import { MatrixEvent } from "@/src/shared/types/matrixEvent";
import { MatrixTimeline } from "@/src/shared/types/matrixTimeline";

export const processTimelineEvent = (
  event: MatrixEvent,
  currentUserId: string
): {
  type: "message" | "redaction" | "member" | "call" | "other";
  data: MatrixTimeline;
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


