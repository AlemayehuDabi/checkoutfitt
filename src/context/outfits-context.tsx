import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

import type { Outfit } from "@/types";

type OutfitsContextValue = {
  savedOutfits: Outfit[];
  toggleSave: (outfit: Outfit) => void;
  isSaved: (id: string) => boolean;
  lastGenerated: Outfit[];
  setLastGenerated: (outfits: Outfit[]) => void;
  findOutfit: (id: string) => Outfit | undefined;
};

const OutfitsContext = createContext<OutfitsContextValue | null>(null);

export function OutfitsProvider({ children }: { children: ReactNode }) {
  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>([]);
  const [lastGenerated, setLastGenerated] = useState<Outfit[]>([]);

  const value = useMemo<OutfitsContextValue>(
    () => ({
      savedOutfits,
      toggleSave: (outfit) => {
        setSavedOutfits((prev) =>
          prev.some((item) => item.id === outfit.id)
            ? prev.filter((item) => item.id !== outfit.id)
            : [outfit, ...prev]
        );
      },
      isSaved: (id) => savedOutfits.some((item) => item.id === id),
      lastGenerated,
      setLastGenerated,
      findOutfit: (id) =>
        lastGenerated.find((item) => item.id === id) ?? savedOutfits.find((item) => item.id === id),
    }),
    [savedOutfits, lastGenerated]
  );

  return <OutfitsContext.Provider value={value}>{children}</OutfitsContext.Provider>;
}

export function useOutfits() {
  const ctx = useContext(OutfitsContext);
  if (!ctx) throw new Error("useOutfits must be used within an OutfitsProvider");
  return ctx;
}
