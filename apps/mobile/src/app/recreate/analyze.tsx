import { router, useLocalSearchParams } from "expo-router";
import { Images } from "lucide-react-native";

import { AnalysisScreen } from "@/components/ui/analysis-screen";
import { RECREATION_ANALYSIS_STEPS } from "@/constants/mock-recreation";

export default function RecreateAnalyzeScreen() {
  const { uri, source } = useLocalSearchParams<{ uri?: string; source?: string }>();

  return (
    <AnalysisScreen
      steps={RECREATION_ANALYSIS_STEPS}
      caption="Matching each piece against your closet"
      icon={Images}
      imageUri={uri || undefined}
      onDone={() =>
        router.replace({
          pathname: "/recreate/result",
          params: { uri: uri ?? "", source: source ?? "Pinterest" },
        })
      }
    />
  );
}
