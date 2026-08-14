import { router, useLocalSearchParams } from "expo-router";
import { Palette } from "lucide-react-native";

import { AnalysisScreen } from "@/components/ui/analysis-screen";
import { COLOR_ANALYSIS_STEPS } from "@/constants/mock-color-analysis";

export default function ColorAnalyzeScreen() {
  const { uri } = useLocalSearchParams<{ uri?: string }>();

  return (
    <AnalysisScreen
      steps={COLOR_ANALYSIS_STEPS}
      caption="Placing you on a seasonal palette"
      icon={Palette}
      imageUri={uri}
      onDone={() => router.replace({ pathname: "/color/result", params: { uri: uri ?? "" } })}
    />
  );
}
