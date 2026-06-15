import { Stack } from "expo-router";

type ChatIdRoutes = "index" | "profile/index"

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
  },
  {
    name: "profile/index",
    headerShown: false
  }

];

export default function ChatIdLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none"
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
