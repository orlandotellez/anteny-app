import { ENV } from "@/src/shared/constants/env";
import { IUserProfile } from "@/src/shared/types/user";

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
    console.log(data);

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

    return profile;
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
