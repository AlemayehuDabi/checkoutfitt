import { Stack } from "expo-router";

export default function ClosetLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add" options={{ presentation: "modal" }} />
      <Stack.Screen name="capture" />
      <Stack.Screen name="upload" />
      <Stack.Screen name="processing" />
      <Stack.Screen name="confirm" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="edit/[id]" />
    </Stack>
  );
}
