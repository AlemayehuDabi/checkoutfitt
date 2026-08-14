import { type ReactNode } from "react";
import { ActivityIndicator, Text } from "react-native";

import { PressableScale } from "@/components/ui/pressable-scale";
import { color } from "@/design";

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

/** Paprika owns the primary action; `ink` is the quiet alternative for use on
 *  tinted or photographic surfaces where the brand colour would shout.
 *
 *  No `active:` variants here on purpose — those re-render through JS on every
 *  touch. Press feedback comes from `PressableScale` on the UI thread instead. */
const surface: Record<ButtonVariant, string> = {
  primary: "bg-primary",
  ink: "bg-ink",
  secondary: "bg-surface-sunken",
  outline: "border border-line-strong bg-transparent",
  ghost: "bg-transparent",
  danger: "bg-danger",
};

const label: Record<ButtonVariant, string> = {
  primary: "text-white",
  ink: "text-canvas",
  secondary: "text-ink",
  outline: "text-ink",
  ghost: "text-ink",
  danger: "text-white",
};

const spinner: Record<ButtonVariant, string> = {
  primary: color.white,
  ink: color.canvas,
  secondary: color.ink,
  outline: color.ink,
  ghost: color.ink,
  danger: color.white,
};

const sizing: Record<ButtonSize, string> = {
  sm: "h-11 px-4 gap-1.5",
  md: "h-14 px-5 gap-2",
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
      pressScale={0.975}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={`flex-row items-center justify-center rounded-2xl ${sizing[size]} ${surface[variant]} ${
        isDisabled ? "opacity-40" : ""
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={spinner[variant]} />
      ) : (
        <>
          {icon}
          <Text
            className={`font-semibold ${size === "sm" ? "text-body-sm" : "text-body-lg"} ${label[variant]}`}
          >
            {text}
          </Text>
        </>
      )}
    </PressableScale>
  );
}
