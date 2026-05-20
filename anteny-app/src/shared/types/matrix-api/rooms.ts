// Tipos para respuestas de la API de Rooms

import { MatrixEvent } from "../matrixEvent";

export interface CreateRoomResponse {
  room_id: string;
}

export interface GetJoinedRoomsResponse {
  joined_rooms: string[];
}

export interface GetRoomStateResponse {
  // El endpoint /state retorna un array de eventos de estado
  events: MatrixEvent[];
}

export interface GetRoomMembersResponse {
  chunk: MatrixEvent[];
  members?: string[];
}

export interface GetRoomNameResponse {
  name?: string;
}

export interface RoomDirectResponse {
  // El endpoint /direct retorna un objeto con room_id -> [user_ids]
  [roomId: string]: string[];
}

export interface JoinRoomResponse {
  room_id: string;
}

export interface LeaveRoomResponse {
  // La API de leave no retorna contenido en caso de éxito
}

// Tipos auxiliares para parsing de invite_state

export interface InviteStateEvent {
  type: string;
  sender: string;
  content: Record<string, unknown>;
  state_key?: string;
}

export interface InviteStateRoomData {
  invite_state?: {
    events: InviteStateEvent[];
  };
}

// Tipos de dominio (resultados procesados)

export interface ParsedInviteState {
  roomId: string;
  inviterUserId: string;
  inviterName: string | null;
}
