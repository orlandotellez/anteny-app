import { ENV } from "../../shared/constants/env";

export const createDirectChat = async (
  userId: string,
  token: string
): Promise<string> => {
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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error creando chat directo");
    }

    return data.room_id;
  } catch (err) {
    console.error("createDirectChat error:", err);
    throw err;
  }
};

export const getJoinedRooms = async (token: string) => {
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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error obteniendo salas");
    }

    return data.joined_rooms || [];
  } catch (err) {
    console.error("getJoinedRooms error:", err);
    throw err;
  }
};

export const getInvitedRoomIds = async (token: string, since?: string): Promise<string[]> => {
  try {
    const url = new URL(`${ENV.MATRIX_URL}/_matrix/client/v3/sync`);
    url.searchParams.set('timeout', '0');
    if (since) {
      url.searchParams.set('since', since);
    }
    url.searchParams.set('filter', JSON.stringify({
      rooms: {
        invite: true
      }
    }));

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("getInvitedRoomIds error:", data);
      return [];
    }

    // Extract room IDs from invite_state
    const invitedRooms: string[] = [];
    if (data.rooms?.invite) {
      for (const roomId of Object.keys(data.rooms.invite)) {
        invitedRooms.push(roomId);
      }
    }

    return invitedRooms;
  } catch (err) {
    console.error("getInvitedRoomIds error:", err);
    return [];
  }
};

export const getRoomDetails = async (roomId: string, token: string) => {
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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error obteniendo detalles de la sala");
    }

    return data;
  } catch (err) {
    console.error("getRoomDetails error:", err);
    throw err;
  }
};

export const getRoomMembers = async (roomId: string, token: string) => {
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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error obteniendo miembros");
    }

    return data.chunk || [];
  } catch (err) {
    console.error("getRoomMembers error:", err);
    throw err;
  }
};

export const getRoomName = async (roomId: string, token: string) => {
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

    const data = await res.json();

    if (!res.ok) {
      return null; // The room may not have a name
    }

    return data.name || null;
  } catch (err) {
    console.error("getRoomName error:", err);
    return null;
  }
};

export const isRoomDirect = async (roomId: string, token: string) => {
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

    const data = await res.json();

    if (!res.ok) {
      return false; // Assume not direct if cannot get
    }

    // If the object has keys, it's direct
    return Object.keys(data).length > 0;
  } catch (err) {
    console.error("isRoomDirect error:", err);
    return false;
  }
};

export const leaveRoom = async (roomId: string, token: string) => {
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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error abandonando la sala");
    }

    return true;
  } catch (err) {
    console.error("leaveRoom error:", err);
    throw err;
  }
};

export const joinRoom = async (roomId: string, token: string) => {
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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error uniéndose a la sala");
    }

    return data.room_id;
  } catch (err) {
    console.error("joinRoom error:", err);
    throw err;
  }
};
