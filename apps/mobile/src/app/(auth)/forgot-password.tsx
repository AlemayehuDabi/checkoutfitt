import { router } from "expo-router";
import { MailCheck } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { IconWell } from "@/components/ui/icon-well";
import { Input } from "@/components/ui/input";
import { ScreenContainer } from "@/components/ui/screen-container";
import { useAuth } from "@/context/auth-context";
import { color } from "@/design";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const { forgotPassword, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }

    setError(undefined);
    clearError();
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send reset email";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll keyboardAware>
      <View className="grow pt-2xl">
        <Header showBack />

        {sent ? (
          <View className="grow items-center justify-center py-4xl">
            <IconWell size="2xl" round>
              <MailCheck size={32} color={color.primary500} />
            </IconWell>
            <Text className="mt-2xl text-center text-h1 font-bold text-text-primary">
              Check your email
            </Text>
            <Text className="mt-sm text-center text-body text-text-muted">
              We sent a password reset link to{"\n"}
              <Text className="font-semibold text-text-primary">{email}</Text>
            </Text>
            <Button
              label="Back to Log In"
              variant="secondary"
              onPress={() => router.replace("/login")}
              className="mt-4xl w-full"
            />
          </View>
        ) : (
          <View className="mt-lg">
            <Text className="text-h1 font-bold text-text-primary">Forgot password?</Text>
            <Text className="mt-sm text-body text-text-muted">
              Enter the email linked to your account and we&apos;ll send you a reset link.
            </Text>

            <View className="mt-3xl">
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
                autoCapitalize="none"
              />
            </View>

            <Button
              label="Send Reset Link"
              onPress={handleSend}
              loading={loading}
              className="mt-3xl"
            />
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
