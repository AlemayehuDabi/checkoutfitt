import { Stack } from "expo-router";

export default function RecreateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="analyze" options={{ animation: "fade" }} />
      <Stack.Screen name="result" />
    </Stack>
  );
}
