import { router } from "expo-router";
import { ArrowLeft, MailCheck } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScreenContainer } from "@/components/ui/screen-container";

import { color } from "@/design";
import { IconWell } from "@/components/ui/icon-well";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }

    setError(undefined);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  return (
    <ScreenContainer scroll keyboardAware>
      <View className="flex-1 pt-6">
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-surface-sunken"
        >
          <ArrowLeft size={22} color={color.ink} />
        </Pressable>

        {sent ? (
          <View className="flex-1 items-center justify-center px-4">
            <IconWell size="2xl"><MailCheck size={32} color={color.primary} /></IconWell>
            <Text className="mt-6 text-center text-2xl font-bold text-ink">
              Check your email
            </Text>
            <Text className="mt-2 text-center text-base leading-6 text-muted">
              We sent a password reset link to{"\n"}
              <Text className="font-semibold text-ink">{email}</Text>
            </Text>
            <Button
              label="Back to Log In"
              variant="outline"
              onPress={() => router.replace("/login")}
              className="mt-10 w-full"
            />
          </View>
        ) : (
          <View className="mt-4">
            <Text className="text-3xl font-bold text-ink">Forgot password?</Text>
            <Text className="mt-2 text-base text-muted">
              Enter the email linked to your account and we&apos;ll send you a reset link.
            </Text>

            <View className="mt-10">
              <Input
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (error) setError(undefined);
                }}
                error={error}
                keyboardType="email-address"
              />
            </View>

            <Button
              label="Send Reset Link"
              onPress={handleSend}
              loading={loading}
              className="mt-8"
            />
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
