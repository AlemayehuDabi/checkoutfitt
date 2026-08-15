import { Tabs } from "expo-router";
import { CirclePlus, CircleUser, House, MessageCircle, Shirt } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { color, elevation, typography } from "@/design";

/** Bar height above the system inset. */
const TAB_BAR_HEIGHT = 60;

/**
 * Spec §6.8: a white bar on a hairline top rule, with the active tab picked out
 * in the brand colour. The mockups draw the active glyph *filled* and the
 * inactive ones as outlines, which is what separates the current tab at a
 * glance — the centre Generate tab is a circled plus at the same weight as its
 * neighbours rather than a raised disc.
 */
export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.primary500,
        tabBarInactiveTintColor: color.textMuted,
        tabBarStyle: {
          backgroundColor: color.surface,
          borderTopColor: color.border,
          // Setting an explicit height opts out of React Navigation's built-in
          // safe-area handling, so the inset has to be added back manually —
          // otherwise the Android gesture/navigation bar sits over the tabs.
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 10,
          ...elevation.lg,
          // The bar's shadow has to fall upward, onto the content it covers.
          shadowOffset: { width: 0, height: -4 },
        },
        tabBarLabelStyle: {
          fontSize: typography.tag.size,
          fontWeight: "500",
          letterSpacing: typography.tag.tracking,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <House size={size} color={color} fill={focused ? color : "transparent"} />
          ),
        }}
      />
      <Tabs.Screen
        name="closet"
        options={{
          title: "Closet",
          tabBarIcon: ({ color, size, focused }) => (
            <Shirt size={size} color={color} fill={focused ? color : "transparent"} />
          ),
        }}
      />
      <Tabs.Screen
        name="generate"
        options={{
          title: "Generate",
          tabBarIcon: ({ color, size }) => <CirclePlus size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size, focused }) => (
            <MessageCircle size={size} color={color} fill={focused ? color : "transparent"} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <CircleUser size={size} color={color} fill={focused ? color : "transparent"} />
          ),
        }}
      />
    </Tabs>
  );
}
