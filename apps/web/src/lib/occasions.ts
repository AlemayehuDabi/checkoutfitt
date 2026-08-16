import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Cake,
  Dumbbell,
  Gem,
  Handshake,
  Heart,
  Plane,
  Sofa,
  Sun,
  Wine,
} from "lucide-react";
import type { OutfitContext } from "./mock-data";

export interface OccasionMeta {
  value: OutfitContext;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Two stops for the card's tinted wash — kept in the warm brand family
   *  except where the occasion genuinely calls for a cooler note. */
  from: string;
  to: string;
}

export const OCCASIONS: Record<OutfitContext, OccasionMeta> = {
  casual: {
    value: "casual",
    label: "Casual",
    description: "Everyday, comfortable, low effort",
    icon: Sun,
    from: "#f6dbc7",
    to: "#e8a878",
  },
  office: {
    value: "office",
    label: "Office",
    description: "Professional without the stiffness",
    icon: Briefcase,
    from: "#e7e2d9",
    to: "#c9b8a0",
  },
  date_night: {
    value: "date_night",
    label: "Date Night",
    description: "A step up from everyday",
    icon: Heart,
    from: "#e8a878",
    to: "#c1622d",
  },
  meeting: {
    value: "meeting",
    label: "Meeting",
    description: "Sharp and put together",
    icon: Handshake,
    from: "#ddd6ca",
    to: "#b3a48d",
  },
  weekend: {
    value: "weekend",
    label: "Weekend",
    description: "Relaxed, comfort first",
    icon: Sofa,
    from: "#f6dbc7",
    to: "#d4a97c",
  },
  interview: {
    value: "interview",
    label: "Interview",
    description: "Conservative, structured, quiet",
    icon: Gem,
    from: "#d9d4cb",
    to: "#8f8879",
  },
  wedding: {
    value: "wedding",
    label: "Wedding",
    description: "Elevated and polished",
    icon: Cake,
    from: "#fbeee6",
    to: "#e0b58e",
  },
  party: {
    value: "party",
    label: "Party",
    description: "Bolder colour and texture",
    icon: Wine,
    from: "#d4783c",
    to: "#8a4119",
  },
  travel: {
    value: "travel",
    label: "Travel",
    description: "Layers you can move in",
    icon: Plane,
    from: "#cfd8d3",
    to: "#8fa39a",
  },
  gym: {
    value: "gym",
    label: "Gym",
    description: "Activewear only",
    icon: Dumbbell,
    from: "#d5cfc5",
    to: "#9a9186",
  },
};

/** The five shown on the generator; the rest live on the Occasions page. */
export const BASE_CONTEXTS: OutfitContext[] = [
  "casual",
  "office",
  "date_night",
  "meeting",
  "weekend",
];

export const ALL_CONTEXTS = Object.keys(OCCASIONS) as OutfitContext[];
