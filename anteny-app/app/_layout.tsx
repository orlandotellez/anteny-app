import { Stack, useSegments } from 'expo-router';
import { StatusBar, View, Platform } from 'react-native';
import { THEME } from '@/src/shared/lib/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/src/features/auth/context/AuthContext';
import { ProfileProvider } from '@/src/features/profile/context/ProfileContext';
import { ChatProvider } from '@/src/features/chats/context/ChatContext';
import { AuthGuard } from '@/src/guards/AuthGuard';
import { Sidebar } from '@/src/shared/components/navigation/Sidebar';
import { useResponsive } from '@/src/shared/hooks/useResponsive';

// Eliminar outline/focus ring de todos los inputs en web
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    input, textarea, select, [contenteditable] {
      outline: none !important;
      box-shadow: none !important;
    }
    input:focus, textarea:focus, select:focus, [contenteditable]:focus {
      outline: none !important;
      box-shadow: none !important;
    }
  `;
  document.head.appendChild(style);
}

type RootRoutes = "(tabs)" | "[chatId]" | "(auth)" | "contacts/profile/index";

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
  {
    name: "contacts/profile/index",
    headerShown: false
  },
];

function RootContent({ children }: { children: React.ReactNode }) {
  const { isWide } = useResponsive();
  const segments = useSegments();
  const segs = segments as readonly string[];

  // Ocultar sidebar en pantallas de auth
  const isAuthRoute = segs[0] === '(auth)';
  const showSidebar = isWide && !isAuthRoute;

  return (
    <View style={{
      flex: 1,
      flexDirection: showSidebar ? 'row' : 'column',
      backgroundColor: THEME.colors.background,
    }}>
      {showSidebar && <Sidebar />}
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <>
      <SafeAreaProvider>
        <AuthProvider>
          <AuthGuard>
            <ProfileProvider>
              <ChatProvider>
                <RootContent>
                  <View style={{ flex: 1, backgroundColor: THEME.colors.secondary }}>
                    <StatusBar backgroundColor={THEME.colors.secondary} translucent={false} />
                    <Stack
                      screenOptions={{
                        headerShown: false,
                        contentStyle: {
                          backgroundColor: THEME.colors.secondary,
                        },
                        animation: "none",
                      }}
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
                </RootContent>
              </ChatProvider>
            </ProfileProvider>
          </AuthGuard>
        </AuthProvider>
      </SafeAreaProvider>
    </>
  );
}
