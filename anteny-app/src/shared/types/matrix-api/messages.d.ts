import { MatrixEvent } from "../matrixEvent";
import { MSG_TYPE } from "../matrixMessage";

interface ReplyTo {
  eventId: string;
  body: string;
  sender: string;
}

// Payloads
export interface ILastRoomMessagePayload {
  roomId: string
  token: string
}

export interface ISendRoomMessagePayload {
  roomId: string
  token: string
  body: string
  msgtype: MSG_TYPE
  replyTo?: ReplyTo | null
}

export interface IEditMessagePayload {
  roomId: string
  eventId: string
  token: string
  newBody: string
  msgtype: MSG_TYPE
}

export interface IRedactMessagePayload {
  roomId: string
  eventId: string
  token: string
  reason?: string
}

export interface IGetRoomMessagePayload {
  roomId: string
  token: string
  direction: "b" | "f"
  from?: string
  limit: number
}

export interface MatrixMessagesApiResponse {
  chunk: MatrixEvent[];
  start: string;
  end: string;
}

export interface MatrixSendMessageApiResponse {
  event_id: string;
}

export interface LastRoomMessage {
  body: string;
  timestamp: number;
}

export interface RoomMessagesResult {
  messages: MatrixEvent[];
  endCursor: string | null;
  hasMore: boolean;
}


