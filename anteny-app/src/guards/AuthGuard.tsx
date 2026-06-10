import { useRouter, useSegments } from "expo-router";
import { useAuth } from "../features/auth/context/AuthContext";
import { ReactNode, useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // El primer segmento es el raíz (ej: "(auth)", "(tabs)", etc.)
    const currentRootSegment = segments?.[0];

    // Mientras carga, no hacemos nada
    if (isLoading) {
      setIsReady(false);
      return;
    }

    // Ya terminó de cargar, marcamos como listo
    setIsReady(true);

    const inAuthGroup = currentRootSegment === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, segments]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <StatusBar />
        <ActivityIndicator />
      </View>
    );
  }

  return <>{children}</>;
}
