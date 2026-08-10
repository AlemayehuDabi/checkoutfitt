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
  className?: string;
  edges?: Edge[];
};

export function ScreenContainer({
  children,
  scroll = false,
  keyboardAware = false,
  className = "",
  edges = ["top", "bottom", "left", "right"],
}: ScreenContainerProps) {
  const content = scroll ? (
    <ScrollView
      className={`flex-1 bg-sand ${className}`}
      contentContainerClassName="flex-grow px-6 pb-8"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 bg-sand px-6 ${className}`}>{children}</View>
  );

  const body = keyboardAware ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {content}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView edges={edges} className="flex-1 bg-sand">
      {body}
    </SafeAreaView>
  );
}
