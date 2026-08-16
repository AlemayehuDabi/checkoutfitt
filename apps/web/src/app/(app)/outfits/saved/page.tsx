import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark, Sparkles } from "lucide-react";
import { mockSavedOutfits } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { StateView } from "@/components/ui/state-view";
import { SavedOutfitGrid } from "./saved-outfit-grid";

export const metadata: Metadata = {
  title: "Saved outfits",
  description: "Looks you've kept, ready to wear again.",
};

export default function SavedOutfitsPage() {
  const outfits = mockSavedOutfits;

  return (
    <div className="py-2xl">
      <div className="mb-2xl flex flex-wrap items-end justify-between gap-lg">
        <div>
          <p className="text-eyebrow uppercase text-text-muted">Your lookbook</p>
          <h2 className="mt-1 text-h2 text-text-primary">
            {outfits.length}{" "}
            <span className="text-text-muted">
              saved {outfits.length === 1 ? "outfit" : "outfits"}
            </span>
          </h2>
        </div>
        <Link href="/generate">
          <Button iconLeft={<Sparkles className="size-4" />}>
            Generate an outfit
          </Button>
        </Link>
      </div>

      {outfits.length === 0 ? (
        <StateView
          icon={<Bookmark />}
          title="No saved outfits yet"
          description="When you generate a look you like, save it and it'll live here for next time."
          action={
            <Link href="/generate">
              <Button iconLeft={<Sparkles className="size-4" />}>
                Generate your first outfit
              </Button>
            </Link>
          }
        />
      ) : (
        <SavedOutfitGrid outfits={outfits} />
      )}
    </div>
  );
}
