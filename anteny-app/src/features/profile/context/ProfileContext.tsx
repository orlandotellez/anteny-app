import { IUserProfile } from '@/src/shared/types/user';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { profileStorage } from '@/src/storage/profile-storage';
import { authStorage } from '@/src/storage/auth-storage';
import { getProfile } from '@/src/services/matrix/profile';

interface ProfileContextType {
  profile: IUserProfile | null;
  isLoading: boolean;
  setProfileStorage: (profile: IUserProfile) => Promise<void>;
  loadProfile: () => Promise<void>;
  clearProfile: () => Promise<void>;
  fetchProfileFromMatrix: (userId: string, token: string) => Promise<void>;
  initializeProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar perfil al iniciar
  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const storedProfile = await profileStorage.getProfile();
      setProfile(storedProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeProfile();
  }, []);

  // Inicializar perfil: intenta desde storage, si no hay, desde Matrix
  const initializeProfile = async () => {
    setIsLoading(true);

    try {
      // Intentar desde storage local
      const storedProfile = await profileStorage.getProfile();

      if (storedProfile?.displayName) {
        setProfile(storedProfile);
        setIsLoading(false);
        return;
      }

      // Si no hay storage, obtener desde Matrix
      const session = await authStorage.getSession();

      if (session?.access_token && session?.user_id) {
        const matrixProfile = await getProfile(session.user_id, session.access_token);

        const profileData: IUserProfile = {
          id: session.user_id,
          displayName: matrixProfile.displayName || "",
          avatar: matrixProfile.avatarUrl,
          status: "",
        };

        await profileStorage.setProfile(profileData);
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error initializing profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setProfileStorage = async (newProfile: IUserProfile) => {
    try {
      await profileStorage.setProfile(newProfile);
      setProfile(newProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  };

  const clearProfile = async () => {
    try {
      await profileStorage.clearProfile()
      setProfile(null)
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
  };

  // Cargar perfil desde Matrix API y guardar en storage
  const fetchProfileFromMatrix = async (userId: string, token: string) => {
    try {
      const matrixProfile = await getProfile(userId, token);

      const profileData: IUserProfile = {
        id: userId,
        displayName: matrixProfile.displayName || "",
        avatar: matrixProfile.avatarUrl,
        status: "",
      };

      await profileStorage.setProfile(profileData);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile from Matrix:', error);
    }
  };

  const value: ProfileContextType = {
    profile,
    isLoading,
    setProfileStorage,
    loadProfile,
    clearProfile,
    fetchProfileFromMatrix,
    initializeProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
