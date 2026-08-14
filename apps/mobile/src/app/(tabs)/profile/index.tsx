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
import { color } from "@/design";

const MOCK_ACCOUNT = { name: "Alex Morgan", email: "alex@checkoutfitt.com" };

export default function ProfileScreen() {
  const { locationName } = useWeather();
  const [logoutVisible, setLogoutVisible] = useState(false);

  return (
    <ScreenContainer scroll edges={["top", "left", "right"]}>
      <Text className="pb-2 pt-6 text-h1 font-bold text-ink">Profile</Text>

      <Card raise="sm" className="flex-row items-center gap-4 p-5">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-ink">
          <Text className="text-body-lg font-bold text-canvas">AM</Text>
        </View>
        <View className="flex-1">
          <Text className="text-body-lg font-semibold text-ink">{MOCK_ACCOUNT.name}</Text>
          <Text className="mt-0.5 text-body-sm text-muted">{MOCK_ACCOUNT.email}</Text>
        </View>
      </Card>

      <Card
        tone="inverse"
        raise="lg"
        onPress={() => router.push("/profile/subscription")}
        className="mt-4 flex-row items-center gap-4 p-5"
      >
        <IconWell size="md" tone="translucent" className="h-12 w-12">
          <Crown size={20} color={color.canvas} strokeWidth={1.75} />
        </IconWell>
        <View className="flex-1">
          <Text className="text-body-lg font-semibold text-canvas">Upgrade to Pro</Text>
          <Text className="mt-0.5 text-caption text-faint">Unlimited styling, closet & chat</Text>
        </View>
        <ChevronRight size={18} color={color.faint} />
      </Card>

      <SectionHeader title="Styling tools" className="mt-8" />
      <Card className="px-4">
        <SettingsRow
          icon={<Wand2 size={17} color={color.primary} strokeWidth={1.75} />}
          label="The Studio"
          value="All tools"
          onPress={() => router.push("/studio")}
        />
        <RowDivider />
        <SettingsRow
          icon={<Sparkles size={17} color={color.primary} strokeWidth={1.75} />}
          label="Style Coach"
          onPress={() => router.push("/coach")}
        />
        <RowDivider />
        <SettingsRow
          icon={<Palette size={17} color={color.primary} strokeWidth={1.75} />}
          label="Colour Analysis"
          onPress={() => router.push("/color")}
        />
      </Card>

      <SectionHeader title="Preferences" className="mt-7" />
      <Card className="px-4">
        <SettingsRow
          icon={<Bell size={17} color={color.ink} strokeWidth={1.75} />}
          label="Notifications"
          onPress={() => router.push("/profile/notifications")}
        />
        <RowDivider />
        <SettingsRow
          icon={<MapPin size={17} color={color.ink} strokeWidth={1.75} />}
          label="Location"
          value={locationName ?? "Not set"}
          onPress={() => router.push("/location")}
        />
      </Card>

      <SectionHeader title="Support" className="mt-7" />
      <Card className="px-4">
        <SettingsRow
          icon={<Lock size={17} color={color.ink} strokeWidth={1.75} />}
          label="Privacy & Security"
          onPress={() => {}}
        />
        <RowDivider />
        <SettingsRow
          icon={<LifeBuoy size={17} color={color.ink} strokeWidth={1.75} />}
          label="Help & Support"
          onPress={() => {}}
        />
        <RowDivider />
        <SettingsRow
          icon={<Info size={17} color={color.ink} strokeWidth={1.75} />}
          label="About CheckoutFitt"
          onPress={() => {}}
        />
      </Card>

      <PressableScale
        onPress={() => setLogoutVisible(true)}
        pressScale={0.98}
        className="mb-4 mt-6 flex-row items-center justify-center gap-2 rounded-2xl bg-danger-soft py-4"
      >
        <LogOut size={17} color={color.danger} strokeWidth={2} />
        <Text className="text-body font-semibold text-danger">Log Out</Text>
      </PressableScale>

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
      className="flex-row items-center gap-3 py-3.5"
    >
      <IconWell size="sm" tone="sunken">
        {icon}
      </IconWell>
      <Text className="flex-1 text-body text-ink">{label}</Text>
      {value ? <Text className="text-caption text-muted">{value}</Text> : null}
      <ChevronRight size={16} color={color.faint} />
    </PressableScale>
  );
}

function RowDivider() {
  // Indented past the icon well so the rule reads as grouping, not division.
  return <View className="ml-12 h-px bg-line" />;
}
