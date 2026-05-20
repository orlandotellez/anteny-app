import { ENV } from "@/src/shared/constants/env";
import { ProfileResponse, UploadAvatarResponse } from "@/src/shared/types/matrix-api";

// ============================================
// Tipos de dominio
// ============================================

export interface UserProfileData {
  displayName: string;
  avatarUrl: string;
}

// ============================================
// Funciones del servicio
// ============================================

export const getProfile = async (userId: string, token: string): Promise<UserProfileData> => {
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

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Error obteniendo perfil");
    }

    const data: ProfileResponse = await res.json();

    return {
      displayName: data.displayname ?? "",
      avatarUrl: data.avatar_url ?? "",
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
): Promise<void> => {
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
      const error = await res.json();
      throw new Error(error.error || "Error al guardar nombre");
    }
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
        "Content-Type": "image/jpeg",
      },
      body: file,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Error subiendo imagen");
    }

    const data: UploadAvatarResponse = await res.json();
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
): Promise<void> => {
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
      const error = await res.json();
      throw new Error(error.error || "Error seteando avatar");
    }
  } catch (err) {
    console.error("setAvatar error:", err);
    throw err;
  }
};
