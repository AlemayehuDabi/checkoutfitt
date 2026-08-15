import { type ReactNode } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { PressableScale } from "@/components/ui/pressable-scale";
import { color, elevation, motion } from "@/design";

type ButtonVariant = "primary" | "ink" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
};

/**
 * Fill and press-fill per variant.
 *
 * `null` means "stays transparent" — ghost has no fill at all, so it feeds the
 * opacity fallback below instead of an animated background.
 *
 * No `active:` variants here on purpose: those re-render through JS on every
 * touch. Both the scale (via `PressableScale`) and the colour shift run on the
 * UI thread so a press registers even while JS is busy.
 */
const fills: Record<ButtonVariant, { rest: string; pressed: string } | null> = {
  primary: { rest: color.primary500, pressed: color.primary600 },
  ink: { rest: color.ink, pressed: color.ink },
  /** Spec §6.1 secondary: outlined in the brand colour, fills primary-50. */
  secondary: { rest: "rgba(255, 245, 240, 0)", pressed: color.primary50 },
  /** Neutral outline — the quiet alternative on tinted or photographic stock. */
  outline: { rest: "rgba(245, 241, 234, 0)", pressed: color.surfaceSunken },
  ghost: null,
  /** Spec §6.1 destructive: outlined in danger, fills danger-light. */
  danger: { rest: "rgba(253, 237, 234, 0)", pressed: color.dangerLight },
};

/** 1.5px hairline on the outlined variants; the filled ones carry none. */
const borders: Record<ButtonVariant, string> = {
  primary: "",
  ink: "",
  secondary: "border-[1.5px] border-primary-500",
  outline: "border-[1.5px] border-border-strong",
  ghost: "",
  danger: "border-[1.5px] border-danger",
};

const label: Record<ButtonVariant, string> = {
  primary: "text-text-on-primary",
  ink: "text-canvas",
  secondary: "text-text-accent",
  outline: "text-text-primary",
  ghost: "text-text-accent",
  danger: "text-danger",
};

const spinner: Record<ButtonVariant, string> = {
  primary: color.textOnPrimary,
  ink: color.canvas,
  secondary: color.primary500,
  outline: color.textPrimary,
  ghost: color.primary500,
  danger: color.danger,
};

/**
 * Only the solid variants sit on their own plane. Primary casts a terracotta
 * glow so it reads as lit rather than dirty; outlined and ghost buttons stay
 * flat by design, since shadowing everything flattens the hierarchy again.
 */
const lift: Partial<Record<ButtonVariant, typeof elevation.md>> = {
  primary: elevation.primary,
  ink: elevation.sm,
};

/** Spec §6.1: 52px tall, 24px of horizontal padding. */
const sizing: Record<ButtonSize, string> = {
  sm: "h-11 px-lg gap-sm",
  md: "h-[52px] px-2xl gap-sm",
};

export function Button({
  label: text,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  className = "",
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const fill = fills[variant];

  // 0 at rest, 1 while held. Drives the colour shift that pairs with the scale.
  const pressed = useSharedValue(0);

  const fillStyle = useAnimatedStyle(() => {
    if (!fill) return {};
    return {
      backgroundColor: interpolateColor(pressed.value, [0, 1], [fill.rest, fill.pressed]),
    };
  });

  return (
    <PressableScale
      onPress={onPress}
      disabled={isDisabled}
      pressScale={motion.pressScale.sm}
      // Ghost has no fill to shift, so it leans on the opacity fade instead.
      pressOpacity={fill ? 1 : 0.7}
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: motion.duration.fast });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: motion.duration.normal });
      }}
      // A disabled control shouldn't float — dropping the shadow is what sells
      // that it isn't pressable, more than the opacity change does.
      style={[isDisabled ? undefined : lift[variant], fillStyle]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={`flex-row items-center justify-center rounded-lg ${sizing[size]} ${borders[variant]} ${
        isDisabled ? "opacity-40" : ""
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={spinner[variant]} />
      ) : (
        <>
          {icon ? <View className="-ml-0.5">{icon}</View> : null}
          <Text
            className={`font-semibold ${size === "sm" ? "text-body-sm" : "text-body"} ${label[variant]}`}
          >
            {text}
          </Text>
        </>
      )}
    </PressableScale>
  );
}
