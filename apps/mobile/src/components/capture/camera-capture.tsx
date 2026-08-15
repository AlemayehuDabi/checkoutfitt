import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { Camera as CameraIcon, Check, RefreshCw, X } from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { ScreenContainer } from "@/components/ui/screen-container";
import { color, elevation } from "@/design";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";

type CameraCaptureProps = {
  /** Instruction shown above the shutter. */
  hint: string;
  /** Framing guide: a tall rounded rect for outfits, an oval for faces. */
  guide?: "full-body" | "face" | "none";
  defaultFacing?: "front" | "back";
  /** Copy for the permission-denied state. */
  permissionTitle: string;
  permissionBody: string;
  tips?: string[];
  onCapture: (uri: string) => void;
};

/**
 * Shared camera surface. Generalised from the Digital Closet capture screen so
 * Outfit Rating (mirror selfie) and Colour Analysis (face photo) reuse the same
 * permission handling, shutter and framing chrome.
 */
export function CameraCapture({
  hint,
  guide = "none",
  defaultFacing = "back",
  permissionTitle,
  permissionBody,
  tips,
  onCapture,
}: CameraCaptureProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">(defaultFacing);
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

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
            <CameraIcon size={30} color={color.primary500} strokeWidth={1.5} />
          </IconWell>
          <Text className="mt-xl text-center text-h1 font-bold text-text-primary">{permissionTitle}</Text>
          <Text className="mt-sm text-center text-body text-text-muted">{permissionBody}</Text>

          {tips?.length ? (
            <View className="mt-3xl w-full gap-md rounded-xl border border-border bg-surface p-lg">
              {tips.map((tip) => (
                <View key={tip} className="flex-row items-start gap-sm">
                  <Check size={15} color={color.primary500} strokeWidth={2.5} />
                  <Text className="flex-1 text-body text-text-secondary">{tip}</Text>
                </View>
              ))}
            </View>
          ) : null}
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
      if (photo?.uri) onCapture(photo.uri);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <View className="flex-1 bg-surface-inverse">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />
      {/* Spec §Overlay: the feed sits under a scrim so the white chrome and
          framing guide stay legible over any scene. */}
      <View className="absolute inset-0 bg-overlay" pointerEvents="none" />

      <SafeAreaView edges={["top", "bottom"]} className="absolute inset-0">
        <View className="flex-1 justify-between">
          <View className="flex-row items-center justify-between px-gutter pt-lg">
            <PressableScale
              onPress={() => router.back()}
              hitSlop={8}
              accessibilityLabel="Close camera"
              className="h-10 w-10 items-center justify-center rounded-full bg-overlay"
            >
              <X size={20} color={color.white} />
            </PressableScale>
            <View className="h-10 w-10" />
          </View>

          {guide !== "none" ? (
            <View className="flex-1 items-center justify-center px-gutter" pointerEvents="none">
              <View
                className={
                  guide === "face"
                    ? "h-64 w-52 rounded-full border-2 border-white/50"
                    : "h-3/4 w-full max-w-xs rounded-xl border-2 border-white/40"
                }
              />
            </View>
          ) : null}

          <View className="items-center pb-4xl">
            <Text className="mb-2xl text-body font-medium text-white/85">{hint}</Text>
            <View className="w-full flex-row items-center justify-evenly">
              <View className="h-11 w-11" />
              <PressableScale
              onPress={handleCapture}
              disabled={capturing}
              accessibilityLabel="Take photo"
              pressScale={0.92}
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
