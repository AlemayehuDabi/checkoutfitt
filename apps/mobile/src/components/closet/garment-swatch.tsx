import { Footprints, Shirt, Watch } from "lucide-react-native";
import { View } from "react-native";

import { AppImage } from "@/components/ui/app-image";
import { color } from "@/design";
import type { ClosetCategory } from "@/types";

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

export function GarmentSwatch({
  category,
  colorHex,
  imageUri,
  className = "",
  iconSize = 28,
}: GarmentSwatchProps) {
  if (imageUri) {
    return (
      <AppImage
        source={{ uri: imageUri }}
        // Lets expo-image drop the previous row's bitmap when a virtualized cell
        // is recycled, instead of briefly showing the wrong garment mid-scroll.
        recyclingKey={imageUri}
        // The secondary surface shows through while the bitmap decodes, and
        // stays visible behind garments shot on a removed background.
        className={`border border-border bg-surface-secondary ${className}`}
      />
    );
  }

  const Icon = CATEGORY_ICONS[category];
  const isLight = isLightColor(colorHex);

  return (
    <View
      className={`items-center justify-center border border-border ${className}`}
      style={{ backgroundColor: colorHex }}
    >
      <Icon size={iconSize} color={isLight ? color.textPrimary : color.canvas} strokeWidth={1.5} />
    </View>
  );
}

/**
 * Luminance is derived from a small fixed set of garment colours, and a closet
 * grid renders dozens of swatches at once. React Compiler memoises per instance,
 * so the cache is what stops the same handful of hexes being re-parsed per cell.
 */
const luminanceCache = new Map<string, boolean>();

function isLightColor(hex: string) {
  const cached = luminanceCache.get(hex);
  if (cached !== undefined) return cached;

  const value = hex.replace("#", "");
  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);
  const isLight = (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;

  luminanceCache.set(hex, isLight);
  return isLight;
}
