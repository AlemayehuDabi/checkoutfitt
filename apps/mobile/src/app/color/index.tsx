import { router } from "expo-router";
import { Camera, Check, Palette } from "lucide-react-native";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { PageHeading } from "@/components/ui/page-heading";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { COLOR_CAPTURE_TIPS } from "@/constants/mock-color-analysis";
import { color } from "@/design";
import { IconWell } from "@/components/ui/icon-well";

export default function ColorAnalysisIntroScreen() {
  return (
    <ScreenContainer scroll>
      <Header title="Colour Analysis" />

      <PageHeading
        eyebrow="Find your palette"
        title="Which colours are actually yours"
        subtitle="One photo in daylight is enough to place your undertone, contrast and seasonal palette."
      />

      <Card tone="sunken" className="mt-2xl items-center p-2xl">
        <IconWell size="xl" tone="primary" round>
          <Palette size={28} color={color.primary500} strokeWidth={1.5} />
        </IconWell>
        <Text className="mt-lg text-center text-body text-text-secondary">
          Most people wear at least a third of their closet in colours that quietly work against
          them.
        </Text>
      </Card>

      <SectionHeader title="Before you shoot" index="01" className="mt-3xl" />
      <Card className="gap-md p-xl">
        {COLOR_CAPTURE_TIPS.map((tip) => (
          <View key={tip} className="flex-row items-start gap-sm">
            <Check size={15} color={color.primary500} strokeWidth={2.5} />
            <Text className="flex-1 text-body-sm text-text-secondary">{tip}</Text>
          </View>
        ))}
      </Card>

      <Button
        label="Take Your Photo"
        icon={<Camera size={17} color={color.white} />}
        onPress={() => router.push("/color/capture")}
        className="mt-3xl"
      />
      <Button
        label="See a Sample Result"
        variant="ghost"
        onPress={() => router.push("/color/result")}
        className="mb-sm mt-sm"
      />
    </ScreenContainer>
  );
}
