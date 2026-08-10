import { type ReactNode } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-ink active:bg-ink/90",
  secondary: "bg-clay active:bg-clay-600",
  outline: "bg-transparent border border-line active:bg-sand-100",
  ghost: "bg-transparent active:bg-sand-100",
};

const variantTextStyles: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-white",
  outline: "text-ink",
  ghost: "text-ink",
};

export function Button({
  label,
  onPress,
  variant = "primary",
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
      className={`h-14 flex-row items-center justify-center gap-2 rounded-2xl ${variantStyles[variant]} ${
        isDisabled ? "opacity-40" : ""
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" || variant === "ghost" ? "#1A1917" : "#FFFFFF"} />
      ) : (
        <>
          {icon}
          <Text className={`text-base font-semibold ${variantTextStyles[variant]}`}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}
