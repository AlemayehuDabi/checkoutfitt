import { router } from "expo-router";
import { Check, RefreshCw, Sparkles, X } from "lucide-react-native";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { InsightCallout } from "@/components/ui/insight-callout";
import { Meter } from "@/components/ui/meter";
import { PageHeading } from "@/components/ui/page-heading";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { COACH_TIPS, CURRENT_ARCHETYPE, TIP_CATEGORY_LABEL } from "@/constants/mock-style";
import { color } from "@/design";

export default function StyleCoachScreen() {
  const profile = CURRENT_ARCHETYPE;
  const featured = COACH_TIPS.find((tip) => tip.featured);
  const rest = COACH_TIPS.filter((tip) => !tip.featured);

  return (
    <ScreenContainer scroll>
      <Header
        title="Style Coach"
        right={
          <Button
            label="Re-run"
            variant="ghost"
            size="sm"
            icon={<RefreshCw size={14} color={color.ink} />}
            onPress={() => router.push("/coach/analyze")}
          />
        }
      />

      <PageHeading
        eyebrow="Your style profile"
        title={profile.name}
        subtitle={profile.tagline}
        size="display"
        className="mt-2"
      />

      {/* Editorial hero: the summary set as a pull-quote on inverse stock. */}
      <Card tone="inverse" hero raise="lg" className="mt-6 p-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-micro font-bold uppercase text-primary-300">The read</Text>
          <View className="rounded-full bg-white/15 px-3 py-1.5">
            <Text className="text-micro font-bold uppercase text-canvas">
              {profile.confidence}% match
            </Text>
          </View>
        </View>
        <Text className="mt-4 text-body-lg leading-7 text-canvas">{profile.summary}</Text>
      </Card>

      <SectionHeader title="Signature palette" index="01" className="mt-9" />
      <View className="flex-row gap-2.5">
        {profile.signatureColors.map((swatch) => (
          <View key={swatch.hex} className="flex-1 items-center">
            <View
              className="aspect-square w-full rounded-2xl border border-line"
              style={{ backgroundColor: swatch.hex }}
            />
            <Text className="mt-2 text-micro font-medium uppercase text-muted" numberOfLines={1}>
              {swatch.name}
            </Text>
          </View>
        ))}
      </View>

      <SectionHeader title="How you dress" index="02" className="mt-9" />
      <Card className="gap-5 p-5">
        {profile.traits.map((trait) => (
          <Meter key={trait.label} label={trait.label} value={trait.value} valueLabel={`${trait.value}`} />
        ))}
      </Card>

      <SectionHeader title="Wears well · Steer clear" index="03" className="mt-9" />
      <View className="flex-row gap-3">
        <Card className="flex-1 p-4">
          <View className="flex-row items-center gap-1.5">
            <Check size={14} color={color.success} strokeWidth={2.5} />
            <Text className="text-micro font-semibold uppercase text-success">Wears well</Text>
          </View>
          <View className="mt-3 gap-2">
            {profile.wearsWell.map((entry) => (
              <Text key={entry} className="text-body-sm leading-5 text-ink-soft">
                {entry}
              </Text>
            ))}
          </View>
        </Card>
        <Card className="flex-1 p-4">
          <View className="flex-row items-center gap-1.5">
            <X size={14} color={color.danger} strokeWidth={2.5} />
            <Text className="text-micro font-semibold uppercase text-danger">Steer clear</Text>
          </View>
          <View className="mt-3 gap-2">
            {profile.avoid.map((entry) => (
              <Text key={entry} className="text-body-sm leading-5 text-ink-soft">
                {entry}
              </Text>
            ))}
          </View>
        </Card>
      </View>

      <SectionHeader
        title="This week's coaching"
        index="04"
        subtitle="Small, specific changes based on what you actually wore."
        className="mt-9"
      />

      {featured ? (
        <InsightCallout
          title={TIP_CATEGORY_LABEL[featured.category]}
          body={`${featured.title} — ${featured.body}`}
          icon={Sparkles}
        />
      ) : null}

      <View className="mt-3 gap-2.5">
        {rest.map((tip) => (
          <Card key={tip.id} className="p-4">
            <Text className="text-micro font-semibold uppercase text-primary">
              {TIP_CATEGORY_LABEL[tip.category]}
            </Text>
            <Text className="mt-1.5 text-body font-semibold text-ink">{tip.title}</Text>
            <Text className="mt-1.5 text-body-sm leading-5 text-muted">{tip.body}</Text>
          </Card>
        ))}
      </View>

      <Button
        label="Rate an outfit against this profile"
        variant="outline"
        onPress={() => router.push("/rating/capture")}
        className="mb-2 mt-8"
      />
    </ScreenContainer>
  );
}
