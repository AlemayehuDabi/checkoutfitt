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
      <View className="flex-1 items-center justify-center">
        <View className="flex-row">
          <View className="-mr-3 h-20 w-20 items-center justify-center rounded-full border-4 border-canvas bg-primary-100">
            <Camera size={28} color={color.primary500} />
          </View>
          <View className="h-20 w-20 items-center justify-center rounded-full border-4 border-canvas bg-primary-500">
            <Images size={28} color={color.textOnPrimary} />
          </View>
        </View>

        <Text className="mt-3xl text-center text-h1 font-bold text-text-primary">
          Build your digital closet
        </Text>
        <Text className="mt-md text-center text-body text-text-muted">
          CheckoutFitt needs access to your camera and photo library to snap and import the
          clothes you own, so your AI stylist can start putting outfits together.
        </Text>
      </View>

      <View className="gap-md pb-lg">
        <Button label="Allow Access" onPress={handleAllowAccess} loading={requesting} />
        <Button label="Not Now" variant="ghost" onPress={handleNotNow} />
      </View>
    </ScreenContainer>
  );
}
