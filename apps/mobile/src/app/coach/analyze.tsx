import { router } from "expo-router";
import { Sparkles } from "lucide-react-native";

import { AnalysisScreen } from "@/components/ui/analysis-screen";
import { COACH_ANALYSIS_STEPS } from "@/constants/mock-style";
import { useCloset } from "@/context/closet-context";

export default function CoachAnalyzeScreen() {
  const { items } = useCloset();
  const active = items.filter((item) => !item.archived).length;

  return (
    <AnalysisScreen
      steps={COACH_ANALYSIS_STEPS}
      caption={`Reading ${active} ${active === 1 ? "piece" : "pieces"} in your closet`}
      icon={Sparkles}
      onDone={() => router.replace("/coach")}
    />
  );
}
