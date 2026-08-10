import { Link, router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Input } from "@/components/ui/input";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SocialButton } from "@/components/ui/social-button";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = {
  email?: string;
  password?: string;
};

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const validate = () => {
    const nextErrors: Errors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    } else if (password.length < 6) {
      nextErrors.password = "Use at least 6 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSignUp = () => {
    if (!validate()) return;
    router.push("/permissions");
  };

  return (
    <ScreenContainer scroll keyboardAware>
      <View className="flex-1 pt-16">
        <Text className="text-3xl font-bold tracking-tight text-ink">Create your account</Text>
        <Text className="mt-2 text-base text-muted">
          Join CheckoutFitt and let your AI stylist take it from here.
        </Text>

        <View className="mt-10 gap-5">
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
            keyboardType="email-address"
          />
          <Input
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
            secureToggle
          />
        </View>

        <Button label="Sign Up" onPress={handleSignUp} className="mt-8" />

        <View className="mt-8 gap-5">
          <Divider label="or continue with" />
          <View className="flex-row gap-3">
            <SocialButton provider="apple" />
            <SocialButton provider="google" />
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-center gap-1.5 pb-2 pt-8">
        <Text className="text-sm text-muted">Already have an account?</Text>
        <Link href="/login" replace asChild>
          <Text className="text-sm font-semibold text-clay active:opacity-70" suppressHighlighting>
            Log In
          </Text>
        </Link>
      </View>
    </ScreenContainer>
  );
}
