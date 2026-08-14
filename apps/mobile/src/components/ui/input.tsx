import { Eye, EyeOff } from "lucide-react-native";
import { type ReactNode, useState } from "react";
import { Pressable, Text, TextInput, type TextInputProps, View } from "react-native";

import { color } from "@/design";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  secureToggle?: boolean;
  /** Leading slot, e.g. a link or search icon. */
  icon?: ReactNode;
  /** Grows the field for pasted URLs and notes. */
  multiline?: boolean;
  containerClassName?: string;
};

export function Input({
  label,
  error,
  hint,
  secureToggle,
  secureTextEntry,
  icon,
  multiline,
  containerClassName = "",
  ...rest
}: InputProps) {
  const [hidden, setHidden] = useState(!!secureTextEntry);

  return (
    <View className={`w-full ${containerClassName}`}>
      {label ? (
        <Text className="mb-2 text-micro font-semibold uppercase text-muted">{label}</Text>
      ) : null}
      <View
        className={`flex-row items-center rounded-2xl border bg-surface px-4 ${
          multiline ? "min-h-24 py-3" : "h-14"
        } ${error ? "border-danger" : "border-line"}`}
      >
        {icon ? <View className="mr-2.5">{icon}</View> : null}
        <TextInput
          className="flex-1 text-body text-ink"
          placeholderTextColor={color.faint}
          secureTextEntry={secureToggle ? hidden : secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          {...rest}
        />
        {secureToggle ? (
          <Pressable
            hitSlop={8}
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            onPress={() => setHidden((prev) => !prev)}
            className="ml-2 active:opacity-60"
          >
            {hidden ? (
              <EyeOff size={19} color={color.muted} />
            ) : (
              <Eye size={19} color={color.muted} />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text className="mt-1.5 text-caption text-danger">{error}</Text>
      ) : hint ? (
        <Text className="mt-1.5 text-caption text-muted">{hint}</Text>
      ) : null}
    </View>
  );
}
