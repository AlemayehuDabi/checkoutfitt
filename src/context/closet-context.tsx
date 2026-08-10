import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

import { INITIAL_CLOSET_ITEMS } from "@/constants/mock-closet";
import type { ClosetItem } from "@/types";

type NewClosetItem = Omit<ClosetItem, "id" | "favorite" | "archived">;

type ClosetContextValue = {
  items: ClosetItem[];
  addItem: (item: NewClosetItem) => string;
  updateItem: (id: string, updates: Partial<ClosetItem>) => void;
  removeItem: (id: string) => void;
  toggleArchive: (id: string) => void;
  toggleFavorite: (id: string) => void;
  getItem: (id: string) => ClosetItem | undefined;
  pendingImages: string[];
  setPendingImages: (uris: string[]) => void;
};

const ClosetContext = createContext<ClosetContextValue | null>(null);

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `local-${Date.now()}-${idCounter}`;
}

export function ClosetProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ClosetItem[]>(INITIAL_CLOSET_ITEMS);
  const [pendingImages, setPendingImages] = useState<string[]>([]);

  const value = useMemo<ClosetContextValue>(
    () => ({
      items,
      addItem: (item) => {
        const id = nextId();
        setItems((prev) => [{ ...item, id, favorite: false, archived: false }, ...prev]);
        return id;
      },
      updateItem: (id, updates) => {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
      },
      removeItem: (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
      },
      toggleArchive: (id) => {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, archived: !item.archived } : item))
        );
      },
      toggleFavorite: (id) => {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item))
        );
      },
      getItem: (id) => items.find((item) => item.id === id),
      pendingImages,
      setPendingImages,
    }),
    [items, pendingImages]
  );

  return <ClosetContext.Provider value={value}>{children}</ClosetContext.Provider>;
}

export function useCloset() {
  const ctx = useContext(ClosetContext);
  if (!ctx) throw new Error("useCloset must be used within a ClosetProvider");
  return ctx;
}
