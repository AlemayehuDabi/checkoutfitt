import { Link, router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SocialButton } from "@/components/ui/social-button";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ScreenContainer scroll keyboardAware className="bg-[#F9F8F6]">
      <View className="grow px-2 pt-10">
        {/* Branding - matching the small uppercase style */}
        <Text className="text-center text-[12px] font-bold uppercase tracking-[2px] text-[#1A1A1A]">
          CheckoutFitt
        </Text>

        {/* Headline - Using Serif style for the "Old Money" look */}
        <View className="mt-12 items-center">
          <Text 
            style={{ fontFamily: 'System' }} // In production, use a Serif font like Playfair Display
            className="text-center text-[34px] leading-[40px] text-[#1A1A1A]"
          >
            Welcome back
          </Text>
          <Text className="mt-3 text-center text-[16px] text-[#666666]">
            Start your style journey today.
          </Text>
        </View>

        {/* Form */}
        <View className="mt-10 gap-y-5">
          <Input
            label="Email address"
            placeholder="email@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <View>
            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
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
          <Button label="Sign In" onPress={() => router.push("/home")} variant="primary"/>
          
          <View className="my-8 flex-row items-center">
            <View className="h-[1px] flex-1 bg-[#E5E5E5]" />
            <Text className="px-4 text-[13px] text-[#999999]">or continue with</Text>
            <View className="h-[1px] flex-1 bg-[#E5E5E5]" />
          </View>

          <View className="gap-y-3">
            <SocialButton provider="apple" />
            <SocialButton provider="google" />
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