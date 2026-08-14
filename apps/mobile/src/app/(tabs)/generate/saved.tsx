import { Heart } from "lucide-react-native";
import { FlatList } from "react-native";

import { OutfitCard } from "@/components/outfit/outfit-card";
import { Header } from "@/components/ui/header";
import { ScreenContainer } from "@/components/ui/screen-container";
import { StateView } from "@/components/ui/state-view";
import { useOutfits } from "@/context/outfits-context";

export default function SavedOutfitsScreen() {
  const { savedOutfits, toggleSave } = useOutfits();

  return (
    <ScreenContainer>
      <Header title="Saved Outfits" />

      {savedOutfits.length === 0 ? (
        <StateView
          icon={Heart}
          title="No saved outfits yet"
          description="Tap the heart on any generated look to save it here for later."
        />
      ) : (
        <FlatList
          data={savedOutfits}
          keyExtractor={(outfit) => outfit.id}
          contentContainerClassName="gap-4 pb-8"
          showsVerticalScrollIndicator={false}
          // Each card mounts up to four image tiles, so keeping the render
          // window tight matters more here than on a plain text list.
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={7}
          removeClippedSubviews
          renderItem={({ item }) => (
            // Everything on this screen is saved by definition — passing `true`
            // avoids an O(n) `isSaved` scan per row (O(n²) for the list).
            <OutfitCard outfit={item} saved onToggleSave={() => toggleSave(item)} />
          )}
        />
      )}
    </ScreenContainer>
  );
}
