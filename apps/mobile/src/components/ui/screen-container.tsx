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
  const background = dark ? "bg-surface-inverse" : "bg-bg";
  const gutter = bleed ? "" : "px-gutter";

  const content = scroll ? (
    <ScrollView
      className={`flex-1 ${background} ${className}`}
      contentContainerClassName={`flex-grow ${gutter} pb-4xl ${contentClassName}`}
      keyboardShouldPersistTaps="handled"
      // Dismissing on drag replaces the TouchableWithoutFeedback that used to
      // wrap this ScrollView. That wrapper sat in the touch path of every
      // control on the screen and delayed press feedback.
      keyboardDismissMode={keyboardAware ? "on-drag" : "none"}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${background} ${gutter} ${className}`}>{children}</View>
  );

  const body = keyboardAware ? (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      {scroll ? (
        content
      ) : (
        // Non-scrolling forms keep tap-to-dismiss, where there's no scroll
        // gesture for the wrapper to interfere with.
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          {content}
        </TouchableWithoutFeedback>
      )}
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
