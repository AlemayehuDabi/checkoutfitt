import { type ReactNode } from "react";
import { ActivityIndicator, Text, View } from "react-native";

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
 * Fill and border per variant, as plain utility classes.
 *
 * These are deliberately *not* driven through a Reanimated animated style.
 * `PressableScale` is a `cssInterop`-wrapped animated Pressable, so its
 * `className` and its `style` prop both resolve onto `style` — and when both
 * try to set `backgroundColor`, the animated one loses. Driving the resting
 * fill from an animated style is what left every primary button transparent
 * with a white label on it. Press feedback is carried by scale and opacity
 * instead, which nothing else writes to.
 */
const surface: Record<ButtonVariant, string> = {
  primary: "bg-primary-500",
  ink: "bg-ink",
  /** Spec §6.1 secondary: outlined in the brand colour. */
  secondary: "border-[1.5px] border-primary-500 bg-transparent",
  /** Neutral outline — the quiet alternative on tinted or photographic stock. */
  outline: "border-[1.5px] border-border-strong bg-surface",
  ghost: "bg-transparent",
  /** Spec §6.1 destructive. */
  danger: "border-[1.5px] border-danger bg-danger-light",
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

  return (
    <PressableScale
      onPress={onPress}
      disabled={isDisabled}
      pressScale={motion.pressScale.sm}
      pressOpacity={0.85}
      // A disabled control shouldn't float — dropping the shadow is what sells
      // that it isn't pressable, more than the opacity change does.
      style={isDisabled ? undefined : lift[variant]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={`flex-row items-center justify-center rounded-lg ${sizing[size]} ${surface[variant]} ${
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
