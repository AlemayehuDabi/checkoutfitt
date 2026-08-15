import { type ReactNode } from "react";
import { Text, View } from "react-native";

type SectionHeaderProps = {
  title: string;
  /** Editorial numeral, e.g. "01". Rendered in paprika ahead of the label. */
  index?: string;
  subtitle?: string;
  /** Trailing slot — usually a text link or small button. */
  action?: ReactNode;
  className?: string;
};

/**
 * The uppercase eyebrow that opens every section.
 *
 * Replaces the hand-rolled `text-xs font-semibold uppercase` block that had
 * been copy-pasted across Home, Closet Confirm, Profile and Subscription.
 */
export function SectionHeader({
  title,
  index,
  subtitle,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <View className={`mb-md ${className}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-sm">
          {index ? (
            <Text className="text-eyebrow font-semibold uppercase text-primary-500">{index}</Text>
          ) : null}
          <Text className="text-eyebrow font-semibold uppercase text-text-muted" numberOfLines={1}>
            {title}
          </Text>
          <View className="h-px flex-1 bg-border" />
        </View>
        {action ? <View className="ml-md">{action}</View> : null}
      </View>
      {subtitle ? <Text className="mt-sm text-caption text-text-muted">{subtitle}</Text> : null}
    </View>
  );
}
