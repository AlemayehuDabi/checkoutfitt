import { router } from "expo-router";
import { ChevronDown, Heart } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import type { Outfit } from "@/types";

type OutfitCardProps = {
  outfit: Outfit;
  saved: boolean;
  onToggleSave: () => void;
  variant?: "full" | "compact";
};

export function OutfitCard({ outfit, saved, onToggleSave, variant = "full" }: OutfitCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isCompact = variant === "compact";

  return (
    <Pressable
      onPress={() => router.push(`/generate/detail?id=${outfit.id}`)}
      className="rounded-3xl border border-line bg-white p-5 active:opacity-90"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Tag label={outfit.context} tone="clay" />
          <Text className="mt-2 text-xl font-bold tracking-tight text-ink">{outfit.title}</Text>
          <Text className="mt-0.5 text-sm text-muted">
            {outfit.items.length} piece{outfit.items.length === 1 ? "" : "s"}
          </Text>
        </View>
        <Pressable
          hitSlop={8}
          onPress={(event) => {
            event.stopPropagation();
            onToggleSave();
          }}
          className="active:opacity-60"
        >
          <Heart size={22} color={saved ? "#C1622D" : "#8A8580"} fill={saved ? "#C1622D" : "transparent"} />
        </Pressable>
      </View>

      <View className="mt-4 flex-row gap-2">
        {outfit.items.slice(0, isCompact ? 4 : outfit.items.length).map((item) => (
          <GarmentSwatch
            key={item.id}
            category={item.category}
            colorHex={item.colorHex}
            className="aspect-square flex-1 overflow-hidden rounded-xl"
            iconSize={18}
          />
        ))}
      </View>

      {isCompact ? null : (
        <>
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              setExpanded((prev) => !prev);
            }}
            className="mt-4 flex-row items-center justify-between active:opacity-70"
          >
            <Text className="text-sm font-semibold text-ink">Why this outfit</Text>
            <View style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}>
              <ChevronDown size={18} color="#1A1917" />
            </View>
          </Pressable>
          {expanded ? <Text className="mt-2 text-sm leading-5 text-muted">{outfit.reason}</Text> : null}

          <Button
            label="View Full Breakdown"
            variant="outline"
            onPress={() => router.push(`/generate/detail?id=${outfit.id}`)}
            className="mt-5"
          />
        </>
      )}
    </Pressable>
  );
}
