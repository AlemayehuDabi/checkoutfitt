"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import type { MockOutfitRating } from "@/lib/mock-data";
import { RatingCard } from "./rating-card";

export function RatingHistoryGrid({
  ratings,
}: {
  ratings: MockOutfitRating[];
}) {
  return (
    <motion.ul
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-2 gap-lg sm:gap-2xl lg:grid-cols-4"
    >
      {ratings.map((rating) => (
        <RatingCard key={rating.id} rating={rating} />
      ))}
    </motion.ul>
  );
}
