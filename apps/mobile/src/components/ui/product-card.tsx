import { ExternalLink, ShoppingBag } from "lucide-react-native";
import { Text, View } from "react-native";

import { Tag } from "@/components/ui/tag";
import { PressableScale } from "@/components/ui/pressable-scale";
import { color, elevation } from "@/design";
import { AppImage } from "@/components/ui/app-image";

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: string;
  retailer?: string;
  imageUri?: string;
  /** Flat colour used when no photo is available. */
  colorHex?: string;
  badge?: string;
};

type ProductCardProps = {
  product: Product;
  onPress?: () => void;
  /** `row` for lists, `tile` for horizontal carousels. */
  layout?: "row" | "tile";
  footer?: string;
  className?: string;
};

/**
 * An *external* commerce item — brand, price, retailer — as opposed to
 * `ItemCard`, which renders a garment the user already owns.
 */
export function ProductCard({
  product,
  onPress,
  layout = "row",
  footer,
  className = "",
}: ProductCardProps) {
  const isTile = layout === "tile";

  const media = (
    <View
      className={`overflow-hidden rounded-md border border-border bg-surface-secondary ${
        isTile ? "aspect-[3/4] w-full" : "h-20 w-20"
      }`}
      style={product.colorHex && !product.imageUri ? { backgroundColor: product.colorHex } : undefined}
    >
      {product.imageUri ? (
        <AppImage source={{ uri: product.imageUri }} className="h-full w-full" contentFit="cover" />
      ) : (
        <View className="h-full w-full items-center justify-center">
          <ShoppingBag size={isTile ? 28 : 20} color={color.textMuted} strokeWidth={1.5} />
        </View>
      )}
    </View>
  );

  const body = (
    <View className={isTile ? "mt-md" : "flex-1"}>
      <Text className="text-eyebrow font-semibold uppercase text-text-muted" numberOfLines={1}>
        {product.brand}
      </Text>
      <Text className="mt-1 text-h3 font-semibold text-text-primary" numberOfLines={2}>
        {product.name}
      </Text>
      <View className="mt-1.5 flex-row items-center gap-sm">
        <Text className="text-body font-bold text-text-primary">{product.price}</Text>
        {product.retailer ? (
          <View className="flex-row items-center gap-1">
            <ExternalLink size={11} color={color.textMuted} />
            <Text className="text-caption text-text-muted" numberOfLines={1}>
              {product.retailer}
            </Text>
          </View>
        ) : null}
      </View>
      {footer ? <Text className="mt-sm text-caption text-text-muted">{footer}</Text> : null}
    </View>
  );

  const Wrapper = onPress ? PressableScale : View;

  return (
    <Wrapper
      onPress={onPress}
      style={elevation.md}
      className={`rounded-xl border border-border bg-surface p-md ${
        isTile ? "w-44" : "flex-row items-center gap-md"
      } ${className}`}
    >
      {media}
      {body}
      {product.badge ? (
        <View className={isTile ? "mt-md" : "absolute right-3 top-3"}>
          <Tag label={product.badge} tone="primary" />
        </View>
      ) : null}
    </Wrapper>
  );
}
