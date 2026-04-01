import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { THEME } from "@/src/shared/lib/theme";

type TabRoutes = "chats/index" | "contacts/index" | "profile/index";

interface TabConfig {
  name: TabRoutes;
  title: string;
  icon: any;
}

const TABS: TabConfig[] = [
  { name: "chats/index", title: "Chats", icon: "chatbubble-outline" },
  { name: "contacts/index", title: "Contacts", icon: "people-outline" },
  { name: "profile/index", title: "profile", icon: "man-outline" },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: THEME.colors.secondary, borderTopColor: THEME.colors.secondary },
        tabBarActiveTintColor: THEME.colors.text_title,
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
