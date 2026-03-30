import { Tabs } from "expo-router";
import { Book } from "lucide-react-native";

type TabRoutes = "index" | "chats/index";

interface TabConfig {
  name: TabRoutes;
  title: string;
  icon: typeof Book;
}

const TABS: TabConfig[] = [
  { name: "index", title: "Home", icon: Book },
  { name: "chats/index", title: "Chats", icon: Book },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: { backgroundColor: '#000' },
        tabBarActiveTintColor: '#fff',
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <tab.icon color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
