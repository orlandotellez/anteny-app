// Tipos para respuestas de la API de Profile

export interface ProfileResponse {
  displayname?: string;
  avatar_url?: string;
}

export interface ProfileUpdateResponse {
  // La API de update no retorna contenido en caso de éxito
}

export interface UploadAvatarResponse {
  content_uri: string;
}
