import { Eye, EyeOff } from "lucide-react-native";
import { type ReactNode, useState } from "react";
import {
  type BlurEvent,
  type FocusEvent,
  Pressable,
  Text,
  TextInput,
  type TextInputProps,
  type StyleProp,
  type TextStyle,
  View,
} from "react-native";

import { color, elevation, typography } from "@/design";

/**
 * Layout and type for the native field, as a stable style object.
 *
 * NativeWind's `flex-1` compiles to `{ flexBasis: "0%" }`. Inside a
 * `flex-row items-center` chrome that collapses the TextInput to 0×0 on
 * Android — the bordered box still paints, but taps never hit the field.
 * Setting flex/height here, and not via `className`, keeps the hit target
 * the full 52px. The object is module-scoped so NativeWind's style guard
 * does not see a new identity on every keystroke and remount the field.
 */
const fieldTextStyle: TextStyle = {
  flex: 1,
  alignSelf: "stretch",
  paddingVertical: 0,
  margin: 0,
  fontSize: typography.body.size,
  lineHeight: typography.body.lineHeight,
  color: color.textPrimary,
  includeFontPadding: false,
};

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  secureToggle?: boolean;
  /** Leading slot, e.g. an envelope, lock or location pin. Rendered at 20px. */
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
  style,
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
        {icon ? <View className="mr-md">{icon}</View> : null}
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          {...rest}
          style={
            style
              ? ([fieldTextStyle, style] as StyleProp<TextStyle>)
              : fieldTextStyle
          }
          placeholderTextColor={color.textMuted}
          secureTextEntry={secureToggle ? hidden : secureTextEntry}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
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
