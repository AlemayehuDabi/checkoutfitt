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

      <Card tone="inverse" hero raise="lg" className="mt-7 items-center p-7">
        <IconWell size="xl" tone="translucent"><Palette size={26} color={color.canvas} strokeWidth={1.5} /></IconWell>
        <Text className="mt-4 text-center text-body-lg leading-6 text-canvas">
          Most people wear at least a third of their closet in colours that quietly work against
          them.
        </Text>
      </Card>

      <SectionHeader title="Before you shoot" index="01" className="mt-9" />
      <Card className="gap-3 p-5">
        {COLOR_CAPTURE_TIPS.map((tip) => (
          <View key={tip} className="flex-row items-start gap-2.5">
            <Check size={15} color={color.primary} strokeWidth={2.5} />
            <Text className="flex-1 text-body-sm leading-5 text-ink-soft">{tip}</Text>
          </View>
        ))}
      </Card>

      <Button
        label="Take Your Photo"
        icon={<Camera size={17} color={color.white} />}
        onPress={() => router.push("/color/capture")}
        className="mt-8"
      />
      <Button
        label="See a Sample Result"
        variant="ghost"
        onPress={() => router.push("/color/result")}
        className="mb-2 mt-2"
      />
    </ScreenContainer>
  );
}
