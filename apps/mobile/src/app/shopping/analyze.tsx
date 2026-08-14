import { router, useLocalSearchParams } from "expo-router";
import { ShoppingBag } from "lucide-react-native";

import { AnalysisScreen } from "@/components/ui/analysis-screen";
import { SHOPPING_ANALYSIS_STEPS } from "@/constants/mock-shopping";

export default function ShoppingAnalyzeScreen() {
  const { price, uri } = useLocalSearchParams<{ price?: string; uri?: string }>();

  return (
    <AnalysisScreen
      steps={SHOPPING_ANALYSIS_STEPS}
      caption="Checking it against your closet"
      icon={ShoppingBag}
      imageUri={uri || undefined}
      onDone={() =>
        router.replace({
          pathname: "/shopping/result",
          params: { price: price ?? "128", uri: uri ?? "" },
        })
      }
    />
  );
}
