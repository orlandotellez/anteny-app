// Tipos para respuestas de la API de Sync

import { MatrixEvent } from "../matrixEvent";

// Respuestas de API
export interface SyncApiResponse {
  next_batch: string;
  rooms?: {
    join?: Record<string, RoomJoinData>;
    invite?: Record<string, RoomInviteData>;
    leave?: Record<string, RoomLeaveData>;
  };
  presence?: Record<string, PresenceData>;
  account_data?: Record<string, unknown>;
  to_device?: Record<string, unknown>;
  device_list?: unknown;
  groups?: Record<string, unknown>;
}

export interface RoomJoinData {
  timeline?: {
    limited?: boolean;
    events: MatrixEvent[];
  };
  state?: {
    events: MatrixEvent[];
  };
  ephemeral?: {
    events: MatrixEvent[];
  };
  unread_notification_count?: number;
  unread_thread_count?: number;
  summary?: {
    "m.joined_members_count"?: number;
    "m.invited_members_count"?: number;
  };
}

export interface RoomInviteData {
  invite_state?: {
    events: MatrixEvent[];
  };
}

export interface RoomLeaveData {
  timeline?: {
    events: MatrixEvent[];
  };
  state?: {
    events: MatrixEvent[];
  };
}

export interface PresenceData {
  user_id: string;
  presence: "online" | "offline" | "unavailable";
  status_msg?: string;
  last_active_ago?: number;
}

// Tipos de dominio (resultados procesados)
export interface ProcessedSyncData {
  newMessages: Map<string, MatrixEvent[]>;
  newInvites: string[];
  joinedRooms: string[];
  leftRooms: string[];
  redactions: Map<string, string[]>;
  editedMessages: Map<string, MatrixEvent[]>;
}

// Opciones
export interface SyncOptions {
  token: string;
  since?: string;
  timeout?: number;
  filter?: object;
  setPresence?: "online" | "offline" | "unavailable";
}
