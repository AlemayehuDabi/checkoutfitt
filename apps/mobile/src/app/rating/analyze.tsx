import { router, useLocalSearchParams } from "expo-router";
import { ScanLine } from "lucide-react-native";

import { AnalysisScreen } from "@/components/ui/analysis-screen";
import { RATING_ANALYSIS_STEPS } from "@/constants/mock-rating";

export default function RatingAnalyzeScreen() {
  const { uri } = useLocalSearchParams<{ uri?: string }>();

  return (
    <AnalysisScreen
      steps={RATING_ANALYSIS_STEPS}
      caption="Scoring colour, fit and proportion"
      icon={ScanLine}
      imageUri={uri}
      onDone={() => router.replace({ pathname: "/rating/result", params: { uri: uri ?? "" } })}
    />
  );
}
