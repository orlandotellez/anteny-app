import * as SecureStore from 'expo-secure-store';
import { MatrixSession } from '../types/matrix';

const SESSION_KEY = "matrix_session"

export const authStorage = {
  // Guarda la sesión completa de Matrix en SecureStore
  async setSession(session: MatrixSession): Promise<void> {
    try {
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session))
    } catch (error) {
      console.error('Error guardando sesión:', error);
      throw error;
    }
  },

  // Recupera la sesión completa de Matrix desde SecureStore
  async getSession(): Promise<MatrixSession | null> {
    try {
      const session = await SecureStore.getItemAsync(SESSION_KEY)

      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Error recuperando sesión:', error);
      return null;
    }
  },

  // Obtiene solo el access_token
  async getAccessToken(): Promise<string | null> {
    try {
      const session = await authStorage.getSession()

      return session?.access_token ?? null
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  },

  // Verifica si hay una sesión activa
  async hasSession(): Promise<boolean> {
    const session = await authStorage.getSession();
    return !!session?.access_token;
  },

  // Limpia toda la sesión (logout)
  async clearSession(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(SESSION_KEY);
    } catch (error) {
      console.error('Error borrando sesión:', error);
      throw error;
    }
  },
};


