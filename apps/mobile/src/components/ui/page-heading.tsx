import { Text, View } from "react-native";

type PageHeadingProps = {
  /** Small uppercase kicker above the title. */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** `display` for landing/result moments, `h1` for routine screens. */
  size?: "display" | "h1";
  className?: string;
};

/**
 * The editorial title block that opens a screen: paprika kicker, tightly
 * tracked headline, supporting line.
 */
export function PageHeading({
  eyebrow,
  title,
  subtitle,
  size = "h1",
  className = "",
}: PageHeadingProps) {
  return (
    <View className={className}>
      {eyebrow ? (
        <Text className="mb-sm text-eyebrow font-semibold uppercase text-primary-500">{eyebrow}</Text>
      ) : null}
      <Text className={`font-bold text-text-primary ${size === "display" ? "text-display" : "text-h1"}`}>
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-sm text-body text-text-muted">{subtitle}</Text>
      ) : null}
    </View>
  );
}
