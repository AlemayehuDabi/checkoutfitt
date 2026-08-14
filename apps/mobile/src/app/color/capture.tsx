import { router } from "expo-router";

import { CameraCapture } from "@/components/capture/camera-capture";
import { COLOR_CAPTURE_TIPS } from "@/constants/mock-color-analysis";

export default function ColorCaptureScreen() {
  return (
    <CameraCapture
      guide="face"
      defaultFacing="front"
      hint="Line your face up inside the oval"
      permissionTitle="Camera access needed"
      permissionBody="Allow camera access to read your skin undertone and contrast from a photo."
      tips={COLOR_CAPTURE_TIPS}
      onCapture={(uri) => router.replace({ pathname: "/color/analyze", params: { uri } })}
    />
  );
}
