import { router } from "expo-router";
import { ArrowUpRight, Plus, ShoppingBag } from "lucide-react-native";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Meter } from "@/components/ui/meter";
import { PageHeading } from "@/components/ui/page-heading";
import { ScoreDial } from "@/components/ui/score-dial";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { StatTile } from "@/components/ui/stat-tile";
import { Tag } from "@/components/ui/tag";
import { CLOSET_CATEGORIES } from "@/constants/mock-closet";
import { GAP_COVERAGE, WARDROBE_GAPS, WARDROBE_HEALTH } from "@/constants/mock-gaps";
import { useCloset } from "@/context/closet-context";
import { color } from "@/design";

/** Priority bands drive both the tag copy and its colour. */
function priorityTag(priority: number) {
  if (priority >= 85) return { label: "Critical", tone: "danger" as const };
  if (priority >= 65) return { label: "High", tone: "warning" as const };
  if (priority >= 45) return { label: "Medium", tone: "primary" as const };
  return { label: "Low", tone: "default" as const };
}

export default function WardrobeGapsScreen() {
  const { items } = useCloset();
  const owned = items.filter((item) => !item.archived).length;
  const totalUnlocks = WARDROBE_GAPS.reduce((sum, gap) => sum + gap.unlocks, 0);

  return (
    <ScreenContainer scroll>
      <Header title="Wardrobe Gaps" />

      <PageHeading
        eyebrow="Closet analysis"
        title="What's missing"
        subtitle="Five pieces stand between your closet and a full rotation."
      />

      <View className="mt-2xl items-center">
        <ScoreDial
          score={WARDROBE_HEALTH}
          label="Health"
          caption="Your closet covers most everyday needs but thins out for formal and transitional weather."
        />
      </View>

      <View className="mt-2xl flex-row gap-md">
        <StatTile label="Pieces owned" value={`${owned}`} className="flex-1" />
        <StatTile
          label="Outfits unlocked"
          value={`+${totalUnlocks}`}
          hint="If you close every gap"
          tone="primary"
          className="flex-1"
        />
      </View>

      <SectionHeader title="Coverage by category" index="01" className="mt-3xl" />
      <Card className="gap-xl p-xl">
        {GAP_COVERAGE.map((entry) => (
          <Meter
            key={entry.label}
            label={entry.label}
            value={entry.score}
            valueLabel={`${entry.score}%`}
          />
        ))}
      </Card>

      <SectionHeader
        title="Fill these first"
        index="02"
        subtitle="Ordered by how much each piece would open up."
        className="mt-3xl"
      />

      <View className="gap-sm">
        {WARDROBE_GAPS.map((gap) => {
          const tag = priorityTag(gap.priority);
          const categoryLabel =
            CLOSET_CATEGORIES.find((entry) => entry.key === gap.category)?.label ?? gap.category;

          return (
            <Card key={gap.id} className="p-lg">
              <View className="flex-row items-start justify-between gap-md">
                <View className="flex-1">
                  <Text className="text-eyebrow font-semibold uppercase text-text-muted">
                    {categoryLabel}
                  </Text>
                  <Text className="mt-1 text-body-lg font-semibold text-text-primary">{gap.item}</Text>
                </View>
                <Tag label={tag.label} tone={tag.tone} />
              </View>

              <Text className="mt-sm text-body-sm text-text-muted">{gap.reason}</Text>

              <View className="mt-lg flex-row items-center justify-between border-t border-border pt-md">
                <View>
                  <Text className="text-eyebrow font-semibold uppercase text-text-muted">Unlocks</Text>
                  <Text className="mt-0.5 text-body font-bold text-primary-500">
                    +{gap.unlocks} outfits
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-eyebrow font-semibold uppercase text-text-muted">Typical price</Text>
                  <Text className="mt-0.5 text-body font-semibold text-text-primary">{gap.priceRange}</Text>
                </View>
              </View>
            </Card>
          );
        })}
      </View>

      <Card
        tone="primary"
        onPress={() => router.push("/shopping")}
        className="mt-3xl flex-row items-center gap-md p-lg"
      >
        <ShoppingBag size={18} color={color.primary500} />
        <View className="flex-1">
          <Text className="text-body font-semibold text-primary-700">
            Considering something specific?
          </Text>
          <Text className="mt-0.5 text-caption text-primary-600">
            Run it through the Shopping Assistant first
          </Text>
        </View>
        <ArrowUpRight size={18} color={color.primary500} />
      </Card>

      <Button
        label="Add to Closet"
        variant="outline"
        icon={<Plus size={17} color={color.textPrimary} />}
        onPress={() => router.push("/closet/add")}
        className="mb-sm mt-lg"
      />
    </ScreenContainer>
  );
}
