"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import type { MockOutfit } from "@/lib/mock-data";
import { OutfitGridCard } from "@/components/outfit/outfit-grid-card";

export function SavedOutfitGrid({ outfits }: { outfits: MockOutfit[] }) {
  return (
    <motion.ul
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 gap-lg sm:grid-cols-2 sm:gap-2xl lg:grid-cols-3 xl:grid-cols-4"
    >
      {outfits.map((outfit) => (
        <OutfitGridCard key={outfit.id} outfit={outfit} />
      ))}
    </motion.ul>
  );
}
