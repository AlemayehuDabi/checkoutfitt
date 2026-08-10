import { router } from "expo-router";
import {
  Briefcase,
  Dumbbell,
  Gem,
  Martini,
  PartyPopper,
  Plane,
  Presentation,
} from "lucide-react-native";
import { Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { ScreenContainer } from "@/components/ui/screen-container";
import { OCCASIONS } from "@/constants/mock-outfits";

const OCCASION_ICONS: Record<string, typeof Briefcase> = {
  briefcase: Briefcase,
  gem: Gem,
  presentation: Presentation,
  "party-popper": PartyPopper,
  plane: Plane,
  dumbbell: Dumbbell,
  martini: Martini,
};

export default function OccasionsScreen() {
  return (
    <ScreenContainer scroll>
      <Header title="Occasions" />
      <Text className="mt-1 text-base text-muted">
        Pick what you&apos;re dressing for and we&apos;ll style a look for it.
      </Text>

      <View className="mt-6 flex-row flex-wrap gap-3 pb-8">
        {OCCASIONS.map((occasion) => {
          const Icon = OCCASION_ICONS[occasion.icon] ?? Briefcase;
          return (
            <Card
              key={occasion.key}
              onPress={() => router.push(`/generate/result?context=${encodeURIComponent(occasion.key)}`)}
              className="w-[48%] gap-3 p-4"
            >
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-clay-50">
                <Icon size={20} color="#C1622D" />
              </View>
              <View>
                <Text className="text-base font-semibold text-ink">{occasion.label}</Text>
                <Text className="mt-0.5 text-xs text-muted">{occasion.description}</Text>
              </View>
            </Card>
          );
        })}
      </View>
    </ScreenContainer>
  );
}
