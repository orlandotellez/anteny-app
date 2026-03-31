import { Tabs } from "expo-router";
import { MessageCircle, Book, Contact } from "lucide-react-native";
import { THEME } from "@/src/shared/lib/theme";

type TabRoutes = "chats/index" | "contacts/index";

interface TabConfig {
  name: TabRoutes;
  title: string;
  icon: typeof Book;
}

const TABS: TabConfig[] = [
  { name: "chats/index", title: "Chats", icon: MessageCircle },
  { name: "contacts/index", title: "Contacts", icon: Contact },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: THEME.colors.background, borderTopColor: THEME.colors.background },
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
              <tab.icon color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
