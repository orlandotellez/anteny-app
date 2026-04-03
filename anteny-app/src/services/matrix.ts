import { ENV } from "../shared/constants/env";
import { MatrixSession } from "../shared/types/matrix";
import { IUserProfile } from "../shared/types/user";

export const registerUser = async (username: string, password: string): Promise<MatrixSession> => {
  try {
    const resMatrix = await fetch(`${ENV.MATRIX_URL}/_matrix/client/v3/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        auth: {
          type: "m.login.dummy",
        },
      }),
    });

    const session = await resMatrix.json();

    return session
  } catch (err) {
    console.error("registerUser error:", err);
    throw err;
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const res = await fetch(`${ENV.MATRIX_URL}/_matrix/client/v3/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "m.login.password",
        identifier: {
          type: "m.id.user",
          user: username,
        },
        password,
      }),
    });

    const session = await res.json();

    if (!res.ok) {
      throw new Error(session.error || "Error al iniciar sesión");
    }

    return session;
  } catch (err) {
    console.error("loginUser error:", err);
    throw err;
  }
};

export const getProfile = async (userId: string, token: string) => {
  try {
    const res = await fetch(
      `${ENV.MATRIX_URL}/_matrix/client/v3/profile/${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    console.log(data)

    if (!res.ok) {
      throw new Error(data.error || "Error obteniendo perfil");
    }

    return {
      displayName: data.displayname || "",
      avatarUrl: data.avatar_url || "",
    };
  } catch (err) {
    console.error("getProfile error:", err);
    throw err;
  }
};

export const setDisplayName = async (
  userId: string,
  token: string,
  displayName: string
): Promise<IUserProfile> => {
  try {
    const res = await fetch(
      `${ENV.MATRIX_URL}/_matrix/client/v3/profile/${encodeURIComponent(userId)}/displayname`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayname: displayName,
        }),
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Error al guardar nombre");
    }
    const profile = await res.json();

    return profile
  } catch (err) {
    console.error("setDisplayName error:", err);
    throw err;
  }
};

export const uploadAvatar = async (
  file: Blob,
  token: string
): Promise<string> => {
  try {
    const res = await fetch(`${ENV.MATRIX_URL}/_matrix/media/v3/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "image/jpeg", // o png
      },
      body: file,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error subiendo imagen");
    }

    return data.content_uri;
  } catch (err) {
    console.error("uploadAvatar error:", err);
    throw err;
  }
};

export const setAvatar = async (
  userId: string,
  token: string,
  avatarUrl: string
) => {
  try {
    const res = await fetch(
      `${ENV.MATRIX_URL}/_matrix/client/v3/profile/${encodeURIComponent(userId)}/avatar_url`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          avatar_url: avatarUrl,
        }),
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Error seteando avatar");
    }
  } catch (err) {
    console.error("setAvatar error:", err);
    throw err;
  }
};

// Buscar usuarios en el directorio de Matrix
export const searchUsers = async (searchTerm: string, token: string) => {
  try {
    const res = await fetch(
      `${ENV.MATRIX_URL}/_matrix/client/v3/user_directory/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          search_term: searchTerm,
          limit: 20,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error buscando usuarios");
    }

    return data.results || [];
  } catch (err) {
    console.error("searchUsers error:", err);
    throw err;
  }
};

// Crear un DM (Direct Message) con otro usuario
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

// Obtener las salas unidas (joined rooms)
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

// Obtener detalles de una sala específica
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

// Obtener miembros de una sala
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

// Obtener el nombre de una sala
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
      return null; // La sala puede no tener nombre
    }

    return data.name || null;
  } catch (err) {
    console.error("getRoomName error:", err);
    return null;
  }
};

// Verificar si una sala es DM directo
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
      return false; // Asumir que no es directo si no se puede obtener
    }

    // Si el objeto tiene claves, es directo
    return Object.keys(data).length > 0;
  } catch (err) {
    console.error("isRoomDirect error:", err);
    return false;
  }
};

// Abandonar/eliminar una sala
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
