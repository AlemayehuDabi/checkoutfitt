import { router } from "expo-router";
import { Check, Crown, X } from "lucide-react-native";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { ScreenContainer } from "@/components/ui/screen-container";

import { color } from "@/design";

const FEATURES = [
  "Unlimited AI stylist conversations",
  "Capsule wardrobe & trip packing builder",
  "Priority outfit generation, no waiting",
  "Unlimited digital closet items",
];

export default function ChatPaywallScreen() {
  return (
    <ScreenContainer>
      <View className="h-14 flex-row justify-end">
        <IconButton accessibilityLabel="Close" onPress={() => router.back()}>
          <X size={24} color={color.textPrimary} />
        </IconButton>
      </View>

      <View className="flex-1 items-center pt-lg">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-100">
          <Crown size={32} color={color.primary500} />
        </View>
        <Text className="mt-2xl text-center text-h1 font-bold text-text-primary">Upgrade to Pro</Text>
        <Text className="mt-sm text-center text-body text-text-muted">
          Unlock your AI stylist&apos;s full closet of tricks.
        </Text>

        <View className="mt-3xl w-full gap-lg">
          {FEATURES.map((feature) => (
            <View key={feature} className="flex-row items-center gap-md">
              <View className="h-6 w-6 items-center justify-center rounded-full bg-primary-50">
                <Check size={14} color={color.primary500} />
              </View>
              <Text className="flex-1 text-body text-text-primary">{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="gap-md pb-lg">
        <Button label="Upgrade for $9.99/mo" onPress={() => router.back()} />
        <Button label="Maybe Later" variant="ghost" onPress={() => router.back()} />
      </View>
    </ScreenContainer>
  );
}
