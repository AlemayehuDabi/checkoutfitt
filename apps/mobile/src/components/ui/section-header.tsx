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
 * The title that opens a section.
 *
 * The mockups set these as dark, sentence-case `h3` headings ("Missing
 * Essentials", "Top Items by Value", "Quick Actions") rather than the muted
 * uppercase eyebrow with a rule that this used to render — the eyebrow
 * treatment is reserved for `PageHeading`'s kicker and for standalone labels
 * like "Pieces". Replaces the hand-rolled block that had been copy-pasted
 * across Home, Closet Confirm, Profile and Subscription.
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
      <View className="flex-row items-center justify-between gap-md">
        <View className="flex-1 flex-row items-baseline gap-sm">
          {index ? (
            <Text className="text-eyebrow font-semibold text-primary-500">{index}</Text>
          ) : null}
          <Text className="flex-1 text-h3 font-semibold text-text-primary" numberOfLines={1}>
            {title}
          </Text>
        </View>
        {action ? <View>{action}</View> : null}
      </View>
      {subtitle ? <Text className="mt-1 text-caption text-text-muted">{subtitle}</Text> : null}
    </View>
  );
}
