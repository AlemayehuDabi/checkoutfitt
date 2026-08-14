import type { Product } from "@/components/ui/product-card";
import type { ShoppingVerdict } from "@/types";

/** Stand-in for a scraped product when the user pastes a link. */
export const SAMPLE_PRODUCT: Product = {
  id: "p1",
  name: "Merino Crewneck Knit",
  brand: "Atelier Nord",
  price: "$128",
  retailer: "atelier-nord.com",
  colorHex: "#6B6E4E",
  badge: "Fills a gap",
};

export const ALTERNATIVE_PRODUCTS: Product[] = [
  {
    id: "p2",
    name: "Lambswool Crew",
    brand: "Common Thread",
    price: "$89",
    retailer: "commonthread.co",
    colorHex: "#B08D57",
  },
  {
    id: "p3",
    name: "Fine-Gauge Merino",
    brand: "Halden",
    price: "$155",
    retailer: "halden.com",
    colorHex: "#2B3A55",
  },
];

/**
 * Verdict varies with the "cost" the user entered so the screen reacts to input
 * rather than always showing the same answer.
 */
export function generateVerdict(priceValue: number): ShoppingVerdict {
  const outfitsUnlocked = priceValue > 200 ? 6 : priceValue > 120 ? 14 : 19;
  const versatility = priceValue > 200 ? 52 : priceValue > 120 ? 84 : 91;
  const perWear = priceValue / Math.max(1, outfitsUnlocked * 4);

  const verdict: ShoppingVerdict["verdict"] =
    versatility >= 80 ? "buy" : versatility >= 60 ? "maybe" : "skip";

  return {
    verdict,
    headline:
      verdict === "buy"
        ? "Worth it"
        : verdict === "maybe"
          ? "Only if you love it"
          : "Skip this one",
    reasoning:
      verdict === "buy"
        ? "This closes your highest-priority gap and pairs with most of what you already own. The colour sits inside your signature palette, so it won't strand anything."
        : verdict === "maybe"
          ? "It works, but it overlaps with two pieces you already wear often. Worth it only if it replaces one of them rather than joining them."
          : "At this price it needs to earn its place, and it only pairs cleanly with three items. Your budget goes further on the knit you're still missing.",
    outfitsUnlocked,
    costPerWear: `$${perWear.toFixed(2)}`,
    versatility,
    pairsWith: [
      { id: "s1", label: "White Poplin Shirt", category: "top", colorHex: "#EFE9DF" },
      { id: "s2", label: "Tailored Trousers", category: "bottom", colorHex: "#17130F" },
      { id: "s3", label: "Wool Trench Coat", category: "outerwear", colorHex: "#B08D57" },
      { id: "s4", label: "Leather Loafers", category: "shoes", colorHex: "#6E2A32" },
    ],
  };
}

export const SHOPPING_ANALYSIS_STEPS = [
  "Reading the product…",
  "Matching against your closet…",
  "Counting new combinations…",
  "Weighing cost per wear…",
];
