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
import { Pressable, Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { ConfirmSheet } from "@/components/ui/confirm-sheet";
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
      <Text className="pb-2 pt-6 text-2xl font-bold text-ink">Profile</Text>

      <Card className="flex-row items-center gap-4 p-5">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-ink">
          <Text className="text-lg font-bold text-white">AM</Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-ink">{MOCK_ACCOUNT.name}</Text>
          <Text className="mt-0.5 text-sm text-muted">{MOCK_ACCOUNT.email}</Text>
        </View>
      </Card>

      <Pressable
        onPress={() => router.push("/profile/subscription")}
        className="mt-4 flex-row items-center gap-4 rounded-2xl bg-ink p-5 active:opacity-90"
      >
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-white/15">
          <Crown size={20} color={color.canvas} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-white">Upgrade to Pro</Text>
          <Text className="mt-0.5 text-sm text-white/60">Unlimited styling, closet & chat</Text>
        </View>
        <ChevronRight size={18} color={color.canvas} />
      </Pressable>

      <SectionHeader title="Styling tools" className="mt-8" />
      <Card>
        <SettingsRow
          icon={<Wand2 size={18} color={color.ink} />}
          label="The Studio"
          value="All tools"
          onPress={() => router.push("/studio")}
        />
        <RowDivider />
        <SettingsRow
          icon={<Sparkles size={18} color={color.ink} />}
          label="Style Coach"
          onPress={() => router.push("/coach")}
        />
        <RowDivider />
        <SettingsRow
          icon={<Palette size={18} color={color.ink} />}
          label="Colour Analysis"
          onPress={() => router.push("/color")}
        />
      </Card>

      <SectionHeader title="Preferences" className="mt-7" />
      <Card>
        <SettingsRow
          icon={<Bell size={18} color={color.ink} />}
          label="Notifications"
          onPress={() => router.push("/profile/notifications")}
        />
        <RowDivider />
        <SettingsRow
          icon={<MapPin size={18} color={color.ink} />}
          label="Location"
          value={locationName ?? "Not set"}
          onPress={() => router.push("/location")}
        />
      </Card>

      <SectionHeader title="Support" className="mt-7" />
      <Card>
        <SettingsRow icon={<Lock size={18} color={color.ink} />} label="Privacy & Security" onPress={() => {}} />
        <RowDivider />
        <SettingsRow icon={<LifeBuoy size={18} color={color.ink} />} label="Help & Support" onPress={() => {}} />
        <RowDivider />
        <SettingsRow icon={<Info size={18} color={color.ink} />} label="About CheckoutFitt" onPress={() => {}} />
      </Card>

      <Pressable
        onPress={() => setLogoutVisible(true)}
        className="mb-4 mt-6 flex-row items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-4 active:bg-surface-sunken"
      >
        <LogOut size={18} color={color.danger} />
        <Text className="text-base font-semibold text-danger">Log Out</Text>
      </Pressable>

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
    <Pressable onPress={onPress} className="flex-row items-center gap-3 px-4 py-3.5 active:bg-surface-sunken">
      {icon}
      <Text className="flex-1 text-base text-ink">{label}</Text>
      {value ? <Text className="text-sm text-muted">{value}</Text> : null}
      <ChevronRight size={16} color={color.muted} />
    </Pressable>
  );
}

function RowDivider() {
  return <View className="h-px bg-line" style={{ marginLeft: 52 }} />;
}
