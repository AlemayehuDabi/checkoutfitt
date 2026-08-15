import { router, useLocalSearchParams } from "expo-router";
import { Archive, ArchiveRestore, Heart, Pencil, Shirt, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmSheet } from "@/components/ui/confirm-sheet";
import { Header } from "@/components/ui/header";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { StateView } from "@/components/ui/state-view";
import { Tag } from "@/components/ui/tag";
import { CLOSET_CATEGORIES } from "@/constants/mock-closet";
import { useCloset } from "@/context/closet-context";

import { color, motion } from "@/design";

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getItem, toggleFavorite, toggleArchive, removeItem } = useCloset();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const item = getItem(id);

  if (!item) {
    return (
      <ScreenContainer>
        <Header title="Item" />
        <StateView
          icon={Shirt}
          title="Item not found"
          description="This piece is no longer in your closet."
          actionLabel="Back to Closet"
          onAction={() => router.replace("/closet")}
        />
      </ScreenContainer>
    );
  }

  const categoryLabel = CLOSET_CATEGORIES.find((c) => c.key === item.category)?.label ?? item.category;

  return (
    <ScreenContainer scroll>
      <Header
        title="Item Details"
        right={
          <IconButton onPress={() => toggleFavorite(item.id)}>
            <Heart
              size={24}
              color={item.favorite ? color.primary500 : color.textPrimary}
              fill={item.favorite ? color.primary500 : "transparent"}
            />
          </IconButton>
        }
      />

      <GarmentSwatch
        category={item.category}
        colorHex={item.colorHex}
        imageUri={item.imageUri}
        className="aspect-[3/4] w-full overflow-hidden rounded-xl"
        iconSize={56}
      />

      <Text className="mt-2xl text-h2 font-bold text-text-primary">{item.type}</Text>
      <Text className="mt-1 text-caption text-text-muted">
        {categoryLabel} · {item.color}
      </Text>
      <View className="mt-md flex-row flex-wrap gap-sm">
        <Tag label={categoryLabel} />
        <Tag label={item.color} dotColor={item.colorHex} />
        {item.archived ? <Tag label="Archived" tone="primary" /> : null}
      </View>

      <SectionHeader title="Details" className="mt-3xl" />
      <Card className="px-lg">
        <DetailRow label="Category" value={categoryLabel} />
        <View className="h-px bg-border" />
        <DetailRow label="Colour" value={item.color} />
        <View className="h-px bg-border" />
        <DetailRow label="Status" value={item.archived ? "Archived" : "In rotation"} />
      </Card>

      {/* Screen 9 lays the actions out as one row: a wide Edit alongside the
          two icon-only controls. */}
      <View className="mt-3xl flex-row gap-md">
        <Button
          label="Edit Item"
          variant="outline"
          icon={<Pencil size={18} color={color.textPrimary} />}
          onPress={() => router.push(`/closet/edit/${item.id}`)}
          className="flex-1"
        />
        <PressableScale
          onPress={() => toggleArchive(item.id)}
          pressScale={motion.pressScale.sm}
          accessibilityRole="button"
          accessibilityLabel={item.archived ? "Restore item" : "Archive item"}
          className="h-[52px] w-[52px] items-center justify-center rounded-lg border-[1.5px] border-border-strong"
        >
          {item.archived ? (
            <ArchiveRestore size={20} color={color.textPrimary} />
          ) : (
            <Archive size={20} color={color.textPrimary} />
          )}
        </PressableScale>
        <PressableScale
          onPress={() => setConfirmVisible(true)}
          pressScale={motion.pressScale.sm}
          accessibilityRole="button"
          accessibilityLabel="Delete item"
          className="h-[52px] w-[52px] items-center justify-center rounded-lg border-[1.5px] border-danger bg-danger-light"
        >
          <Trash2 size={20} color={color.danger} />
        </PressableScale>
      </View>

      <ConfirmSheet
        visible={confirmVisible}
        title="Delete this item?"
        message="This will permanently remove it from your digital closet. This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          setConfirmVisible(false);
          removeItem(item.id);
          router.back();
        }}
        onCancel={() => setConfirmVisible(false)}
      />
    </ScreenContainer>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="h-14 flex-row items-center justify-between">
      <Text className="text-body text-text-muted">{label}</Text>
      <Text className="text-body font-medium text-text-primary">{value}</Text>
    </View>
  );
}
