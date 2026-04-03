import { Stack, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { THEME } from '@/src/shared/lib/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/src/features/auth/context/AuthContext';
import { useEffect, useState, ReactNode } from 'react';
import { ProfileProvider } from '@/src/features/profile/context/ProfileContext';

type RootRoutes = "(tabs)" | "[chatId]" | "(auth)";

interface StackConfig {
  name: RootRoutes;
  headerShown: boolean;
  title?: string;
  presentation?: 'modal' | 'card' | 'fullScreenModal';
}

const ROOT_STACK: StackConfig[] = [
  {
    name: "(tabs)",
    headerShown: false
  },
  {
    name: "[chatId]",
    headerShown: false
  },
  {
    name: "(auth)",
    headerShown: false
  },
];

function AuthGuard({ children }: { children: ReactNode }) {
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

export default function RootLayout() {
  return (
    <>
      <SafeAreaProvider>
        <AuthProvider>
          <AuthGuard>
            <ProfileProvider>
              <View style={{ flex: 1, backgroundColor: THEME.colors.secondary }}>
                <StatusBar backgroundColor={THEME.colors.secondary} translucent={false} />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: {
                      backgroundColor: THEME.colors.secondary,
                    },
                    animation: "slide_from_right",
                  }
                  }
                >
                  {ROOT_STACK.map((route) => (
                    <Stack.Screen
                      key={route.name}
                      name={route.name}
                      options={{
                        headerShown: route.headerShown,
                        title: route.title,
                        presentation: route.presentation,
                      }}
                    />
                  ))}
                </Stack>
              </View>
            </ProfileProvider>
          </AuthGuard>
        </AuthProvider>
      </SafeAreaProvider>
    </>
  );
}
