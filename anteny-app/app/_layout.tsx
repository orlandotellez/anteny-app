import { Stack } from 'expo-router';
import { StatusBar, View } from 'react-native';
import { THEME } from '@/src/shared/lib/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/src/features/auth/context/AuthContext';
import { ProfileProvider } from '@/src/features/profile/context/ProfileContext';
import { ChatProvider } from '@/src/features/chats/context/ChatContext';
import { AuthGuard } from '@/src/guards/AuthGuard';

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

export default function RootLayout() {
  return (
    <>
      <SafeAreaProvider>
        <AuthProvider>
          <AuthGuard>
            <ProfileProvider>
              <ChatProvider>
                <View style={{ flex: 1, backgroundColor: THEME.colors.secondary }}>
                  <StatusBar backgroundColor={THEME.colors.secondary} translucent={false} />
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      contentStyle: {
                        backgroundColor: THEME.colors.secondary,
                      },
                      animation: "none",
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
              </ChatProvider>
            </ProfileProvider>
          </AuthGuard>
        </AuthProvider>
      </SafeAreaProvider>
    </>
  );
}
