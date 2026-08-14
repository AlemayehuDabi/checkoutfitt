import { router, type Href } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { PageHeading } from "@/components/ui/page-heading";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { STUDIO_GROUPS, STUDIO_TOOLS } from "@/constants/studio-tools";
import { color } from "@/design";

export default function StudioScreen() {
  return (
    <ScreenContainer scroll>
      <Header title="The Studio" />

      <PageHeading
        eyebrow="Styling tools"
        title="The Studio"
        subtitle="Everything that reads your closet, plans ahead, or sharpens a look."
        size="display"
      />

      {STUDIO_GROUPS.map((group) => {
        const tools = STUDIO_TOOLS.filter((tool) => tool.group === group.key);
        if (!tools.length) return null;

        return (
          <View key={group.key}>
            <SectionHeader title={group.title} index={group.index} className="mt-9" />
            <View className="gap-2.5">
              {tools.map((tool) => (
                <Card
                  key={tool.key}
                  onPress={() => router.push(tool.href as Href)}
                  className="flex-row items-center gap-3.5 p-4"
                >
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary-50">
                    <tool.icon size={20} color={color.primary} strokeWidth={1.75} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-body font-semibold text-ink">{tool.name}</Text>
                    <Text className="mt-0.5 text-caption leading-4 text-muted">
                      {tool.description}
                    </Text>
                  </View>
                  <ChevronRight size={18} color={color.faint} />
                </Card>
              ))}
            </View>
          </View>
        );
      })}
    </ScreenContainer>
  );
}
