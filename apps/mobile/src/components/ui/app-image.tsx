import { Image as ExpoImage, type ImageProps } from "expo-image";
import { cssInterop } from "nativewind";

/**
 * NativeWind doesn't style third-party native components out of the box, so the
 * `className` prop has to be mapped onto `style` explicitly.
 */
cssInterop(ExpoImage, { className: "style" });

type AppImageProps = ImageProps & { className?: string };

/**
 * The app's single image primitive.
 *
 * React Native's `<Image>` decodes the *source* bitmap at full resolution — a
 * 12MP camera capture rendered into a 64pt closet thumbnail was decoding tens of
 * megabytes per tile, which is what made the closet grid and outfit cards stutter.
 * `expo-image` downsamples to the layout size during decode and keeps a
 * memory + disk cache keyed off the URI.
 *
 * The short `transition` also means images fade in rather than popping, which is
 * why every surface should go through this instead of importing `Image` directly.
 */
export function AppImage({
  transition = 180,
  cachePolicy = "memory-disk",
  contentFit = "cover",
  ...rest
}: AppImageProps) {
  return (
    <ExpoImage
      transition={transition}
      cachePolicy={cachePolicy}
      contentFit={contentFit}
      {...rest}
    />
  );
}
