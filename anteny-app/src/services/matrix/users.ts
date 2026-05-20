import { ENV } from "@/src/shared/constants/env";

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
