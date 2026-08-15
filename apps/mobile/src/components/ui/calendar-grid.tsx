import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { color } from "@/design";
import { PressableScale } from "@/components/ui/pressable-scale";
import {
  addMonths,
  daysInMonth,
  monthLabel,
  startWeekday,
  toISODate,
  WEEKDAY_INITIALS,
} from "@/lib/date";

type CalendarGridProps = {
  /** Any date inside the month being displayed. */
  month: Date;
  onMonthChange: (next: Date) => void;
  /** ISO `YYYY-MM-DD`. */
  selected?: string;
  onSelect: (iso: string) => void;
  /** ISO date → accent colour, for days that already have an outfit assigned. */
  markers?: Record<string, string>;
  className?: string;
};

/**
 * Month grid with a hairline weekday rule, marker dots for scheduled days, and
 * an inked selection chip. Built for the Outfit Calendar but generic enough for
 * any date-assignment flow.
 */
export function CalendarGrid({
  month,
  onMonthChange,
  selected,
  onSelect,
  markers = {},
  className = "",
}: CalendarGridProps) {
  const todayISO = toISODate(new Date());
  const leading = startWeekday(month);
  const total = daysInMonth(month);

  const cells: (number | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <View className={className}>
      <View className="flex-row items-center justify-between">
        <PressableScale
          hitSlop={10}
          onPress={() => onMonthChange(addMonths(month, -1))}
          accessibilityLabel="Previous month"
          className="h-10 w-10 items-center justify-center rounded-full"
        >
          <ChevronLeft size={20} color={color.textPrimary} />
        </PressableScale>
        <Text className="text-h2 font-bold text-text-primary">{monthLabel(month)}</Text>
        <PressableScale
          hitSlop={10}
          onPress={() => onMonthChange(addMonths(month, 1))}
          accessibilityLabel="Next month"
          className="h-10 w-10 items-center justify-center rounded-full"
        >
          <ChevronRight size={20} color={color.textPrimary} />
        </PressableScale>
      </View>

      <View className="mt-lg flex-row">
        {WEEKDAY_INITIALS.map((day, index) => (
          <Text
            key={`${day}-${index}`}
            className="flex-1 text-center text-eyebrow font-semibold uppercase text-text-muted"
          >
            {day}
          </Text>
        ))}
      </View>
      <View className="mt-sm h-px bg-border" />

      <View className="mt-sm flex-row flex-wrap">
        {cells.map((day, index) => {
          if (day === null) {
            return <View key={`blank-${index}`} className="h-12 w-[14.28%]" />;
          }

          const iso = toISODate(new Date(month.getFullYear(), month.getMonth(), day));
          const isSelected = iso === selected;
          const isToday = iso === todayISO;
          const marker = markers[iso];

          return (
            <View key={iso} className="h-12 w-[14.28%] items-center justify-center">
              <PressableScale
                onPress={() => onSelect(iso)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                className={`h-9 w-9 items-center justify-center rounded-full ${
                  isSelected
                    ? "bg-primary-500"
                    : isToday
                      ? "border border-primary-500 bg-primary-50"
                      : ""
                }`}
              >
                <Text
                  className={`text-body ${
                    isSelected
                      ? "font-semibold text-text-on-primary"
                      : isToday
                        ? "font-semibold text-primary-700"
                        : "font-medium text-text-primary"
                  }`}
                >
                  {day}
                </Text>
              </PressableScale>
              <View className="mt-0.5 h-1.5">
                {marker && !isSelected ? (
                  <View
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: marker }}
                  />
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
