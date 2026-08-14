import { router } from "expo-router";

import { CameraCapture } from "@/components/capture/camera-capture";
import { RATING_CAPTURE_TIPS } from "@/constants/mock-rating";

export default function RatingCaptureScreen() {
  return (
    <CameraCapture
      guide="full-body"
      hint="Fit your whole outfit inside the frame"
      permissionTitle="Camera access needed"
      permissionBody="Allow camera access to shoot a mirror selfie and have your outfit rated."
      tips={RATING_CAPTURE_TIPS}
      onCapture={(uri) =>
        router.replace({ pathname: "/rating/analyze", params: { uri } })
      }
    />
  );
}
