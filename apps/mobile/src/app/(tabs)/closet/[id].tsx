import { router, useLocalSearchParams } from "expo-router";
import { Archive, ArchiveRestore, Heart, Pencil, Shirt, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Button } from "@/components/ui/button";
import { ConfirmSheet } from "@/components/ui/confirm-sheet";
import { Header } from "@/components/ui/header";
import { IconButton } from "@/components/ui/icon-button";
import { ScreenContainer } from "@/components/ui/screen-container";
import { StateView } from "@/components/ui/state-view";
import { Tag } from "@/components/ui/tag";
import { CLOSET_CATEGORIES } from "@/constants/mock-closet";
import { useCloset } from "@/context/closet-context";

import { color } from "@/design";

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

      <Text className="mt-2xl text-h1 font-bold text-text-primary">{item.type}</Text>
      <View className="mt-md flex-row flex-wrap gap-sm">
        <Tag label={categoryLabel} />
        <Tag label={item.color} dotColor={item.colorHex} />
        {item.archived ? <Tag label="Archived" tone="primary" /> : null}
      </View>

      <View className="mt-3xl gap-md">
        <Button
          label="Edit Item"
          variant="secondary"
          icon={<Pencil size={18} color={color.primary500} />}
          onPress={() => router.push(`/closet/edit/${item.id}`)}
        />
        <Button
          label={item.archived ? "Restore Item" : "Archive Item"}
          variant="outline"
          icon={
            item.archived ? (
              <ArchiveRestore size={18} color={color.textPrimary} />
            ) : (
              <Archive size={18} color={color.textPrimary} />
            )
          }
          onPress={() => toggleArchive(item.id)}
        />
        <Button
          label="Delete Item"
          variant="danger"
          icon={<Trash2 size={18} color={color.danger} />}
          onPress={() => setConfirmVisible(true)}
        />
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
