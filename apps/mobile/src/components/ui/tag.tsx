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

const surfaces: Record<TagTone, string> = {
  default: "bg-surface-sunken",
  primary: "bg-primary-50",
  success: "bg-success-soft",
  warning: "bg-warning-soft",
  danger: "bg-danger-soft",
  info: "bg-info-soft",
  inverse: "bg-surface-inverse",
};

const labels: Record<TagTone, string> = {
  default: "text-ink-soft",
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
      className={`flex-row items-center gap-1.5 self-start rounded-full px-3 py-1.5 ${surfaces[tone]} ${className}`}
    >
      {dotColor ? (
        <View
          className="h-2.5 w-2.5 rounded-full border border-line"
          style={{ backgroundColor: dotColor }}
        />
      ) : null}
      <Text className={`text-micro font-semibold uppercase ${labels[tone]}`}>{label}</Text>
    </View>
  );
}
