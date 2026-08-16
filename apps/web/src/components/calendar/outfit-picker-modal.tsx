"use client";

import * as React from "react";
import { Bookmark, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTEXT_LABELS, mockSavedOutfits, type MockOutfit } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { StateView } from "@/components/ui/state-view";
import { OutfitImage } from "@/components/outfit-image";

/** Selectable grid of saved outfits for a calendar day. */
export function OutfitPickerModal({
  open,
  onClose,
  onSelect,
  dateLabel,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (outfit: MockOutfit) => void;
  dateLabel: string;
}) {
  const [chosen, setChosen] = React.useState<string | null>(null);
  const outfits = mockSavedOutfits;
  const selected = outfits.find((o) => o.id === chosen);

  // Cleared on every exit path rather than synced from `open` in an effect.
  function close() {
    setChosen(null);
    onClose();
  }

  function confirm() {
    if (!selected) return;
    setChosen(null);
    onSelect(selected);
  }

  return (
    <Modal
      open={open}
      onClose={close}
      size="lg"
      title="Assign an outfit"
      description={dateLabel}
      footer={
        outfits.length > 0 ? (
          <>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button disabled={!selected} onClick={confirm}>
              Assign outfit
            </Button>
          </>
        ) : undefined
      }
    >
      {outfits.length === 0 ? (
        <StateView
          icon={<Bookmark />}
          title="No saved outfits yet"
          description="Save an outfit and it'll be available to plan into your calendar."
          className="py-4xl"
        />
      ) : (
        <ul className="grid max-h-[46vh] grid-cols-2 gap-lg overflow-y-auto p-0.5 sm:grid-cols-3">
          {outfits.map((outfit) => {
            const isChosen = chosen === outfit.id;
            return (
              <li key={outfit.id}>
                <button
                  type="button"
                  aria-pressed={isChosen}
                  onClick={() => setChosen(outfit.id)}
                  className={cn(
                    "relative w-full cursor-pointer overflow-hidden rounded-md border text-left transition-colors duration-200",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
                    isChosen
                      ? "border-[1.5px] border-primary-500 bg-primary-50"
                      : "border-border bg-surface hover:border-border-strong",
                  )}
                >
                  {isChosen && (
                    <span className="absolute top-2 right-2 z-10 inline-flex size-5 items-center justify-center rounded-full bg-primary-500 text-white">
                      <Check aria-hidden className="size-3" strokeWidth={3} />
                    </span>
                  )}
                  <OutfitImage
                    items={outfit.items}
                    className="aspect-[4/3] w-full"
                  />
                  <span className="block p-md">
                    <span
                      className={cn(
                        "block text-body-medium",
                        isChosen ? "text-primary-500" : "text-text-primary",
                      )}
                    >
                      {CONTEXT_LABELS[outfit.context]}
                    </span>
                    <span className="block text-caption text-text-muted tabular-nums">
                      {outfit.items.length} pieces
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
