import { type ReactNode } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

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
 *  tinted or photographic surfaces where the brand colour would shout. */
const surface: Record<ButtonVariant, string> = {
  primary: "bg-primary active:bg-primary-700",
  ink: "bg-ink active:bg-ink-soft",
  secondary: "bg-surface-sunken active:bg-surface-muted",
  outline: "border border-line-strong bg-transparent active:bg-surface-sunken",
  ghost: "bg-transparent active:bg-surface-sunken",
  danger: "bg-danger active:opacity-90",
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
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
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
    </Pressable>
  );
}
