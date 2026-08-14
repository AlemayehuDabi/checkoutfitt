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

      <View className="mt-7 items-center">
        <ScoreDial
          score={WARDROBE_HEALTH}
          label="Health"
          caption="Your closet covers most everyday needs but thins out for formal and transitional weather."
        />
      </View>

      <View className="mt-7 flex-row gap-3">
        <StatTile label="Pieces owned" value={`${owned}`} className="flex-1" />
        <StatTile
          label="Outfits unlocked"
          value={`+${totalUnlocks}`}
          hint="If you close every gap"
          tone="primary"
          className="flex-1"
        />
      </View>

      <SectionHeader title="Coverage by category" index="01" className="mt-9" />
      <Card className="gap-5 p-5">
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
        className="mt-9"
      />

      <View className="gap-2.5">
        {WARDROBE_GAPS.map((gap) => {
          const tag = priorityTag(gap.priority);
          const categoryLabel =
            CLOSET_CATEGORIES.find((entry) => entry.key === gap.category)?.label ?? gap.category;

          return (
            <Card key={gap.id} className="p-4">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-micro font-semibold uppercase text-muted">
                    {categoryLabel}
                  </Text>
                  <Text className="mt-1 text-body-lg font-semibold text-ink">{gap.item}</Text>
                </View>
                <Tag label={tag.label} tone={tag.tone} />
              </View>

              <Text className="mt-2.5 text-body-sm leading-5 text-muted">{gap.reason}</Text>

              <View className="mt-4 flex-row items-center justify-between border-t border-line pt-3.5">
                <View>
                  <Text className="text-micro font-semibold uppercase text-muted">Unlocks</Text>
                  <Text className="mt-0.5 text-body font-bold text-primary">
                    +{gap.unlocks} outfits
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-micro font-semibold uppercase text-muted">Typical price</Text>
                  <Text className="mt-0.5 text-body font-semibold text-ink">{gap.priceRange}</Text>
                </View>
              </View>
            </Card>
          );
        })}
      </View>

      <Card
        tone="primary"
        onPress={() => router.push("/shopping")}
        className="mt-8 flex-row items-center gap-3 p-4"
      >
        <ShoppingBag size={18} color={color.primary} />
        <View className="flex-1">
          <Text className="text-body font-semibold text-primary-700">
            Considering something specific?
          </Text>
          <Text className="mt-0.5 text-caption text-primary-600">
            Run it through the Shopping Assistant first
          </Text>
        </View>
        <ArrowUpRight size={18} color={color.primary} />
      </Card>

      <Button
        label="Add to Closet"
        variant="outline"
        icon={<Plus size={17} color={color.ink} />}
        onPress={() => router.push("/closet/add")}
        className="mb-2 mt-4"
      />
    </ScreenContainer>
  );
}
