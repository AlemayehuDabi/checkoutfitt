import { type ReactNode } from "react";
import { Pressable } from "react-native";

type IconButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  variant?: "ghost" | "solid";
  className?: string;
};

export function IconButton({ children, onPress, variant = "ghost", className = "" }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      className={`h-10 w-10 items-center justify-center rounded-full active:opacity-70 ${
        variant === "solid" ? "bg-white" : "active:bg-sand-100"
      } ${className}`}
    >
      {children}
    </Pressable>
  );
}
