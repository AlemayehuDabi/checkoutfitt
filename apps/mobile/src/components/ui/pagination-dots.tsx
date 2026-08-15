import { View } from "react-native";

type PaginationDotsProps = {
  count: number;
  activeIndex: number;
};

export function PaginationDots({ count, activeIndex }: PaginationDotsProps) {
  return (
    <View className="flex-row items-center justify-center gap-sm">
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          className={`h-2 rounded-full ${
            index === activeIndex ? "w-6 bg-primary-500" : "w-2 bg-border-strong"
          }`}
        />
      ))}
    </View>
  );
}
