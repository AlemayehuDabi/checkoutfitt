import { Sparkles } from "lucide-react-native";
import { Image, Text, View } from "react-native";

import { OutfitCard } from "@/components/outfit/outfit-card";
import { useOutfits } from "@/context/outfits-context";
import type { ChatMessage } from "@/types";

import { color } from "@/design";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const { toggleSave, isSaved } = useOutfits();
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <View className="flex-row justify-end px-4">
        <View className="max-w-[80%] gap-2">
          {message.imageUri ? (
            <Image
              source={{ uri: message.imageUri }}
              className="h-40 w-40 self-end rounded-2xl rounded-br-md bg-surface-sunken"
              resizeMode="cover"
            />
          ) : null}
          {message.text ? (
            <View className="rounded-2xl rounded-br-md bg-ink px-4 py-3">
              <Text className="text-base text-white">{message.text}</Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-end gap-2 px-4">
      <View className="h-8 w-8 items-center justify-center rounded-full bg-primary-50">
        <Sparkles size={14} color={color.primary} />
      </View>
      <View className="max-w-[82%] gap-3">
        {message.text ? (
          <View className="rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-3">
            <Text className="text-base text-ink">{message.text}</Text>
          </View>
        ) : null}
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
