import { Heart } from "lucide-react-native";
import { Text, View } from "react-native";

import { OutfitCard } from "@/components/outfit/outfit-card";
import { Header } from "@/components/ui/header";
import { ScreenContainer } from "@/components/ui/screen-container";
import { useOutfits } from "@/context/outfits-context";

export default function SavedOutfitsScreen() {
  const { savedOutfits, toggleSave, isSaved } = useOutfits();

  return (
    <ScreenContainer scroll={savedOutfits.length > 0}>
      <Header title="Saved Outfits" />

      {savedOutfits.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-sand-100">
            <Heart size={28} color="#8A8580" strokeWidth={1.5} />
          </View>
          <Text className="mt-6 text-center text-xl font-bold tracking-tight text-ink">
            No saved outfits yet
          </Text>
          <Text className="mt-2 text-center text-base leading-6 text-muted">
            Tap the heart on any generated look to save it here for later.
          </Text>
        </View>
      ) : (
        <View className="gap-4 pb-8">
          {savedOutfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              saved={isSaved(outfit.id)}
              onToggleSave={() => toggleSave(outfit)}
            />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}
