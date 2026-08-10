import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ClosetProvider } from "@/context/closet-context";
import { OutfitsProvider } from "@/context/outfits-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ClosetProvider>
        <OutfitsProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
        </OutfitsProvider>
      </ClosetProvider>
    </SafeAreaProvider>
  );
}
