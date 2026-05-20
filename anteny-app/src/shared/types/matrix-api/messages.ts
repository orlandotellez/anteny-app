import { MatrixEvent } from "../matrixEvent";

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


