import { router } from "expo-router";
import {
  Bell,
  ChevronRight,
  Crown,
  Info,
  LifeBuoy,
  Lock,
  LogOut,
  MapPin,
  Palette,
  Sparkles,
  Wand2,
} from "lucide-react-native";
import { type ReactNode, useState } from "react";
import { Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { ConfirmSheet } from "@/components/ui/confirm-sheet";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { useWeather } from "@/context/weather-context";
import { color, motion } from "@/design";

const MOCK_ACCOUNT = { name: "Alex Morgan", email: "alex@checkoutfitt.com" };

export default function ProfileScreen() {
  const { locationName } = useWeather();
  const [logoutVisible, setLogoutVisible] = useState(false);

  return (
    <ScreenContainer scroll edges={["top", "left", "right"]}>
      <Text className="pb-lg pt-2xl text-h1 font-bold text-text-primary">Profile</Text>

      {/* Spec §6.10: a 64px circular avatar with a 2px hairline ring. */}
      <View className="flex-row items-center gap-lg">
        <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-primary-100">
          <Text className="text-h2 font-bold text-primary-700">AM</Text>
        </View>
        <View className="flex-1">
          <Text className="text-h3 font-semibold text-text-primary">{MOCK_ACCOUNT.name}</Text>
          <Text className="mt-0.5 text-caption text-text-muted">{MOCK_ACCOUNT.email}</Text>
          <View className="mt-sm h-7 items-center justify-center self-start rounded-full bg-surface-secondary px-md">
            <Text className="text-tag font-medium text-text-secondary">Edit Profile</Text>
          </View>
        </View>
      </View>

      {/* Spec §6.16 Pro banner: primary-100 fill, primary-200 hairline, crown. */}
      <PressableScale
        onPress={() => router.push("/profile/subscription")}
        pressScale={motion.pressScale.md}
        pressOpacity={1}
        accessibilityRole="button"
        className="mt-2xl flex-row items-start gap-lg rounded-lg border border-primary-200 bg-primary-100 p-lg"
      >
        <View className="flex-1">
          <Text className="text-h3 font-semibold text-primary-700">
            Upgrade to CheckoutFitt Pro
          </Text>
          <Text className="mt-1 text-caption text-primary-600">
            Unlock unlimited outfits, advanced AI insights, and more.
          </Text>
          <View className="mt-md h-9 items-center justify-center self-start rounded-full border-[1.5px] border-primary-500 px-lg">
            <Text className="text-tag font-semibold text-text-accent">Upgrade Now</Text>
          </View>
        </View>
        <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-200">
          <Crown size={22} color={color.primary500} strokeWidth={1.75} />
        </View>
      </PressableScale>

      <SectionHeader title="Styling tools" className="mt-3xl" />
      <Card className="px-lg">
        <SettingsRow
          icon={<Wand2 size={17} color={color.primary500} strokeWidth={1.75} />}
          label="The Studio"
          value="All tools"
          onPress={() => router.push("/studio")}
        />
        <RowDivider />
        <SettingsRow
          icon={<Sparkles size={17} color={color.primary500} strokeWidth={1.75} />}
          label="Style Coach"
          onPress={() => router.push("/coach")}
        />
        <RowDivider />
        <SettingsRow
          icon={<Palette size={17} color={color.primary500} strokeWidth={1.75} />}
          label="Colour Analysis"
          onPress={() => router.push("/color")}
        />
      </Card>

      <SectionHeader title="Preferences" className="mt-3xl" />
      <Card className="px-lg">
        <SettingsRow
          icon={<Bell size={17} color={color.textSecondary} strokeWidth={1.75} />}
          label="Notifications"
          onPress={() => router.push("/profile/notifications")}
        />
        <RowDivider />
        <SettingsRow
          icon={<MapPin size={17} color={color.textSecondary} strokeWidth={1.75} />}
          label="Location"
          value={locationName ?? "Not set"}
          onPress={() => router.push("/location")}
        />
      </Card>

      <SectionHeader title="Support" className="mt-3xl" />
      <Card className="px-lg">
        <SettingsRow
          icon={<Lock size={17} color={color.textSecondary} strokeWidth={1.75} />}
          label="Privacy & Security"
          onPress={() => {}}
        />
        <RowDivider />
        <SettingsRow
          icon={<LifeBuoy size={17} color={color.textSecondary} strokeWidth={1.75} />}
          label="Help & Support"
          onPress={() => {}}
        />
        <RowDivider />
        <SettingsRow
          icon={<Info size={17} color={color.textSecondary} strokeWidth={1.75} />}
          label="About CheckoutFitt"
          onPress={() => {}}
        />
      </Card>

      <PressableScale
        onPress={() => setLogoutVisible(true)}
        pressScale={0.98}
        accessibilityRole="button"
        className="mt-2xl h-[52px] flex-row items-center justify-center gap-sm rounded-lg bg-danger-light"
      >
        <LogOut size={18} color={color.danger} strokeWidth={2} />
        <Text className="text-body font-semibold text-danger">Log Out</Text>
      </PressableScale>

      <Text className="mb-lg mt-2xl text-center text-caption text-text-muted">
        About CheckoutFitt · Version 1.2.0
      </Text>

      <ConfirmSheet
        visible={logoutVisible}
        title="Log out?"
        message="You'll need to sign back in to access your closet and saved outfits."
        confirmLabel="Log Out"
        destructive
        onConfirm={() => setLogoutVisible(false)}
        onCancel={() => setLogoutVisible(false)}
      />
    </ScreenContainer>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      pressScale={0.99}
      pressOpacity={0.75}
      className="h-14 flex-row items-center gap-md"
    >
      {/* Spec §6.7: the glyph sits in a 40px rounded tile on the leading edge. */}
      <IconWell size="md" tone="sunken">
        {icon}
      </IconWell>
      <Text className="flex-1 text-body font-medium text-text-primary">{label}</Text>
      {value ? <Text className="text-caption text-text-muted">{value}</Text> : null}
      <ChevronRight size={16} color={color.textMuted} />
    </PressableScale>
  );
}

function RowDivider() {
  // Indented past the icon well so the rule reads as grouping, not division.
  return <View className="ml-[52px] h-px bg-border" />;
}
