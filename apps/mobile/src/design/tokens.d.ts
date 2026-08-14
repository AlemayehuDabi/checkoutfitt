/** Type surface for the CommonJS token source in `tokens.js`. */

export type TypeStep = { size: number; lineHeight: number; tracking: number };
export type ShadowStep = { y: number; blur: number; opacity: number };

export declare const palette: {
  primary: Record<
    50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 | "DEFAULT",
    string
  >;
  ink: { DEFAULT: string; soft: string };
  muted: string;
  faint: string;
  canvas: string;
  surface: { DEFAULT: string; sunken: string; muted: string; inverse: string };
  line: { DEFAULT: string; strong: string };
  success: { DEFAULT: string; soft: string };
  warning: { DEFAULT: string; soft: string };
  danger: { DEFAULT: string; soft: string };
  info: { DEFAULT: string; soft: string };
  white: string;
};

export declare const typography: Record<
  | "micro"
  | "caption"
  | "bodySm"
  | "body"
  | "bodyLg"
  | "h3"
  | "h2"
  | "h1"
  | "display"
  | "displayLg",
  TypeStep
>;

export declare const fontWeight: Record<
  "regular" | "medium" | "semibold" | "bold",
  string
>;

export declare const radius: Record<
  "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full",
  number
>;

export declare const spacing: Record<"gutter" | "section" | "block", number>;

export declare const shadow: Record<
  "none" | "sm" | "md" | "lg" | "xl",
  ShadowStep
>;

export declare const shadowColor: string;

export declare function hexToChannels(hex: string): string;
export declare function flattenPalette(
  source?: unknown,
  prefix?: string
): Record<string, string>;
