import { router } from "expo-router";
import {
  ChevronRight,
  Filter,
  LayoutGrid,
  LayoutList,
  Plus,
  Shirt,
  SquareStack,
  Wallet,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";

import { ItemCard } from "@/components/closet/item-card";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { IconButton } from "@/components/ui/icon-button";
import { ScreenContainer } from "@/components/ui/screen-container";
import { StateView } from "@/components/ui/state-view";
import { CLOSET_CATEGORIES } from "@/constants/mock-closet";
import { useCloset } from "@/context/closet-context";
import type { ClosetCategory } from "@/types";

import { color } from "@/design";
import { IconWell } from "@/components/ui/icon-well";

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
        <StateView
          icon={Shirt}
          title="Your closet is empty"
          description="Add your first item and let your AI stylist start building looks from your own wardrobe."
          actionLabel="Add Your First Item"
          onAction={() => router.push("/closet/add")}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between pb-2 pt-6">
        <View>
          <Text className="text-2xl font-bold text-ink">Your Closet</Text>
          <Text className="text-sm text-muted">
            {activeItems.length} item{activeItems.length === 1 ? "" : "s"}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <IconButton onPress={() => setLayout(layout === "grid" ? "list" : "grid")}>
            {layout === "grid" ? (
              <LayoutList size={20} color={color.ink} />
            ) : (
              <LayoutGrid size={20} color={color.ink} />
            )}
          </IconButton>
          <IconButton variant="solid" onPress={() => router.push("/closet/add")} className="bg-ink">
            <Plus size={20} color={color.canvas} />
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
        <StateView
          icon={Filter}
          title="Nothing in this category"
          description="No items match this filter yet."
          actionLabel="Clear Filter"
          onAction={() => setFilter("all")}
        />
      ) : (
        <FlatList
          key={layout}
          data={filteredItems}
          keyExtractor={(item) => item.id}
          numColumns={layout === "grid" ? 2 : 1}
          columnWrapperClassName={layout === "grid" ? "gap-3" : undefined}
          contentContainerClassName="gap-3 pb-8"
          showsVerticalScrollIndicator={false}
          // Every cell decodes a garment image, so the render window is kept
          // deliberately small — the default (10 initial / 10 per batch / 21
          // windows) mounts far more image tiles than a phone screen shows.
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={7}
          removeClippedSubviews
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              layout={layout}
              onPress={() => router.push(`/closet/${item.id}`)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          )}
          ListFooterComponent={
            <View className="mt-1 gap-2.5">
              <Card
                onPress={() => router.push("/gaps")}
                className="flex-row items-center gap-3.5 p-4"
              >
                <IconWell size="md"><SquareStack size={19} color={color.primary} strokeWidth={1.75} /></IconWell>
                <View className="flex-1">
                  <Text className="text-body font-semibold text-ink">What&apos;s missing?</Text>
                  <Text className="mt-0.5 text-caption text-muted">
                    See the gaps holding your rotation back
                  </Text>
                </View>
                <ChevronRight size={18} color={color.faint} />
              </Card>

              <Card
                onPress={() => router.push("/value")}
                className="flex-row items-center gap-3.5 p-4"
              >
                <IconWell size="md"><Wallet size={19} color={color.primary} strokeWidth={1.75} /></IconWell>
                <View className="flex-1">
                  <Text className="text-body font-semibold text-ink">What&apos;s it worth?</Text>
                  <Text className="mt-0.5 text-caption text-muted">
                    Total value and cost per wear
                  </Text>
                </View>
                <ChevronRight size={18} color={color.faint} />
              </Card>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}
