import { type ReactNode } from "react";
import { Pressable, View } from "react-native";

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
};

export function Card({ children, onPress, className = "" }: CardProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`rounded-2xl border border-line bg-white active:opacity-80 ${className}`}
      >
        {children}
      </Pressable>
    );
  }

  return <View className={`rounded-2xl border border-line bg-white ${className}`}>{children}</View>;
}
