import { Sparkles } from "lucide-react-native";
import { Text, View } from "react-native";

import { OutfitCard } from "@/components/outfit/outfit-card";
import { useOutfits } from "@/context/outfits-context";
import type { ChatMessage } from "@/types";

import { color, radius } from "@/design";
import { AppImage } from "@/components/ui/app-image";

/**
 * Spec §6.13. Both bubbles round at 16px on three corners and tuck to 4px on
 * the corner nearest their speaker, so the tail reads without drawing one.
 */
const USER_RADIUS = {
  borderTopLeftRadius: radius.lg,
  borderTopRightRadius: radius.lg,
  borderBottomRightRadius: 4,
  borderBottomLeftRadius: radius.lg,
};

const AI_RADIUS = {
  borderTopLeftRadius: radius.lg,
  borderTopRightRadius: radius.lg,
  borderBottomRightRadius: radius.lg,
  borderBottomLeftRadius: 4,
};

export function ChatBubble({ message }: { message: ChatMessage }) {
  const { toggleSave, isSaved } = useOutfits();
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <View className="flex-row justify-end px-lg">
        <View className="max-w-[75%] gap-sm">
          {message.imageUri ? (
            <AppImage
              source={{ uri: message.imageUri }}
              style={USER_RADIUS}
              className="h-40 w-40 self-end bg-surface-secondary"
              contentFit="cover"
            />
          ) : null}
          {message.text ? (
            <View style={USER_RADIUS} className="bg-primary-500 px-lg py-md">
              <Text className="text-body text-text-on-primary">{message.text}</Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-end gap-sm px-lg">
      {/* Spec §6.10: 36px circular avatar with a 2px hairline ring. */}
      <View className="h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-primary-50">
        <Sparkles size={16} color={color.primary500} />
      </View>
      <View className="max-w-[82%] gap-md">
        {message.text ? (
          <View style={AI_RADIUS} className="bg-surface-secondary px-lg py-md">
            <Text className="text-body text-text-primary">{message.text}</Text>
          </View>
        ) : null}
        {/* An assistant bubble can carry a full nested outfit card. */}
        {message.outfit ? (
          <OutfitCard
            outfit={message.outfit}
            saved={isSaved(message.outfit.id)}
            onToggleSave={() => toggleSave(message.outfit!)}
            variant="compact"
          />
        ) : null}
      </View>
    </View>
  );
}
