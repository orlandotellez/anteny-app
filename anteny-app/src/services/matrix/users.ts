import { ENV } from "@/src/shared/constants/env";
import { UserDirectorySearchResponse, UserDirectoryResult } from "@/src/shared/types/matrix-api";

export const searchUsers = async (
  searchTerm: string,
  token: string,
  limit: number = 20
): Promise<UserDirectoryResult[]> => {
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
          limit,
        }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Error buscando usuarios");
    }

    const data: UserDirectorySearchResponse = await res.json();
    return data.results ?? [];
  } catch (err) {
    console.error("searchUsers error:", err);
    throw err;
  }
};
