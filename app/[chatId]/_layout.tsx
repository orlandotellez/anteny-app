import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type ChatIdRoutes = "index"

interface StackConfig {
  name: ChatIdRoutes;
  headerShown: boolean;
  title?: string;
  presentation?: 'modal' | 'card' | 'fullScreenModal';
}

const CHAT_ID_STACK: StackConfig[] = [
  {
    name: "index",
    headerShown: false
  }
];

export default function ChatIdLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {CHAT_ID_STACK.map((route) => (
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
  );
}
