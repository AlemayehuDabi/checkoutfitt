import { router } from "expo-router";
import { Check, Minus } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ScreenContainer } from "@/components/ui/screen-container";
import { elevation, color } from "@/design";

type Feature = { label: string; free: string | boolean; pro: string | boolean };

const FEATURES: Feature[] = [
  { label: "Digital closet items", free: "20", pro: "Unlimited" },
  { label: "AI outfit generations", free: "5 / week", pro: "Unlimited" },
  { label: "AI stylist chat", free: "Limited", pro: "Unlimited" },
  { label: "Occasion styling", free: false, pro: true },
  { label: "Capsule wardrobe builder", free: false, pro: true },
  { label: "Priority generation", free: false, pro: true },
];

const PLANS = [
  { key: "monthly", label: "Monthly", price: "$9.99/mo" },
  { key: "yearly", label: "Yearly", price: "$79.99/yr" },
];

/**
 * Spec screen 27. A segmented toggle pill picks the billing period, then the
 * two plans sit side by side — Free in a plain card, Pro behind a 2px brand
 * border with the "MOST POPULAR" badge straddling its top edge.
 */
export default function SubscriptionScreen() {
  const [plan, setPlan] = useState("yearly");
  const activePlan = PLANS.find((entry) => entry.key === plan) ?? PLANS[0];

  return (
    <ScreenContainer scroll>
      <Header title="CheckoutFitt Pro" />

      <Text className="mt-2xl text-center text-h2 font-bold text-text-primary">
        Choose Your Plan
      </Text>
      <Text className="mt-sm text-center text-body text-text-muted">
        Compare plans and upgrade any time. Cancel whenever you want.
      </Text>

      {/* Spec §6.18 toggle pill. */}
      <View className="mt-2xl h-10 flex-row rounded-full bg-surface-secondary p-1">
        {PLANS.map((option) => {
          const active = plan === option.key;
          return (
            <PressableScale
              key={option.key}
              onPress={() => setPlan(option.key)}
              pressScale={0.97}
              pressOpacity={1}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={active ? elevation.sm : undefined}
              className={`h-8 flex-1 flex-row items-center justify-center gap-sm rounded-full ${
                active ? "bg-surface" : ""
              }`}
            >
              <Text
                className={`text-tag font-semibold ${
                  active ? "text-text-primary" : "text-text-muted"
                }`}
              >
                {option.label}
              </Text>
              {option.key === "yearly" ? (
                <View className="rounded-full bg-success px-sm py-0.5">
                  <Text className="text-tag font-medium text-text-on-primary">Save 20%</Text>
                </View>
              ) : null}
            </PressableScale>
          );
        })}
      </View>

      {/* Spec §6.17 plan comparison cards. */}
      <View className="mt-3xl flex-row gap-md">
        <PlanCard
          name="Free"
          price="$0"
          period="forever"
          features={FEATURES}
          column="free"
        />
        <PlanCard
          name="Pro"
          price={activePlan.price.split("/")[0]}
          period={plan === "yearly" ? "per year" : "per month"}
          features={FEATURES}
          column="pro"
          featured
        />
      </View>

      <Button
        label={plan === "yearly" ? "Start Yearly Plan" : "Start Monthly Plan"}
        onPress={() => router.back()}
        className="mt-3xl"
      />
      <Text className="mt-md text-center text-caption text-text-muted">Cancel anytime</Text>
      <Button label="Maybe Later" variant="ghost" onPress={() => router.back()} className="mb-lg mt-sm" />
    </ScreenContainer>
  );
}

function PlanCard({
  name,
  price,
  period,
  features,
  column,
  featured = false,
}: {
  name: string;
  price: string;
  period: string;
  features: Feature[];
  column: "free" | "pro";
  featured?: boolean;
}) {
  return (
    <View className="flex-1">
      <View
        style={featured ? elevation.md : elevation.sm}
        className={`rounded-xl bg-surface p-lg ${
          featured ? "border-2 border-primary-500" : "border border-border"
        }`}
      >
        <Text
          className={`text-eyebrow font-semibold uppercase ${
            featured ? "text-primary-500" : "text-text-muted"
          }`}
        >
          {name}
        </Text>
        <Text
          className={`mt-sm text-display font-bold ${
            featured ? "text-primary-500" : "text-text-primary"
          }`}
        >
          {price}
        </Text>
        <Text className="mt-0.5 text-caption text-text-muted">{period}</Text>

        <View className="mt-lg gap-md">
          {features.map((feature) => (
            <View key={feature.label} className="flex-row items-start gap-sm">
              <FeatureMark value={feature[column]} accent={featured} />
              <Text
                className={`flex-1 text-caption ${
                  feature[column] === false ? "text-text-muted" : "text-text-secondary"
                }`}
              >
                {feature.label}
                {typeof feature[column] === "string" ? (
                  <Text className="font-semibold text-text-primary"> · {feature[column]}</Text>
                ) : null}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {featured ? (
        // Badge straddles the top border, per spec §6.16.
        <View className="absolute -top-2.5 left-0 right-0 items-center">
          <View className="rounded-sm bg-primary-500 px-sm py-1">
            <Text className="text-tag font-medium uppercase text-text-on-primary">
              Most Popular
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

/** Spec §6.17: Free plan ticks read muted, Pro plan ticks read in the brand. */
function FeatureMark({ value, accent }: { value: string | boolean; accent: boolean }) {
  if (value === false) {
    return <Minus size={16} color={color.textMuted} />;
  }
  return <Check size={16} color={accent ? color.primary500 : color.textMuted} strokeWidth={2.5} />;
}
