import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Images } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { ScreenContainer } from "@/components/ui/screen-container";
import { usePendingImages } from "@/context/closet-context";

import { color } from "@/design";
import { IconWell } from "@/components/ui/icon-well";

export default function UploadScreen() {
  const { setPendingImages } = usePendingImages();
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
      <View className="flex-1 items-center justify-center">
        <IconWell size="2xl" round>
          <Images size={30} color={color.primary500} />
        </IconWell>
        <Text className="mt-2xl text-center text-h1 font-bold text-text-primary">
          Import multiple items
        </Text>
        <Text className="mt-sm text-center text-body text-text-muted">
          Select up to 10 photos from your library and we&apos;ll process them one by one.
        </Text>
      </View>
      <Button
        label="Select Photos"
        onPress={handlePick}
        loading={picking}
        className="mb-lg"
      />
    </ScreenContainer>
  );
}
