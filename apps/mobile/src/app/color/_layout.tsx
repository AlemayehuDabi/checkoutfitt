import { Stack } from "expo-router";

export default function ColorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="capture" options={{ presentation: "fullScreenModal" }} />
      <Stack.Screen name="analyze" options={{ animation: "fade" }} />
      <Stack.Screen name="result" />
    </Stack>
  );
}
