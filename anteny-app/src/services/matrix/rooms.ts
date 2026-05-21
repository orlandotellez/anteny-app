import { ENV } from "@/src/shared/constants/env";
import { InvitedRoom } from "@/src/shared/types/matrixRoom";
import {
  CreateRoomResponse,
  GetJoinedRoomsResponse,
  GetRoomMembersResponse,
  GetRoomNameResponse,
  ICreateRoomPayload,
  IGetInvitedRoomPayload,
  IGetRoomPayload,
  InviteStateEvent,
  InviteStateRoomData,
  JoinRoomResponse,
} from "@/src/shared/types/matrix-api";

// Funciones del servicio
export const createDirectChat = async ({ userId, token }: ICreateRoomPayload): Promise<string> => {
  try {
    const res = await fetch(
      `${ENV.MATRIX_URL}/_matrix/client/v3/createRoom`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          invite: [userId],
          is_direct: true,
          preset: "trusted_private_chat",
        }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Error creando chat directo");
    }

    const data: CreateRoomResponse = await res.json();
    return data.room_id;
  } catch (err) {
    console.error("createDirectChat error:", err);
    throw err;
  }
};

export const getJoinedRooms = async (token: string): Promise<string[]> => {
  try {
    const res = await fetch(
      `${ENV.MATRIX_URL}/_matrix/client/v3/joined_rooms`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Error obteniendo salas");
    }

    const data: GetJoinedRoomsResponse = await res.json();
    return data.joined_rooms ?? [];
  } catch (err) {
    console.error("getJoinedRooms error:", err);
    throw err;
  }
};

// esta función devuelve todas las salas donde hay invitación pero el usuario no ha aceptado
export const getInvitedRooms = async ({ token, since }: IGetInvitedRoomPayload): Promise<InvitedRoom[]> => {
  try {
    const url = new URL(`${ENV.MATRIX_URL}/_matrix/client/v3/sync`);

    url.searchParams.set("timeout", "0");

    if (since) {
      url.searchParams.set("since", since);
    }

    url.searchParams.set("filter", JSON.stringify({
      rooms: {
        invite: true,
      },
    }));

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("getInvitedRooms error:", await res.json());
      return [];
    }

    const data = await res.json();
    const invitedRooms: InvitedRoom[] = [];

    if (data.rooms?.invite) {
      for (const [roomId, roomData] of Object.entries(data.rooms.invite)) {
        const inviteStateRoomData = roomData as InviteStateRoomData;
        const events = inviteStateRoomData.invite_state?.events ?? [];

        // Buscar evento de invitación
        const memberEvent = events.find(
          (e: InviteStateEvent) =>
            e.type === "m.room.member" && (e.content as { membership?: string })?.membership === "invite"
        ) as InviteStateEvent | undefined;

        const inviterUserId = memberEvent?.sender ?? null;

        // Buscar evento del invitador para obtener su displayname
        const inviterMemberEvent = events.find(
          (e: InviteStateEvent) =>
            e.type === "m.room.member" &&
            (e.content as { membership?: string })?.membership === "join" &&
            e.state_key === inviterUserId
        ) as InviteStateEvent | undefined;

        const inviterName =
          (inviterMemberEvent?.content as { displayname?: string })?.displayname ?? inviterUserId ?? null;

        invitedRooms.push({
          room_id: roomId,
          inviter_user_id: inviterUserId ?? undefined,
          inviter_name: inviterName ?? undefined,
        });
      }
    }

    return invitedRooms;
  } catch (err) {
    console.error("getInvitedRooms error:", err);
    return [];
  }
};

export const getRoomDetails = async ({ roomId, token }: IGetRoomPayload): Promise<unknown> => {
  try {
    const res = await fetch(
      `${ENV.MATRIX_URL}/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/state`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Error obteniendo detalles de la sala");
    }

    return await res.json();
  } catch (err) {
    console.error("getRoomDetails error:", err);
    throw err;
  }
};

export const getRoomMembers = async ({ roomId, token }: IGetRoomPayload) => {
  try {
    const res = await fetch(
      `${ENV.MATRIX_URL}/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/members`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Error obteniendo miembros");
    }

    const data: GetRoomMembersResponse = await res.json();
    return data.chunk ?? [];
  } catch (err) {
    console.error("getRoomMembers error:", err);
    throw err;
  }
};

export const getRoomName = async ({ roomId, token }: IGetRoomPayload): Promise<string | null> => {
  try {
    const res = await fetch(
      `${ENV.MATRIX_URL}/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/state/m.room.name`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      return null;
    }

    const data: GetRoomNameResponse = await res.json();
    return data.name ?? null;
  } catch (err) {
    console.error("getRoomName error:", err);
    return null;
  }
};

export const isRoomDirect = async ({ roomId, token }: IGetRoomPayload): Promise<boolean> => {
  try {
    const res = await fetch(
      `${ENV.MATRIX_URL}/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/state/m.room.direct`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      return false;
    }

    const data = await res.json();
    return Object.keys(data).length > 0;
  } catch (err) {
    console.error("isRoomDirect error:", err);
    return false;
  }
};

export const leaveRoom = async ({ roomId, token }: IGetRoomPayload): Promise<boolean> => {
  try {
    const res = await fetch(
      `${ENV.MATRIX_URL}/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/leave`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Error abandonando la sala");
    }

    return true;
  } catch (err) {
    console.error("leaveRoom error:", err);
    throw err;
  }
};

export const joinRoom = async ({ roomId, token }: IGetRoomPayload): Promise<string> => {
  try {
    const res = await fetch(
      `${ENV.MATRIX_URL}/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/join`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Error uniéndose a la sala");
    }

    const data: JoinRoomResponse = await res.json();
    return data.room_id;
  } catch (err) {
    console.error("joinRoom error:", err);
    throw err;
  }
};

export const rejectInvite = async ({ roomId, token }: IGetRoomPayload): Promise<boolean> => {
  try {
    console.log("[rejectInvite] Rejecting invite for room:", roomId);

    const res = await fetch(
      `${ENV.MATRIX_URL}/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/leave`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: "Rejected invitation",
        }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Error rechazando la invitación");
    }

    return true;
  } catch (err) {
    console.error("rejectInvite error:", err);
    throw err;
  }
};
