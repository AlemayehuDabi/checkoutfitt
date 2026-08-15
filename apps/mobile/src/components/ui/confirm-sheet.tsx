import { Modal, Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { elevation } from "@/design";

type ConfirmSheetProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Spec §6.12 bottom sheet: 24px top corners, a 36×4 drag handle in
 * `border-strong` centred above the content, and the heaviest shadow step.
 */
export function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable className="flex-1 justify-end bg-overlay" onPress={onCancel}>
        <Pressable
          style={elevation.xl}
          className="gap-xl rounded-t-2xl bg-surface px-xl pb-4xl pt-lg"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="h-1 w-9 self-center rounded-full bg-border-strong" />
          <View>
            <Text className="text-h2 font-bold text-text-primary">{title}</Text>
            <Text className="mt-sm text-body text-text-secondary">{message}</Text>
          </View>
          <View className="gap-md">
            <Button
              label={confirmLabel}
              variant={destructive ? "danger" : "primary"}
              onPress={onConfirm}
            />
            <Button label={cancelLabel} variant="ghost" onPress={onCancel} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
