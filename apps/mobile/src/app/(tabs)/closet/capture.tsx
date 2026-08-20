import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { Camera as CameraIcon, RefreshCw, X } from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { ScreenContainer } from "@/components/ui/screen-container";
import { usePendingImages } from "@/context/closet-context";

import { color, elevation } from "@/design";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";

export default function CaptureScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { setPendingImages } = usePendingImages();

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
        <View className="flex-1 items-center justify-center">
          <IconWell size="2xl" round>
            <CameraIcon size={30} color={color.primary500} />
          </IconWell>
          <Text className="mt-2xl text-center text-h1 font-bold text-text-primary">
            Camera access needed
          </Text>
          <Text className="mt-sm text-center text-body text-text-muted">
            Allow camera access to photograph an item for your digital closet.
          </Text>
        </View>
        <View className="gap-md pb-lg">
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
    <View className="flex-1 bg-surface-inverse">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />
      {/* Scrim over the feed so the white chrome stays legible on any scene. */}
      <View className="absolute inset-0 bg-overlay" pointerEvents="none" />
      <SafeAreaView edges={["top", "bottom"]} className="absolute inset-0">
        <View className="flex-1 justify-between">
          <View className="flex-row items-center justify-between px-gutter pt-lg">
            <PressableScale
              onPress={() => router.back()}
              hitSlop={8}
              className="h-10 w-10 items-center justify-center rounded-full bg-overlay"
            >
              <X size={20} color={color.white} />
            </PressableScale>
            <View className="h-10 w-10" />
          </View>

          <View className="items-center pb-4xl">
            <Text className="mb-2xl text-body font-medium text-white/85">
              Center the item in frame
            </Text>
            <View className="w-full flex-row items-center justify-evenly">
              <View className="h-11 w-11" />
              <PressableScale
              onPress={handleCapture}
              disabled={capturing}
              pressScale={0.92}
              accessibilityLabel="Take photo"
              // Spec screen 6: an 80px white ring around a 64px filled disc.
              style={elevation.xl}
              className={`h-20 w-20 items-center justify-center rounded-full border-4 border-white/70 ${
                capturing ? "opacity-50" : ""
              }`}
            >
                <View className="h-16 w-16 rounded-full bg-surface" />
              </PressableScale>
              <PressableScale
                onPress={() => setFacing((prev) => (prev === "back" ? "front" : "back"))}
                hitSlop={8}
                accessibilityLabel="Flip camera"
                className="h-11 w-11 items-center justify-center rounded-full bg-overlay"
              >
                <RefreshCw size={20} color={color.white} />
              </PressableScale>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
