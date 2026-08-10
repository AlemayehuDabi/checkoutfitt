import { router } from "expo-router";
import { Camera, Images, X } from "lucide-react-native";
import { type ReactNode } from "react";
import { Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { ScreenContainer } from "@/components/ui/screen-container";

export default function AddItemScreen() {
  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <View className="flex-row items-center justify-between pt-6">
        <View />
        <IconButton onPress={() => router.back()}>
          <X size={22} color="#1A1917" />
        </IconButton>
      </View>

      <View className="flex-1 justify-center gap-4 pb-16">
        <Text className="text-3xl font-bold tracking-tight text-ink">Add an item</Text>
        <Text className="mb-4 text-base text-muted">
          Snap a photo or import from your library — your AI stylist will handle the rest.
        </Text>

        <AddOption
          icon={<Camera size={24} color="#C1622D" />}
          title="Take a Photo"
          description="Capture a single item with your camera"
          onPress={() => router.push("/closet/capture")}
        />
        <AddOption
          icon={<Images size={24} color="#C1622D" />}
          title="Choose from Library"
          description="Import one or more photos at once"
          onPress={() => router.push("/closet/upload")}
        />
      </View>
    </ScreenContainer>
  );
}

function AddOption({
  icon,
  title,
  description,
  onPress,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Card onPress={onPress} className="p-5">
      <View className="flex-row items-center gap-4">
        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-clay-50">{icon}</View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-ink">{title}</Text>
          <Text className="mt-0.5 text-sm text-muted">{description}</Text>
        </View>
      </View>
    </Card>
  );
}
