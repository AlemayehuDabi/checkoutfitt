import { styled } from "nativewind";
import {
  SafeAreaView as OriginalSafeAreaView,
  type SafeAreaViewProps,
} from "react-native-safe-area-context";

/**
 * `SafeAreaView` with `className` support.
 *
 * Metro rewrites `react-native` imports to NativeWind's styled equivalents, but
 * that only reaches React Native's own primitives. `SafeAreaView` renders the
 * `RNCSafeAreaView` host component directly, so a `className` lands on a native
 * view that has no such prop and is dropped without warning — the screen loses
 * its `flex-1`, collapses to zero height, and renders as a blank white page.
 *
 * Mapping `className` onto `style` is the same treatment `AppImage` gives
 * `expo-image`. Import `SafeAreaView` from here, never from the package.
 */
export const SafeAreaView = styled(OriginalSafeAreaView, {
  className: "style",
}) as React.ComponentType<SafeAreaViewProps & { className?: string }>;
