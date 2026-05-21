// Tipos de eventos de Matrix
export type MATRIX_EVENT_TYPE =
  | "m.room.message"
  | "m.room.redaction"
  | "m.room.member"
  | "m.room.name"
  | "m.room.avatar"
  | "m.room.topic"
  | "m.room.canonical_alias"
  | "m.room.encryption"
  | "m.room.guest_access"
  | "m.room.history_visibility"
  | "m.room.join_rules"
  | "m.room.power_levels"
  | "m.room.server_acl"
  | "m.call.invite"
  | "m.call.answer"
  | "m.call.hangup"
  | "m.call.reject"
  | "m.presence"
  | "m.typing";

export type MEMBERSHIP_TYPE = "join" | "leave" | "invite" | "ban";

// Content para eventos de miembro
export interface MemberEventContent {
  membership: MEMBERSHIP_TYPE;
  displayname?: string;
  avatar_url?: string;
  reason?: string;
  third_party_invite?: {
    signed: {
      mxid: string;
      token: string;
    };
  };
}

// Content para eventos de nombre de sala
export interface RoomNameEventContent {
  name: string;
}

// Content para eventos de mensaje redaccionado
export interface RedactionEventContent {
  reason?: string;
}

// Base para cualquier evento de Matrix
export interface MatrixEvent {
  type: MATRIX_EVENT_TYPE | string;
  sender: string;
  content: Record<string, unknown>;
  event_id: string;
  roomId?: string;
  origin_server_ts?: number;
  unsigned?: Record<string, unknown>;
  age?: number;
  ["m.relates_to"]?: {
    rel_type?: string;
    event_id?: string;
  };
  redacts?: string;
  // Para eventos de room.member
  state_key?: string;
}

// Helper para obtener el content tipado según el tipo de evento
export type EventContent<T extends string> = T extends "m.room.message"
  ? import("./matrixMessage").MatrixMessageContent
  : T extends "m.room.member"
  ? MemberEventContent
  : T extends "m.room.name"
  ? RoomNameEventContent
  : T extends "m.room.redaction"
  ? RedactionEventContent
  : Record<string, unknown>;


