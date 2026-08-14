import { type ReactNode } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { type Edge, SafeAreaView } from "react-native-safe-area-context";

type ScreenContainerProps = {
  children: ReactNode;
  scroll?: boolean;
  keyboardAware?: boolean;
  /** Drops the horizontal gutter — for full-bleed media screens. */
  bleed?: boolean;
  /** Inverse canvas, for camera and immersive screens. */
  dark?: boolean;
  className?: string;
  contentClassName?: string;
  edges?: Edge[];
};

export function ScreenContainer({
  children,
  scroll = false,
  keyboardAware = false,
  bleed = false,
  dark = false,
  className = "",
  contentClassName = "",
  edges = ["top", "bottom", "left", "right"],
}: ScreenContainerProps) {
  const background = dark ? "bg-surface-inverse" : "bg-canvas";
  const gutter = bleed ? "" : "px-gutter";

  const content = scroll ? (
    <ScrollView
      className={`flex-1 ${background} ${className}`}
      contentContainerClassName={`flex-grow ${gutter} pb-10 ${contentClassName}`}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${background} ${gutter} ${className}`}>{children}</View>
  );

  const body = keyboardAware ? (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {content}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView edges={edges} className={`flex-1 ${background}`}>
      {body}
    </SafeAreaView>
  );
}
