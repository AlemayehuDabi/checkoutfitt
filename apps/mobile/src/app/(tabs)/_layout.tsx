import { Tabs } from "expo-router";
import { CircleUser, House, MessageCircle, Shirt, Sparkles } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { color, typography } from "@/design";

/** Bar height above the system inset. */
const TAB_BAR_HEIGHT = 60;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.ink,
        tabBarInactiveTintColor: color.muted,
        tabBarStyle: {
          backgroundColor: color.canvas,
          borderTopColor: color.line,
          // Setting an explicit height opts out of React Navigation's built-in
          // safe-area handling, so the inset has to be added back manually —
          // otherwise the Android gesture/navigation bar sits over the tabs.
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 10,
        },
        tabBarLabelStyle: {
          fontSize: typography.micro.size,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: "Home", tabBarIcon: ({ color, size }) => <House size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="closet"
        options={{ title: "Closet", tabBarIcon: ({ color, size }) => <Shirt size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="generate"
        options={{ title: "Generate", tabBarIcon: ({ color, size }) => <Sparkles size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="chat"
        options={{ title: "Chat", tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: ({ color, size }) => <CircleUser size={size} color={color} /> }}
      />
    </Tabs>
  );
}
