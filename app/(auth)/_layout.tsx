import { Stack } from "expo-router";

type AuthRoutes = "login/index" | "register/index";

interface AuthConfig {
  name: AuthRoutes;
  title?: string;
  presentation?: "modal" | "card" | "fullScreenModal";
}

const AUTH_ROUTES: AuthConfig[] = [
  { name: "login/index" },
  { name: "register/index" },
];

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >
      {AUTH_ROUTES.map((route) => (
        <Stack.Screen
          key={route.name}
          name={route.name}
          options={{
            title: route.title,
            presentation: route.presentation,
          }}
        />
      ))}
    </Stack>
  );
}
