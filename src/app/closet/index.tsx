import { router } from "expo-router";
import { LayoutGrid, LayoutList, Plus, Shirt } from "lucide-react-native";
import { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";

import { ItemCard } from "@/components/closet/item-card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { IconButton } from "@/components/ui/icon-button";
import { ScreenContainer } from "@/components/ui/screen-container";
import { CLOSET_CATEGORIES } from "@/constants/mock-closet";
import { useCloset } from "@/context/closet-context";
import type { ClosetCategory } from "@/types";

type FilterKey = ClosetCategory | "all";

export default function ClosetScreen() {
  const { items, toggleFavorite } = useCloset();
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<FilterKey>("all");

  const activeItems = useMemo(() => items.filter((item) => !item.archived), [items]);

  const filteredItems = useMemo(() => {
    if (filter === "all") return activeItems;
    return activeItems.filter((item) => item.category === filter);
  }, [activeItems, filter]);

  if (activeItems.length === 0) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center px-4">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-sand-100">
            <Shirt size={36} color="#8A8580" strokeWidth={1.5} />
          </View>
          <Text className="mt-6 text-center text-2xl font-bold tracking-tight text-ink">
            Your closet is empty
          </Text>
          <Text className="mt-2 text-center text-base leading-6 text-muted">
            Add your first item and let your AI stylist start building looks from your own
            wardrobe.
          </Text>
          <Button
            label="Add Your First Item"
            onPress={() => router.push("/closet/add")}
            className="mt-8 w-full"
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between pb-2 pt-6">
        <View>
          <Text className="text-2xl font-bold tracking-tight text-ink">Your Closet</Text>
          <Text className="text-sm text-muted">
            {activeItems.length} item{activeItems.length === 1 ? "" : "s"}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <IconButton onPress={() => setLayout(layout === "grid" ? "list" : "grid")}>
            {layout === "grid" ? (
              <LayoutList size={20} color="#1A1917" />
            ) : (
              <LayoutGrid size={20} color="#1A1917" />
            )}
          </IconButton>
          <IconButton variant="solid" onPress={() => router.push("/closet/add")} className="bg-ink">
            <Plus size={20} color="#FAF8F5" />
          </IconButton>
        </View>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[{ key: "all", label: "All" }, ...CLOSET_CATEGORIES.map((c) => ({ key: c.key, label: c.label }))]}
        keyExtractor={(item) => item.key}
        contentContainerClassName="gap-2 py-3"
        renderItem={({ item }) => (
          <Chip label={item.label} selected={filter === item.key} onPress={() => setFilter(item.key as FilterKey)} />
        )}
      />

      {filteredItems.length === 0 ? (
        <View className="flex-1 items-center justify-center pb-24">
          <Text className="text-base text-muted">No items match this filter.</Text>
        </View>
      ) : (
        <FlatList
          key={layout}
          data={filteredItems}
          keyExtractor={(item) => item.id}
          numColumns={layout === "grid" ? 2 : 1}
          columnWrapperClassName={layout === "grid" ? "gap-3" : undefined}
          contentContainerClassName="gap-3 pb-8"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              layout={layout}
              onPress={() => router.push(`/closet/${item.id}`)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          )}
        />
      )}
    </ScreenContainer>
  );
}
