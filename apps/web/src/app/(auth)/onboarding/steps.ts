/**
 * Quiz vocabulary. Values match the server's UpdateProfileDto exactly
 * (GENDER_PRESENTATIONS / STYLE_PREFERENCES in server/src/user/constants.ts),
 * so this state can be PATCHed to /user/profile untouched.
 */

export const GENDER_PRESENTATIONS = [
  {
    value: "feminine",
    label: "Feminine",
    description: "Skirts, dresses, tailored womenswear",
  },
  {
    value: "masculine",
    label: "Masculine",
    description: "Menswear cuts and proportions",
  },
  {
    value: "androgynous",
    label: "Androgynous",
    description: "A mix, leaning neutral",
  },
  {
    value: "no_preference",
    label: "No preference",
    description: "Show me everything",
  },
] as const;

export const STYLE_PREFERENCES = [
  { value: "minimalist", label: "Minimalist", hint: "Clean lines, few colours" },
  { value: "old_money", label: "Old money", hint: "Quiet, classic, tailored" },
  { value: "streetwear", label: "Streetwear", hint: "Relaxed, graphic, sneakers" },
  { value: "casual", label: "Casual", hint: "Everyday, comfortable" },
  { value: "formal", label: "Formal", hint: "Sharp and dressed up" },
  { value: "athleisure", label: "Athleisure", hint: "Sport pieces, worn out" },
  { value: "preppy", label: "Preppy", hint: "Collars, knits, stripes" },
  { value: "bohemian", label: "Bohemian", hint: "Flowing, textured, earthy" },
] as const;

export const TOP_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const BOTTOM_SIZES = ["24", "26", "28", "30", "32", "34", "36"];
export const SHOE_SIZES = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44"];

export interface QuizState {
  genderPresentation: string | null;
  stylePreferences: string[];
  sizeTop: string | null;
  sizeBottom: string | null;
  sizeShoe: string | null;
}

export const INITIAL_QUIZ: QuizState = {
  genderPresentation: null,
  stylePreferences: [],
  sizeTop: null,
  sizeBottom: null,
  sizeShoe: null,
};

export const STEPS = [
  { id: "gender", title: "How do you dress?", subtitle: "This shapes the cuts and proportions we suggest." },
  { id: "style", title: "What's your style?", subtitle: "Pick as many as feel right — you can change these later." },
  { id: "sizes", title: "What are your sizes?", subtitle: "Used when we recommend something you don't own yet." },
  { id: "summary", title: "You're all set", subtitle: "Here's what we'll work from." },
] as const;
