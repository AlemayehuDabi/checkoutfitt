import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { color } from "@/design";

export type ScoreTone = "success" | "primary" | "warning" | "danger";

type ScoreDialProps = {
  /** 0–100. */
  score: number;
  label?: string;
  caption?: string;
  size?: number;
  /** Overrides the automatic banding. */
  tone?: ScoreTone;
  className?: string;
};

const strokes: Record<ScoreTone, string> = {
  success: color.success,
  primary: color.primary500,
  warning: color.warning,
  danger: color.danger,
};

/** Bands a raw score so every surface grades consistently. */
export function toneForScore(score: number): ScoreTone {
  if (score >= 80) return "success";
  if (score >= 60) return "primary";
  if (score >= 40) return "warning";
  return "danger";
}

/**
 * Circular score readout used across Outfit Rating, Color Analysis and the
 * Capsule/Shopping verdicts. The track is a full ring; the value is drawn as an
 * arc starting at 12 o'clock.
 */
export function ScoreDial({
  score,
  label,
  caption,
  size = 148,
  tone,
  className = "",
}: ScoreDialProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const resolved = tone ?? toneForScore(clamped);

  const stroke = Math.max(8, Math.round(size * 0.075));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const center = size / 2;

  return (
    <View className={`items-center ${className}`}>
      <View style={{ width: size, height: size }} className="items-center justify-center">
        <Svg width={size} height={size} style={{ position: "absolute" }}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={color.primary200}
            strokeWidth={stroke}
            fill="none"
          />
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={strokes[resolved]}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            fill="none"
            // Start the arc at 12 o'clock instead of 3 o'clock.
            transform={`rotate(-90 ${center} ${center})`}
          />
        </Svg>
        <View className="items-center">
          <Text
            className="font-bold text-primary-500"
            style={{ fontSize: size * 0.28, letterSpacing: -0.3 }}
          >
            {clamped}
          </Text>
          {label ? (
            <Text className="mt-0.5 text-caption font-medium text-text-muted">{label}</Text>
          ) : null}
        </View>
      </View>
      {caption ? (
        <Text className="mt-md text-center text-caption text-text-muted">{caption}</Text>
      ) : null}
    </View>
  );
}
