import { Tabs } from "expo-router";
import { CircleUser, House, MessageCircle, Shirt, Sparkles } from "lucide-react-native";

import { color } from "@/design";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.ink,
        tabBarInactiveTintColor: color.muted,
        tabBarStyle: {
          backgroundColor: color.canvas,
          borderTopColor: color.line,
          height: 60,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
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
