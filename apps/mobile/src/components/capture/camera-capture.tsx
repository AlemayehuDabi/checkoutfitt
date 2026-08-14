import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { Camera as CameraIcon, Check, RefreshCw, X } from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { ScreenContainer } from "@/components/ui/screen-container";
import { color } from "@/design";

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
          <View className="h-16 w-16 items-center justify-center rounded-3xl bg-primary-50">
            <CameraIcon size={26} color={color.primary} strokeWidth={1.5} />
          </View>
          <Text className="mt-5 text-center text-h2 font-bold text-ink">{permissionTitle}</Text>
          <Text className="mt-2 text-center text-body leading-6 text-muted">{permissionBody}</Text>

          {tips?.length ? (
            <View className="mt-7 w-full gap-2.5 rounded-2xl border border-line bg-surface p-4">
              {tips.map((tip) => (
                <View key={tip} className="flex-row items-start gap-2.5">
                  <Check size={15} color={color.primary} strokeWidth={2.5} />
                  <Text className="flex-1 text-body-sm text-ink-soft">{tip}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
        <View className="gap-2.5 pb-4">
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
    <View className="flex-1 bg-ink">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />

      <SafeAreaView edges={["top", "bottom"]} className="absolute inset-0">
        <View className="flex-1 justify-between">
          <View className="flex-row items-center justify-between px-gutter pt-4">
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              accessibilityLabel="Close camera"
              className="h-10 w-10 items-center justify-center rounded-full bg-black/40 active:opacity-70"
            >
              <X size={20} color={color.white} />
            </Pressable>
            <Pressable
              onPress={() => setFacing((prev) => (prev === "back" ? "front" : "back"))}
              hitSlop={8}
              accessibilityLabel="Flip camera"
              className="h-10 w-10 items-center justify-center rounded-full bg-black/40 active:opacity-70"
            >
              <RefreshCw size={18} color={color.white} />
            </Pressable>
          </View>

          {guide !== "none" ? (
            <View className="flex-1 items-center justify-center px-gutter" pointerEvents="none">
              <View
                className={
                  guide === "face"
                    ? "h-64 w-52 rounded-full border-2 border-white/50"
                    : "h-3/4 w-full max-w-xs rounded-3xl border-2 border-white/40"
                }
              />
            </View>
          ) : null}

          <View className="items-center pb-10">
            <Text className="mb-6 text-body-sm font-medium text-white/80">{hint}</Text>
            <Pressable
              onPress={handleCapture}
              disabled={capturing}
              accessibilityLabel="Take photo"
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
