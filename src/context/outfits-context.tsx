import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

import type { Outfit } from "@/types";

const MAX_REMEMBERED_OUTFITS = 40;

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
      // Accumulates rather than replaces, so outfits generated earlier (e.g. still
      // referenced by a back-stacked detail screen) stay resolvable via findOutfit.
      setLastGenerated: (outfits) => {
        setLastGenerated((prev) => [...outfits, ...prev].slice(0, MAX_REMEMBERED_OUTFITS));
      },
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
