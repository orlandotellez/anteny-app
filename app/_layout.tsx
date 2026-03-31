import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { THEME } from '@/src/shared/lib/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type RootRoutes = "(tabs)" | "[chatId]";

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

];

export default function RootLayout() {
  return (
    <>
      <SafeAreaProvider>
        <StatusBar backgroundColor={THEME.colors.secondary} translucent={false} />
        <Stack
        >
          {ROOT_STACK.map((route) => (
            <Stack.Screen
              key={route.name}
              name={route.name}
              options={{
                headerShown: route.headerShown,
                title: route.title,
                presentation: route.presentation,
                contentStyle: {
                  backgroundColor: THEME.colors.secondary
                }
              }}
            />
          ))}
        </Stack>
      </SafeAreaProvider>
    </>
  );
}
