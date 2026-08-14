import { Footprints, Shirt, Watch } from "lucide-react-native";
import { Image, View } from "react-native";

import type { ClosetCategory } from "@/types";

import { color } from "@/design";

const CATEGORY_ICONS: Record<ClosetCategory, typeof Shirt> = {
  top: Shirt,
  bottom: Shirt,
  outerwear: Shirt,
  dress: Shirt,
  shoes: Footprints,
  accessory: Watch,
};

type GarmentSwatchProps = {
  category: ClosetCategory;
  colorHex: string;
  imageUri?: string;
  className?: string;
  iconSize?: number;
};

export function GarmentSwatch({ category, colorHex, imageUri, className = "", iconSize = 28 }: GarmentSwatchProps) {
  if (imageUri) {
    return (
      <Image
        source={{ uri: imageUri }}
        className={`bg-surface-sunken ${className}`}
        resizeMode="cover"
      />
    );
  }

  const Icon = CATEGORY_ICONS[category];
  const isLight = isLightColor(colorHex);

  return (
    <View
      className={`items-center justify-center ${className}`}
      style={{ backgroundColor: colorHex }}
    >
      <Icon size={iconSize} color={isLight ? color.ink : color.canvas} strokeWidth={1.5} />
    </View>
  );
}

function isLightColor(hex: string) {
  const value = hex.replace("#", "");
  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}
