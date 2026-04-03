import { authStorage } from '@/src/shared/storage/auth-storage';
import { MatrixSession } from '@/src/shared/types/matrix';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  session: MatrixSession | null;
  saveSecureStore: (session: MatrixSession) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState<MatrixSession | null>(null);

  // Verifica si hay una sesión guardada al iniciar la app
  const checkSession = async () => {
    setIsLoading(true);
    try {
      const storedSession = await authStorage.getSession();
      if (storedSession) {
        setSession(storedSession);
        setIsAuthenticated(true);
      } else {
        setSession(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setSession(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Guarda la sesión y actualiza el estado
  const saveSecureStore = async (newSession: MatrixSession) => {
    try {
      await authStorage.setSession(newSession);
      setSession(newSession);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  };

  // Limpia la sesión (logout)
  const logout = async () => {
    try {
      await authStorage.clearSession();
      setSession(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
  };

  // Verificar sesión al montar el provider
  useEffect(() => {
    checkSession();
  }, []);

  const value: AuthContextType = {
    isLoading,
    isAuthenticated,
    session,
    saveSecureStore,
    logout,
    checkSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
