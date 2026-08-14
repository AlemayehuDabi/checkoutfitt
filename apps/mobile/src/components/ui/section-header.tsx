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
    <View className={`mb-3 ${className}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-2">
          {index ? (
            <Text className="text-micro font-bold uppercase text-primary">{index}</Text>
          ) : null}
          <Text className="text-micro font-semibold uppercase text-muted" numberOfLines={1}>
            {title}
          </Text>
          <View className="h-px flex-1 bg-line" />
        </View>
        {action ? <View className="ml-3">{action}</View> : null}
      </View>
      {subtitle ? <Text className="mt-2 text-body-sm text-muted">{subtitle}</Text> : null}
    </View>
  );
}
