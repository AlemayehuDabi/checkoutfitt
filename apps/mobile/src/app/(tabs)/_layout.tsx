import { Tabs } from "expo-router";
import { CircleUser, House, MessageCircle, Plus, Shirt } from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { color, elevation, typography } from "@/design";

/** Bar height above the system inset. */
const TAB_BAR_HEIGHT = 60;

/**
 * Spec §6.8: a white bar on a hairline top rule, active tabs in the brand
 * colour, and a visually distinct centre "Generate" action — a filled
 * terracotta disc with a white plus, sitting proud of the four outline tabs
 * around it.
 */
function GenerateTabIcon() {
  return (
    <View
      style={elevation.lg}
      className="h-11 w-11 items-center justify-center rounded-full bg-primary-500"
    >
      <Plus size={22} color={color.textOnPrimary} strokeWidth={2.5} />
    </View>
  );
}

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
        options={{ title: "Home", tabBarIcon: ({ color, size }) => <House size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="closet"
        options={{ title: "Closet", tabBarIcon: ({ color, size }) => <Shirt size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="generate"
        options={{
          title: "Generate",
          tabBarIcon: () => <GenerateTabIcon />,
          // The disc is taller than a glyph, so the label is pulled back under it.
          tabBarIconStyle: { marginTop: -6 },
          tabBarLabelStyle: {
            fontSize: typography.tag.size,
            fontWeight: "600",
            color: color.primary500,
          },
        }}
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
