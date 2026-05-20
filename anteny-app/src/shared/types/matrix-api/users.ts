// Tipos para respuestas de la API de Users

export interface UserDirectorySearchResponse {
  results: UserDirectoryResult[];
  limited?: boolean;
}

export interface UserDirectoryResult {
  user_id: string;
  display_name?: string;
  avatar_url?: string;
}

// Alias para compatibilidad
export type UserSearchResult = UserDirectoryResult;
