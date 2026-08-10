import { router } from "expo-router";
import { Check, Crown, Minus } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Header } from "@/components/ui/header";
import { ScreenContainer } from "@/components/ui/screen-container";

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

export default function SubscriptionScreen() {
  const [plan, setPlan] = useState("yearly");

  return (
    <ScreenContainer scroll>
      <Header title="CheckoutFitt Pro" />

      <View className="items-center pt-2">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-ink">
          <Crown size={26} color="#FAF8F5" />
        </View>
        <Text className="mt-5 text-center text-2xl font-bold tracking-tight text-ink">
          Unlock your full closet
        </Text>
        <Text className="mt-2 text-center text-base leading-6 text-muted">
          Compare plans and upgrade any time. Cancel whenever you want.
        </Text>
      </View>

      <Card className="mt-8 overflow-hidden">
        <View className="flex-row border-b border-line bg-sand-100 px-4 py-3">
          <Text className="flex-1 text-xs font-semibold uppercase tracking-wide text-muted">Feature</Text>
          <Text className="w-16 text-center text-xs font-semibold uppercase tracking-wide text-muted">
            Free
          </Text>
          <Text className="w-16 text-center text-xs font-semibold uppercase tracking-wide text-clay">
            Pro
          </Text>
        </View>
        {FEATURES.map((feature, index) => (
          <View
            key={feature.label}
            className={`flex-row items-center px-4 py-3.5 ${
              index === FEATURES.length - 1 ? "" : "border-b border-line"
            }`}
          >
            <Text className="flex-1 pr-2 text-sm text-ink">{feature.label}</Text>
            <View className="w-16 items-center">
              <FeatureValue value={feature.free} />
            </View>
            <View className="w-16 items-center">
              <FeatureValue value={feature.pro} accent />
            </View>
          </View>
        ))}
      </Card>

      <View className="mt-8 flex-row gap-3">
        {PLANS.map((option) => (
          <Chip key={option.key} label={`${option.label} · ${option.price}`} selected={plan === option.key} onPress={() => setPlan(option.key)} />
        ))}
      </View>

      <Button
        label={plan === "yearly" ? "Start Yearly Plan" : "Start Monthly Plan"}
        onPress={() => router.back()}
        className="mb-2 mt-8"
      />
      <Button label="Maybe Later" variant="ghost" onPress={() => router.back()} className="mb-4" />
    </ScreenContainer>
  );
}

function FeatureValue({ value, accent = false }: { value: string | boolean; accent?: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check size={16} color={accent ? "#C1622D" : "#1A1917"} />
    ) : (
      <Minus size={16} color="#8A8580" />
    );
  }

  return (
    <Text className={`text-xs font-semibold ${accent ? "text-clay-700" : "text-ink-soft"}`}>{value}</Text>
  );
}
