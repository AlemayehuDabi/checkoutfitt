import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { Camera as CameraIcon, RefreshCw, X } from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { ScreenContainer } from "@/components/ui/screen-container";
import { useCloset } from "@/context/closet-context";

import { color } from "@/design";

export default function CaptureScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { setPendingImages } = useCloset();

  if (!permission) {
    return (
      <ScreenContainer>
        <View className="flex-1" />
      </ScreenContainer>
    );
  }

  if (!permission.granted) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center px-4">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-50">
            <CameraIcon size={28} color={color.primary} />
          </View>
          <Text className="mt-6 text-center text-2xl font-bold text-ink">
            Camera access needed
          </Text>
          <Text className="mt-2 text-center text-base leading-6 text-muted">
            Allow camera access to photograph an item for your digital closet.
          </Text>
        </View>
        <View className="gap-3 pb-4">
          <Button label="Allow Camera Access" onPress={requestPermission} />
          <Button label="Cancel" variant="ghost" onPress={() => router.back()} />
        </View>
      </ScreenContainer>
    );
  }

  const handleCapture = async () => {
    if (capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) {
        setPendingImages([photo.uri]);
        router.push("/closet/processing");
      }
    } finally {
      setCapturing(false);
    }
  };

  return (
    <View className="flex-1 bg-ink">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />
      <SafeAreaView edges={["top", "bottom"]} className="absolute inset-0">
        <View className="flex-1 justify-between">
          <View className="flex-row items-center justify-between px-6 pt-4">
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              className="h-10 w-10 items-center justify-center rounded-full bg-black/40 active:opacity-70"
            >
              <X size={20} color={color.white} />
            </Pressable>
            <Pressable
              onPress={() => setFacing((prev) => (prev === "back" ? "front" : "back"))}
              hitSlop={8}
              className="h-10 w-10 items-center justify-center rounded-full bg-black/40 active:opacity-70"
            >
              <RefreshCw size={18} color={color.white} />
            </Pressable>
          </View>

          <View className="items-center pb-10">
            <Text className="mb-6 text-sm font-medium text-white/80">
              Center the item in frame
            </Text>
            <Pressable
              onPress={handleCapture}
              disabled={capturing}
              className={`h-20 w-20 items-center justify-center rounded-full border-4 border-white/70 active:opacity-80 ${
                capturing ? "opacity-50" : ""
              }`}
            >
              <View className="h-16 w-16 rounded-full bg-surface" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
