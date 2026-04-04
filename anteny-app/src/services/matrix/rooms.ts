import { InvitedRoom } from "@/src/shared/types/room";
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


// esta función devuelve todas las salas donde hay invitación pero el usuario no ha aceptado
export const getInvitedRooms = async (token: string, since?: string): Promise<InvitedRoom[]> => {
  try {
    // Creamos la URL del endpoint /sync de Matrix
    const url = new URL(`${ENV.MATRIX_URL}/_matrix/client/v3/sync`);

    // timeout=0 → respuesta inmediata (sin long polling)
    url.searchParams.set('timeout', '0');

    // since → permite obtener solo cambios desde la última sync
    if (since) {
      url.searchParams.set('since', since);
    }

    // filter → pedimos SOLO las invitaciones (no toda la data de rooms)
    url.searchParams.set('filter', JSON.stringify({
      rooms: {
        invite: true
      }
    }));

    // Hacemos la petición a Matrix
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    // Si hay error, devolvemos array vacío
    if (!res.ok) {
      console.error("getInvitedRooms error:", data);
      return [];
    }

    // Aquí vamos a construir el resultado final
    const invitedRooms: InvitedRoom[] = [];

    // Verificamos si existen salas con invitaciones
    if (data.rooms?.invite) {

      // Recorremos cada sala donde estamos invitados
      for (const [roomId, roomData] of Object.entries(data.rooms.invite)) {

        // invite_state contiene eventos relacionados con la invitación
        const inviteState = (roomData as any).invite_state;
        const events = inviteState?.events || [];

        // Buscamos el evento de tipo "m.room.member" con membership "invite"
        // Este evento representa la invitación
        const memberEvent = events.find((e: any) =>
          e.type === 'm.room.member' && e.content?.membership === 'invite'
        );

        // El sender del evento es quien nos invitó
        const inviterUserId = memberEvent?.sender;

        // Ahora buscamos el evento donde ese usuario (el que invita) está unido a la sala
        // para poder obtener su displayname
        const inviterMemberEvent = events.find((e: any) =>
          e.type === 'm.room.member' &&
          e.content?.membership === 'join' &&
          e.state_key === inviterUserId
        );

        // Extraemos el nombre del invitador (si existe)
        const inviterName =
          inviterMemberEvent?.content?.displayname || inviterUserId || null;

        // Agregamos la sala al resultado final
        invitedRooms.push({
          room_id: roomId,
          inviter_user_id: inviterUserId,
          inviter_name: inviterName,
        });
      }
    }

    return invitedRooms;
  } catch (err) {
    console.error("getInvitedRooms error:", err);
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

export const rejectInvite = async (roomId: string, token: string) => {
  try {
    console.log('[rejectInvite] Rejecting invite for room:', roomId);

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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error rechazando la invitación");
    }

    return true;
  } catch (err) {
    console.error("rejectInvite error:", err);
    throw err;
  }
};
