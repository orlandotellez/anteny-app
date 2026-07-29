import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const secureStorage = {
  async getItemAsync(key: string): Promise<string | null> {
    if (isWeb) {
      return localStorage.getItem(key);
    }

    // Lazy import para no romper el tree-shaking en web
    const SecureStore = await import('expo-secure-store');
    return SecureStore.getItemAsync(key);
  },

  async setItemAsync(key: string, value: string): Promise<void> {
    if (isWeb) {
      localStorage.setItem(key, value);
      return;
    }

    const SecureStore = await import('expo-secure-store');
    return SecureStore.setItemAsync(key, value);
  },

  async deleteItemAsync(key: string): Promise<void> {
    if (isWeb) {
      localStorage.removeItem(key);
      return;
    }

    const SecureStore = await import('expo-secure-store');
    return SecureStore.deleteItemAsync(key);
  },
};
