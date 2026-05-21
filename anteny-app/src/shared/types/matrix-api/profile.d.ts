// Payloads
export interface IGetProfilePayload {
  userId: string
  token: string
}

export interface ISetDisplayNamePayload {
  userId: string
  token: string
  displayName: string
}

export interface IUploadAvatarPayload {
  file: Blob
  token: string
}

export interface ISetAvatar {
  userId: string
  token: string
  avatarUrl: string
}

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
