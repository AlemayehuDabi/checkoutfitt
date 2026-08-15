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
      <View className="flex-1 pt-4xl">
        <Text className="text-eyebrow font-semibold uppercase text-primary-500">CheckoutFitt</Text>
        <Text className="mt-md text-h1 font-bold text-text-primary">Create your account</Text>
        <Text className="mt-sm text-body text-text-muted">
          Join CheckoutFitt and let your AI stylist take it from here.
        </Text>

        <View className="mt-3xl gap-xl">
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

        <Button label="Sign Up" onPress={handleSignUp} className="mt-3xl" />

        <View className="mt-3xl gap-xl">
          <Divider label="or continue with" />
          <View className="flex-row gap-md">
            <SocialButton provider="apple" />
            <SocialButton provider="google" />
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-center gap-1.5 pb-sm pt-3xl">
        <Text className="text-caption text-text-muted">Already have an account?</Text>
        <Link href="/login" replace asChild>
          <Text
            className="text-caption font-semibold text-text-accent active:opacity-70"
            suppressHighlighting
          >
            Log In
          </Text>
        </Link>
      </View>
    </ScreenContainer>
  );
}
