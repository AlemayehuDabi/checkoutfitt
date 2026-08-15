import { Text, View } from "react-native";

import { type ScoreTone, toneForScore } from "@/components/ui/score-dial";

type MeterProps = {
  label: string;
  /** 0–100 unless `max` is given. */
  value: number;
  max?: number;
  /** Right-hand readout. Defaults to `value/max`. */
  valueLabel?: string;
  hint?: string;
  tone?: ScoreTone;
  className?: string;
};

const fills: Record<ScoreTone, string> = {
  success: "bg-success",
  primary: "bg-primary-500",
  warning: "bg-warning",
  danger: "bg-danger",
};

/**
 * Continuous horizontal readout — the counterpart to the step-segmented
 * `ProgressBar`, which stays reserved for wizard progress.
 */
export function Meter({
  label,
  value,
  max = 100,
  valueLabel,
  hint,
  tone,
  className = "",
}: MeterProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const resolved = tone ?? toneForScore(pct);

  return (
    <View className={className}>
      <View className="flex-row items-baseline justify-between">
        <Text className="text-caption font-medium text-text-primary">{label}</Text>
        <Text className="text-caption font-semibold text-text-secondary">
          {valueLabel ?? `${Math.round(value)}`}
        </Text>
      </View>
      <View className="mt-sm h-2 overflow-hidden rounded-full bg-surface-tertiary">
        <View className={`h-full rounded-full ${fills[resolved]}`} style={{ width: `${pct}%` }} />
      </View>
      {hint ? <Text className="mt-1.5 text-caption text-text-muted">{hint}</Text> : null}
    </View>
  );
}
