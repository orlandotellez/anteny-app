import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { THEME } from '@/src/shared/lib/theme';

type RootRoutes = "(tabs)";

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
];

export default function RootLayout() {
  return (
    <>
      <StatusBar backgroundColor={THEME.colors.background} translucent={false} />
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
            }}
          />
        ))}
      </Stack>
    </>
  );
}
