import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, TextInput, type TextInputProps, View } from "react-native";

type InputProps = TextInputProps & {
  label: string;
  error?: string;
  secureToggle?: boolean;
};

export function Input({ label, error, secureToggle, secureTextEntry, ...rest }: InputProps) {
  const [hidden, setHidden] = useState(!!secureTextEntry);

  return (
    <View className="w-full">
      <Text className="mb-2 text-sm font-medium text-ink">{label}</Text>
      <View
        className={`h-14 flex-row items-center rounded-2xl border bg-white px-4 ${
          error ? "border-danger" : "border-line"
        }`}
      >
        <TextInput
          className="flex-1 text-base text-ink"
          placeholderTextColor="#8A8580"
          secureTextEntry={secureToggle ? hidden : secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          {...rest}
        />
        {secureToggle ? (
          <Pressable
            hitSlop={8}
            onPress={() => setHidden((prev) => !prev)}
            className="ml-2 active:opacity-60"
          >
            {hidden ? (
              <EyeOff size={20} color="#8A8580" />
            ) : (
              <Eye size={20} color="#8A8580" />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? <Text className="mt-1.5 text-xs text-danger">{error}</Text> : null}
    </View>
  );
}
