import { Modal, Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";

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
      <Pressable className="flex-1 justify-end bg-ink/40" onPress={onCancel}>
        <Pressable className="gap-5 rounded-t-3xl bg-white px-6 pb-10 pt-6" onPress={(e) => e.stopPropagation()}>
          <View className="self-center h-1 w-10 rounded-full bg-line" />
          <View>
            <Text className="text-xl font-bold tracking-tight text-ink">{title}</Text>
            <Text className="mt-2 text-base text-muted">{message}</Text>
          </View>
          <View className="gap-3">
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
