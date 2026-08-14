import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Images } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { ScreenContainer } from "@/components/ui/screen-container";
import { useCloset } from "@/context/closet-context";

import { color } from "@/design";

export default function UploadScreen() {
  const { setPendingImages } = useCloset();
  const [picking, setPicking] = useState(false);

  const handlePick = async () => {
    setPicking(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: 10,
        quality: 0.7,
      });

      if (!result.canceled && result.assets.length > 0) {
        setPendingImages(result.assets.map((asset) => asset.uri));
        router.push("/closet/processing");
      }
    } finally {
      setPicking(false);
    }
  };

  return (
    <ScreenContainer>
      <Header title="Bulk Upload" />
      <View className="flex-1 items-center justify-center px-2">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-50">
          <Images size={28} color={color.primary} />
        </View>
        <Text className="mt-6 text-center text-2xl font-bold text-ink">
          Import multiple items
        </Text>
        <Text className="mt-2 text-center text-base leading-6 text-muted">
          Select up to 10 photos from your library and we&apos;ll process them one by one.
        </Text>
      </View>
      <Button
        label="Select Photos"
        onPress={handlePick}
        loading={picking}
        className="mb-4"
      />
    </ScreenContainer>
  );
}
