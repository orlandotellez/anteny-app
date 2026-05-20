export type MSG_TYPE = "m.text" | "m.image" | "m.file" | "m.audio" | "m.video"

export type REL_TYPE = "m.in_reply_to" | "m.replace";

export interface Message {
  id: string;
  roomId: string;
  sender: string;
  body: string;
  timestamp: number;
  type: string;
  msgtype?: string;
  isDeleted?: boolean;
  isEdited?: boolean;
  editedEventId?: string;
  replyTo?: string; // event_id del mensaje al que se responde
  replyToBody?: string; // preview del mensaje al que se responde
  replyToSender?: string; // nombre del usuario al que se responde
}

export interface MatrixMessageContent {
  msgtype: MSG_TYPE;
  body: string;
  format?: string;
  formatted_body?: string;
  file?: Record<string, unknown>;
  info?: Record<string, unknown>;
  "m.relates_to"?: {
    rel_type: REL_TYPE
    event_id: string;
    "m.in_reply_to"?: { event_id: string };
  };
  "m.new_content"?: MatrixMessageContent;
  "m.fallback_text"?: string;
}

export interface RoomMessagesResponse {
  chunk: MatrixEvent[];
  start: string;
  end: string;
}

