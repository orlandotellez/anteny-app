import { secureStorage } from './storage-adapter';
import { IUserProfile } from '../shared/types/user';

const PROFILE_KEY = "matrix_profile"

export const profileStorage = {
  // Guarda el perfil del usuario en secureStorage
  async setProfile(data: IUserProfile): Promise<void> {
    try {
      await secureStorage.setItemAsync(PROFILE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Error guardando perfil del storage:', error);
      throw error;
    }
  },

  // Recupera el perfil del usuario desde secureStorage
  async getProfile(): Promise<IUserProfile | null> {
    try {
      const profile = await secureStorage.getItemAsync(PROFILE_KEY)

      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error recuperando perfil del storage:', error);
      return null;
    }
  },

  // Limpia el perfil del storage
  async clearProfile(): Promise<void> {
    try {
      await secureStorage.deleteItemAsync(PROFILE_KEY);
    } catch (error) {
      console.error('Error borrando perfil del storage:', error);
      throw error;
    }
  },

};

