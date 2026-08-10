import { Heart } from "lucide-react-native";
import { View } from "react-native";

import { OutfitCard } from "@/components/outfit/outfit-card";
import { Header } from "@/components/ui/header";
import { ScreenContainer } from "@/components/ui/screen-container";
import { StateView } from "@/components/ui/state-view";
import { useOutfits } from "@/context/outfits-context";

export default function SavedOutfitsScreen() {
  const { savedOutfits, toggleSave, isSaved } = useOutfits();

  return (
    <ScreenContainer scroll={savedOutfits.length > 0}>
      <Header title="Saved Outfits" />

      {savedOutfits.length === 0 ? (
        <StateView
          icon={Heart}
          title="No saved outfits yet"
          description="Tap the heart on any generated look to save it here for later."
        />
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
