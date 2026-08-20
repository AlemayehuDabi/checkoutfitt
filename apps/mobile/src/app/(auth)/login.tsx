import { Link, router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SocialButton } from "@/components/ui/social-button";
import { useAuth } from "@/context/auth-context";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const { signIn, socialSignIn, isLoading, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const validate = () => {
    if (!email.trim()) {
      setFormError("Email address is required");
      return false;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setFormError("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setFormError("Password is required");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSignIn = async () => {
    if (!validate()) return;
    try {
      clearError();
      await signIn({ email: email.trim(), password });
      router.replace("/home");
    } catch {
      // Auth error is captured in context
    }
  };

  const handleSocialSignIn = async (provider: "apple" | "google") => {
    try {
      clearError();
      setFormError(null);
      await socialSignIn(provider, {});
      router.replace("/home");
    } catch {
      // Auth error is captured in context
    }
  };

  const errorMessage = formError || authError;

  return (
    <ScreenContainer scroll keyboardAware className="bg-[#F9F8F6]">
      <View className="grow px-2 pt-10">
        {/* Branding */}
        <Text className="text-center text-[12px] font-bold uppercase tracking-[2px] text-[#1A1A1A]">
          CheckoutFitt
        </Text>

        {/* Headline */}
        <View className="mt-12 items-center">
          <Text
            style={{ fontFamily: "System", lineHeight: 40 }}
            className="text-center text-[34px] text-[#1A1A1A]"
          >
            Welcome back
          </Text>
          <Text className="mt-3 text-center text-[16px] text-[#666666]">
            Start your style journey today.
          </Text>
        </View>

        {/* Error Banner */}
        {errorMessage ? (
          <View className="mt-6 rounded-xl bg-red-50 p-4 border border-red-200">
            <Text className="text-center text-[14px] text-red-600 font-medium">
              {errorMessage}
            </Text>
          </View>
        ) : null}

        {/* Form */}
        <View className="mt-8 gap-y-5">
          <Input
            label="Email address"
            placeholder="email@example.com"
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              if (formError || authError) {
                setFormError(null);
                clearError();
              }
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View>
            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                if (formError || authError) {
                  setFormError(null);
                  clearError();
                }
              }}
              secureToggle
            />
            <Link href="/forgot-password" asChild>
              <Text className="mt-3 self-end text-[13px] font-medium text-[#666666]">
                Forgot password?
              </Text>
            </Link>
          </View>
        </View>

        {/* CTAs */}
        <View className="mt-10">
          <Button
            label="Sign In"
            onPress={handleSignIn}
            loading={isLoading}
            variant="primary"
          />

          <View className="my-8 flex-row items-center">
            <View className="h-[1px] flex-1 bg-[#E5E5E5]" />
            <Text className="px-4 text-[13px] text-[#999999]">or continue with</Text>
            <View className="h-[1px] flex-1 bg-[#E5E5E5]" />
          </View>

          <View className="gap-y-3">
            <SocialButton provider="apple" onPress={() => handleSocialSignIn("apple")} />
            <SocialButton provider="google" onPress={() => handleSocialSignIn("google")} />
          </View>
        </View>

        {/* Footer */}
        <View className="mt-12 flex-row justify-center pb-10">
          <Text className="text-[14px] text-[#666666]">Don't have an account? </Text>
          <Link href="/sign-up" asChild>
            <Text className="text-[14px] font-bold text-[#C4572D]">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScreenContainer>
  );
}