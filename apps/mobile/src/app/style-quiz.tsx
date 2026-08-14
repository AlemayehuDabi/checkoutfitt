import { router } from "expo-router";
import { ArrowLeft, PartyPopper, Shirt, User, Users } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SelectCard } from "@/components/ui/select-card";

import { color } from "@/design";
import { IconWell } from "@/components/ui/icon-well";

const TOTAL_STEPS = 4;

const GENDER_OPTIONS = [
  { key: "womenswear", label: "Womenswear", icon: User },
  { key: "menswear", label: "Menswear", icon: User },
  { key: "mixed", label: "Non-binary / Mixed", icon: Users },
] as const;

const STYLE_OPTIONS = [
  "Minimalist",
  "Streetwear",
  "Old Money",
  "Casual",
  "Formal",
  "Athleisure",
  "Bohemian",
  "Preppy",
];

const TOP_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const BOTTOM_SIZES = ["24", "26", "28", "30", "32", "34", "36", "38"];
const SHOE_SIZES = ["6", "7", "8", "9", "10", "11", "12", "13"];

export default function StyleQuizScreen() {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<string | null>(null);
  const [styles, setStyles] = useState<string[]>([]);
  const [topSize, setTopSize] = useState<string | null>(null);
  const [bottomSize, setBottomSize] = useState<string | null>(null);
  const [shoeSize, setShoeSize] = useState<string | null>(null);

  const genderLabel = GENDER_OPTIONS.find((option) => option.key === gender)?.label;

  const canProceed = useMemo(() => {
    if (step === 1) return gender !== null;
    if (step === 2) return styles.length > 0;
    if (step === 3) return topSize !== null && bottomSize !== null && shoeSize !== null;
    return true;
  }, [step, gender, styles, topSize, bottomSize, shoeSize]);

  const toggleStyle = (style: string) => {
    setStyles((prev) =>
      prev.includes(style) ? prev.filter((item) => item !== style) : [...prev, style]
    );
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
      return;
    }
    setStep((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!canProceed) return;
    if (step === TOTAL_STEPS) {
      router.replace("/home");
      return;
    }
    setStep((prev) => prev + 1);
  };

  return (
    <ScreenContainer scroll>
      <View className="flex-1 pt-6">
        <View className="flex-row items-center gap-4">
          <Pressable
            onPress={handleBack}
            hitSlop={8}
            className="h-10 w-10 items-center justify-center rounded-full active:bg-surface-sunken"
          >
            <ArrowLeft size={22} color={color.ink} />
          </Pressable>
          <View className="flex-1">
            <ProgressBar step={step} total={TOTAL_STEPS} />
          </View>
        </View>
        <Text className="mt-2 text-micro font-medium uppercase text-muted">
          Step {step} of {TOTAL_STEPS}
        </Text>

        {step === 1 ? (
          <View className="mt-8">
            <Text className="text-3xl font-bold text-ink">
              Who are we styling?
            </Text>
            <Text className="mt-2 text-base text-muted">
              This helps us tailor outfit recommendations to you.
            </Text>
            <View className="mt-8 gap-3">
              {GENDER_OPTIONS.map((option) => (
                <SelectCard
                  key={option.key}
                  label={option.label}
                  selected={gender === option.key}
                  onPress={() => setGender(option.key)}
                  icon={
                    <option.icon
                      size={22}
                      color={gender === option.key ? color.canvas : color.ink}
                    />
                  }
                />
              ))}
            </View>
          </View>
        ) : null}

        {step === 2 ? (
          <View className="mt-8">
            <Text className="text-3xl font-bold text-ink">
              What&apos;s your style?
            </Text>
            <Text className="mt-2 text-base text-muted">
              Pick as many as you like. You can always refine this later.
            </Text>
            <View className="mt-8 flex-row flex-wrap gap-2.5">
              {STYLE_OPTIONS.map((style) => (
                <Chip
                  key={style}
                  label={style}
                  selected={styles.includes(style)}
                  onPress={() => toggleStyle(style)}
                />
              ))}
            </View>
          </View>
        ) : null}

        {step === 3 ? (
          <View className="mt-8">
            <Text className="text-3xl font-bold text-ink">
              What&apos;s your size?
            </Text>
            <Text className="mt-2 text-base text-muted">
              We&apos;ll use this to recommend fits that actually work for you.
            </Text>

            <View className="mt-8 gap-6">
              <SizeGroup label="Top" options={TOP_SIZES} value={topSize} onChange={setTopSize} />
              <SizeGroup
                label="Bottom (waist)"
                options={BOTTOM_SIZES}
                value={bottomSize}
                onChange={setBottomSize}
              />
              <SizeGroup label="Shoe (US)" options={SHOE_SIZES} value={shoeSize} onChange={setShoeSize} />
            </View>
          </View>
        ) : null}

        {step === 4 ? (
          <View className="mt-8 flex-1 items-center">
            <IconWell size="2xl"><PartyPopper size={32} color={color.primary} /></IconWell>
            <Text className="mt-6 text-center text-3xl font-bold text-ink">
              You&apos;re all set!
            </Text>
            <Text className="mt-2 text-center text-base text-muted">
              Here&apos;s what we&apos;ll use to style you.
            </Text>

            <View className="mt-8 w-full gap-3 rounded-2xl border border-line bg-surface p-5">
              <SummaryRow icon={Shirt} label="Styling for" value={genderLabel ?? "—"} />
              <SummaryRow icon={Shirt} label="Style" value={styles.join(", ") || "—"} />
              <SummaryRow
                icon={Shirt}
                label="Sizes"
                value={`Top ${topSize} · Waist ${bottomSize} · Shoe ${shoeSize}`}
              />
            </View>
          </View>
        ) : null}
      </View>

      <Button
        label={step === TOTAL_STEPS ? "Enter CheckoutFitt" : "Next"}
        onPress={handleNext}
        disabled={!canProceed}
        className="mt-10"
      />
    </ScreenContainer>
  );
}

function SizeGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
}) {
  return (
    <View>
      <Text className="mb-3 text-sm font-medium text-ink">{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2.5">
          {options.map((option) => (
            <Chip key={option} label={option} selected={value === option} onPress={() => onChange(option)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Shirt;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-start gap-3">
      <Icon size={18} color={color.muted} />
      <View className="flex-1">
        <Text className="text-micro font-medium uppercase text-muted">{label}</Text>
        <Text className="mt-0.5 text-base font-medium text-ink">{value}</Text>
      </View>
    </View>
  );
}
