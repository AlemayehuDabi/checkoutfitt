"use client";

import * as React from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function SaveToggle({
  initialSaved,
  label,
}: {
  initialSaved: boolean;
  label: string;
}) {
  const { toast } = useToast();
  const [saved, setSaved] = React.useState(initialSaved);

  function toggle() {
    const next = !saved;
    setSaved(next);
    toast({
      kind: next ? "success" : "info",
      title: next ? "Outfit saved" : "Removed from saved",
      description: next
        ? `${label} is in your saved outfits.`
        : `${label} is no longer saved.`,
    });
  }

  return (
    <Button
      variant={saved ? "secondary" : "primary"}
      onClick={toggle}
      iconLeft={
        saved ? (
          <BookmarkCheck className="size-4" />
        ) : (
          <Bookmark className="size-4" />
        )
      }
    >
      {saved ? "Saved" : "Save outfit"}
    </Button>
  );
}
