// Tipos para timeline (procesamiento de eventos)

export type TimelineEventType = "message" | "redaction" | "member" | "call" | "other";

export interface ProcessedTimelineEvent {
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
}

// Resultado del procesamiento de un evento
export interface TimelineEventResult {
  type: TimelineEventType;
  data: ProcessedTimelineEvent;
}
