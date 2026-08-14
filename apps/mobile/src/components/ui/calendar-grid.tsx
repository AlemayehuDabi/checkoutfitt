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
          <ChevronLeft size={20} color={color.ink} />
        </PressableScale>
        <Text className="text-h3 font-bold text-ink">{monthLabel(month)}</Text>
        <PressableScale
          hitSlop={10}
          onPress={() => onMonthChange(addMonths(month, 1))}
          accessibilityLabel="Next month"
          className="h-10 w-10 items-center justify-center rounded-full"
        >
          <ChevronRight size={20} color={color.ink} />
        </PressableScale>
      </View>

      <View className="mt-4 flex-row">
        {WEEKDAY_INITIALS.map((day, index) => (
          <Text
            key={`${day}-${index}`}
            className="flex-1 text-center text-micro font-semibold uppercase text-faint"
          >
            {day}
          </Text>
        ))}
      </View>
      <View className="mt-2 h-px bg-line" />

      <View className="mt-2 flex-row flex-wrap">
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
                className={`h-9 w-9 items-center justify-center rounded-xl ${
                  isSelected
                    ? "bg-ink"
                    : isToday
                      ? "border border-primary bg-primary-50"
                      : ""
                }`}
              >
                <Text
                  className={`text-body-sm ${
                    isSelected
                      ? "font-bold text-canvas"
                      : isToday
                        ? "font-bold text-primary-700"
                        : "font-medium text-ink"
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
