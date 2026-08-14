import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

import { INITIAL_CLOSET_ITEMS } from "@/constants/mock-closet";
import type { ClosetItem } from "@/types";

type NewClosetItem = Omit<ClosetItem, "id" | "favorite" | "archived">;

type ClosetActions = {
  addItem: (item: NewClosetItem) => string;
  updateItem: (id: string, updates: Partial<ClosetItem>) => void;
  removeItem: (id: string) => void;
  toggleArchive: (id: string) => void;
  toggleFavorite: (id: string) => void;
};

type PendingImagesValue = {
  pendingImages: string[];
  setPendingImages: (uris: string[]) => void;
};

/**
 * Three contexts rather than one object.
 *
 * Previously `items` and `pendingImages` shared a single context value, so
 * staging photos during the capture flow re-rendered the whole closet grid, and
 * every item mutation re-created the action callbacks for screens that only
 * dispatch. Actions are now identity-stable for the life of the app, and the
 * capture flow no longer touches item consumers at all.
 */
const ClosetItemsContext = createContext<ClosetItem[] | null>(null);
const ClosetActionsContext = createContext<ClosetActions | null>(null);
const PendingImagesContext = createContext<PendingImagesValue | null>(null);

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `local-${Date.now()}-${idCounter}`;
}

export function ClosetProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ClosetItem[]>(INITIAL_CLOSET_ITEMS);
  const [pendingImages, setPendingImages] = useState<string[]>([]);

  // Every action uses the functional setState form, so none of them close over
  // `items` and the object never needs to be rebuilt.
  const actions = useMemo<ClosetActions>(
    () => ({
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
    }),
    []
  );

  const pending = useMemo<PendingImagesValue>(
    () => ({ pendingImages, setPendingImages }),
    [pendingImages]
  );

  return (
    <ClosetActionsContext.Provider value={actions}>
      <ClosetItemsContext.Provider value={items}>
        <PendingImagesContext.Provider value={pending}>{children}</PendingImagesContext.Provider>
      </ClosetItemsContext.Provider>
    </ClosetActionsContext.Provider>
  );
}

/** Items + actions. Use when the screen actually renders closet contents. */
export function useCloset() {
  const items = useContext(ClosetItemsContext);
  const actions = useContext(ClosetActionsContext);
  if (!items || !actions) throw new Error("useCloset must be used within a ClosetProvider");

  return {
    items,
    ...actions,
    getItem: (id: string) => items.find((item) => item.id === id),
  };
}

/** Actions only — subscribing components never re-render on item changes. */
export function useClosetActions() {
  const actions = useContext(ClosetActionsContext);
  if (!actions) throw new Error("useClosetActions must be used within a ClosetProvider");
  return actions;
}

/** The capture → processing → confirm hand-off buffer. */
export function usePendingImages() {
  const ctx = useContext(PendingImagesContext);
  if (!ctx) throw new Error("usePendingImages must be used within a ClosetProvider");
  return ctx;
}
