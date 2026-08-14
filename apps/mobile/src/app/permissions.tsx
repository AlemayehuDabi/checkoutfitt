import { useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useMediaLibraryPermissions } from "expo-image-picker";
import { Camera, Images } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { ScreenContainer } from "@/components/ui/screen-container";

import { color } from "@/design";

export default function PermissionsScreen() {
  const [, requestCameraPermission] = useCameraPermissions();
  const [, requestMediaLibraryPermission] = useMediaLibraryPermissions();
  const [requesting, setRequesting] = useState(false);

  const handleAllowAccess = async () => {
    setRequesting(true);
    try {
      await requestCameraPermission();
      await requestMediaLibraryPermission();
    } finally {
      setRequesting(false);
      router.push("/style-quiz");
    }
  };

  const handleNotNow = () => {
    router.push("/style-quiz");
  };

  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center px-4">
        <View className="flex-row">
          <View className="h-20 w-20 -mr-3 items-center justify-center rounded-full border-4 border-canvas bg-primary-50">
            <Camera size={28} color={color.primary} />
          </View>
          <View className="h-20 w-20 items-center justify-center rounded-full border-4 border-canvas bg-ink">
            <Images size={28} color={color.canvas} />
          </View>
        </View>

        <Text className="mt-8 text-center text-2xl font-bold text-ink">
          Build your digital closet
        </Text>
        <Text className="mt-3 text-center text-base leading-6 text-muted">
          CheckoutFitt needs access to your camera and photo library to snap and import the
          clothes you own, so your AI stylist can start putting outfits together.
        </Text>
      </View>

      <View className="gap-3 pb-4">
        <Button label="Allow Access" onPress={handleAllowAccess} loading={requesting} />
        <Button label="Not Now" variant="ghost" onPress={handleNotNow} />
      </View>
    </ScreenContainer>
  );
}
