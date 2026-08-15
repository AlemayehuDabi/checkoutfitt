import { Text, View } from "react-native";

export type TagTone =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "inverse";

type TagProps = {
  label: string;
  tone?: TagTone;
  /** Renders a leading swatch dot — used for garment colours. */
  dotColor?: string;
  className?: string;
};

/**
 * Spec §6.3 static tag: 28px tall, 8px radius, 10px of horizontal padding, no
 * border. Flat by design — tags sit *inside* raised surfaces, so giving them
 * their own edge treatment reads as clutter.
 */
const surfaces: Record<TagTone, string> = {
  default: "bg-surface-secondary",
  primary: "bg-primary-50",
  success: "bg-success-light",
  warning: "bg-warning-light",
  danger: "bg-danger-light",
  info: "bg-info-light",
  inverse: "bg-surface-inverse",
};

const labels: Record<TagTone, string> = {
  default: "text-text-secondary",
  primary: "text-primary-700",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
  inverse: "text-canvas",
};

export function Tag({ label, tone = "default", dotColor, className = "" }: TagProps) {
  return (
    <View
      className={`h-7 flex-row items-center gap-xs self-start rounded-sm px-sm ${surfaces[tone]} ${className}`}
    >
      {dotColor ? (
        <View
          className="h-2.5 w-2.5 rounded-full border border-border"
          style={{ backgroundColor: dotColor }}
        />
      ) : null}
      <Text className={`text-tag font-medium ${labels[tone]}`}>{label}</Text>
    </View>
  );
}
