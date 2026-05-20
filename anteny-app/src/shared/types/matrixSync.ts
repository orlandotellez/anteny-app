import { MatrixEvent } from "./matrixEvent";
import { InvitedRoomData, RoomData } from "./matrixRoom";

export interface SyncResponse {
  next_batch: string;
  rooms?: {
    join?: Record<string, RoomData>;
    invite?: Record<string, InvitedRoomData>;
    leave?: Record<string, RoomData>;
  };
  presence?: Record<string, unknown>;
  account_data?: Record<string, unknown>;
  to_device?: Record<string, unknown>;
  device_list?: Record<string, unknown>;
}

export interface ProcessSyncResponse {
  newMessages: Map<string, MatrixEvent[]>;
  newInvites: string[];
  joinedRooms: string[];
  leftRooms: string[];
  redactions: Map<string, string[]>;
  editedMessages: Map<string, MatrixEvent[]>;
}

export interface SyncOptions {
  token: string;
  since?: string;
  timeout?: number;
  filter?: object;
  setPresence?: string;
}

