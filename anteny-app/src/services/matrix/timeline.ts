import { MatrixEvent, MemberEventContent } from "@/src/shared/types/matrixEvent";
import { MatrixMessageContent } from "@/src/shared/types/matrixMessage";
import { MatrixTimeline } from "@/src/shared/types/matrixTimeline";

// Tipos de resultado

export type TimelineEventType = "message" | "redaction" | "member" | "call" | "other";

export interface TimelineEventResult {
  type: TimelineEventType;
  data: MatrixTimeline;
}

// Funciones del servicio
export const processTimelineEvent = (
  event: MatrixEvent,
  currentUserId: string
): TimelineEventResult | null => {
  const { type, sender, content, event_id, roomId, origin_server_ts, state_key } = event;

  if (type === "m.room.message") {
    const msgContent = content as unknown as MatrixMessageContent;
    return {
      type: "message",
      data: {
        eventId: event_id,
        roomId,
        sender,
        body: msgContent?.body ?? "",
        msgtype: msgContent?.msgtype,
        timestamp: origin_server_ts ?? Date.now(),
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
        timestamp: origin_server_ts ?? Date.now(),
        redacts: event.redacts,
      },
    };
  }

  if (type === "m.room.member") {
    const memberContent = content as unknown as MemberEventContent;
    const newMember = {
      userId: state_key ?? sender,
      membership: memberContent?.membership ?? "join",
      displayname: memberContent?.displayname,
    };

    return {
      type: "member",
      data: {
        eventId: event_id,
        roomId,
        sender,
        body: "",
        timestamp: origin_server_ts ?? Date.now(),
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
        timestamp: origin_server_ts ?? Date.now(),
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
      timestamp: origin_server_ts ?? Date.now(),
    },
  };
};


