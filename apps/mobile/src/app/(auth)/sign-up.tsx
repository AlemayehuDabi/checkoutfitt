import { Link, router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Input } from "@/components/ui/input";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SocialButton } from "@/components/ui/social-button";
import { useAuth } from "@/context/auth-context";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = {
  name?: string;
  email?: string;
  password?: string;
};

export default function SignUpScreen() {
  const { signUp, socialSignIn, isLoading, error: authError, clearError } = useAuth();
  const [name, setName] = useState("");
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

  const handleSignUp = async () => {
    if (!validate()) return;
    try {
      clearError();
      await signUp({
        name: name.trim() || undefined,
        email: email.trim(),
        password,
      });
      router.replace("/permissions");
    } catch {
      // Auth error handled in context
    }
  };

  const handleSocialSignIn = async (provider: "apple" | "google") => {
    try {
      clearError();
      await socialSignIn(provider, {});
      router.replace("/permissions");
    } catch {
      // Auth error handled in context
    }
  };

  return (
    <ScreenContainer scroll keyboardAware>
      <View className="grow pt-4xl">
        <Text className="text-eyebrow font-semibold uppercase text-primary-500">CheckoutFitt</Text>
        <Text className="mt-md text-h1 font-bold text-text-primary">Create your account</Text>
        <Text className="mt-sm text-body text-text-muted">
          Join CheckoutFitt and let your AI stylist take it from here.
        </Text>

        {authError ? (
          <View className="mt-xl rounded-xl bg-red-50 p-4 border border-red-200">
            <Text className="text-center text-caption text-red-600 font-medium">{authError}</Text>
          </View>
        ) : null}

        <View className="mt-3xl gap-xl">
          <Input
            label="Full Name (Optional)"
            placeholder="Jane Doe"
            value={name}
            onChangeText={(value) => {
              setName(value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              if (authError) clearError();
            }}
            error={errors.name}
          />
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              if (authError) clearError();
            }}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              if (authError) clearError();
            }}
            error={errors.password}
            secureToggle
          />
        </View>

        <Button
          label="Sign Up"
          onPress={handleSignUp}
          loading={isLoading}
          className="mt-3xl"
        />

        <View className="mt-3xl gap-xl">
          <Divider label="or continue with" />
          <View className="gap-md">
            <SocialButton provider="apple" onPress={() => handleSocialSignIn("apple")} />
            <SocialButton provider="google" onPress={() => handleSocialSignIn("google")} />
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
