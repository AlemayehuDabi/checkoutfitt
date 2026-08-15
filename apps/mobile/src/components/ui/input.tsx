import { Eye, EyeOff } from "lucide-react-native";
import { type ReactNode, useState } from "react";
import {
  type BlurEvent,
  type FocusEvent,
  Pressable,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

import { color, elevation } from "@/design";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  secureToggle?: boolean;
  /** Trailing slot, e.g. a location pin or calendar glyph. Rendered at 20px. */
  icon?: ReactNode;
  /** Grows the field for pasted URLs and notes. */
  multiline?: boolean;
  containerClassName?: string;
};

/**
 * Spec §6.4. 52px tall, 12px radius, hairline border. Focus moves the border to
 * the brand colour and adds the lightest shadow step — enough that the active
 * field reads as raised out of the form without the whole stack looking busy.
 */
export function Input({
  label,
  error,
  hint,
  secureToggle,
  secureTextEntry,
  icon,
  multiline,
  containerClassName = "",
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [hidden, setHidden] = useState(!!secureTextEntry);
  const [focused, setFocused] = useState(false);

  const handleFocus = (event: FocusEvent) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: BlurEvent) => {
    setFocused(false);
    onBlur?.(event);
  };

  const border = error
    ? "border-danger"
    : focused
      ? "border-primary-500"
      : "border-border";

  return (
    <View className={`w-full ${containerClassName}`}>
      {label ? (
        <Text className="mb-1.5 text-caption font-medium text-text-secondary">{label}</Text>
      ) : null}
      <View
        style={focused && !error ? elevation.sm : undefined}
        className={`flex-row items-center rounded-md border bg-surface px-lg ${
          multiline ? "min-h-24 py-md" : "h-[52px]"
        } ${border}`}
      >
        <TextInput
          className="flex-1 text-body text-text-primary"
          placeholderTextColor={color.textMuted}
          secureTextEntry={secureToggle ? hidden : secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {icon ? <View className="ml-sm">{icon}</View> : null}
        {secureToggle ? (
          <Pressable
            hitSlop={8}
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            onPress={() => setHidden((prev) => !prev)}
            className="ml-sm active:opacity-60"
          >
            {hidden ? (
              <EyeOff size={20} color={color.textMuted} />
            ) : (
              <Eye size={20} color={color.textMuted} />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text className="mt-1.5 text-caption text-danger">{error}</Text>
      ) : hint ? (
        <Text className="mt-1.5 text-caption text-text-muted">{hint}</Text>
      ) : null}
    </View>
  );
}
