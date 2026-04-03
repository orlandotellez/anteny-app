import * as SecureStore from 'expo-secure-store';
import { IUserProfile } from '../types/user';

const PROFILE_KEY = "matrix_profile"

export const profileStorage = {
  // Guarda el perfil del usuario en SecureStore
  async setProfile(data: IUserProfile): Promise<void> {
    try {
      await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Error guardando perfil del storage:', error);
      throw error;
    }
  },

  // Recupera el perfil del usuario desde SecureStore
  async getProfile(): Promise<IUserProfile | null> {
    try {
      const profile = await SecureStore.getItemAsync(PROFILE_KEY)

      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error recuperando perfil del storage:', error);
      return null;
    }
  },

  // Limpia el perfil del storage
  async clearProfile(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(PROFILE_KEY);
    } catch (error) {
      console.error('Error borrando perfil del storage:', error);
      throw error;
    }
  },

};

