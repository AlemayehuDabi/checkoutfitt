import { router } from "expo-router";
import { Camera, Images, X } from "lucide-react-native";
import { type ReactNode } from "react";
import { Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { ScreenContainer } from "@/components/ui/screen-container";

import { color } from "@/design";

export default function AddItemScreen() {
  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <View className="h-14 flex-row items-center justify-between">
        <View />
        <IconButton accessibilityLabel="Close" onPress={() => router.back()}>
          <X size={24} color={color.textPrimary} />
        </IconButton>
      </View>

      <View className="flex-1 justify-center gap-lg pb-16">
        <Text className="text-h1 font-bold text-text-primary">Add an item</Text>
        <Text className="mb-lg text-body text-text-muted">
          Snap a photo or import from your library — your AI stylist will handle the rest.
        </Text>

        <AddOption
          icon={<Camera size={24} color={color.primary500} />}
          title="Take a Photo"
          description="Capture a single item with your camera"
          onPress={() => router.push("/closet/capture")}
        />
        <AddOption
          icon={<Images size={24} color={color.primary500} />}
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
    <Card onPress={onPress} className="p-lg">
      <View className="flex-row items-center gap-lg">
        <View className="h-14 w-14 items-center justify-center rounded-lg bg-primary-100">{icon}</View>
        <View className="flex-1">
          <Text className="text-h3 font-semibold text-text-primary">{title}</Text>
          <Text className="mt-0.5 text-caption text-text-muted">{description}</Text>
        </View>
      </View>
    </Card>
  );
}
