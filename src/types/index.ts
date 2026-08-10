export type ClosetCategory = "top" | "bottom" | "outerwear" | "dress" | "shoes" | "accessory";

export type ClosetItem = {
  id: string;
  type: string;
  category: ClosetCategory;
  color: string;
  colorHex: string;
  imageUri?: string;
  favorite: boolean;
  archived: boolean;
};

export type OutfitItem = {
  id: string;
  label: string;
  category: ClosetCategory;
  colorHex: string;
};

export type OutfitContext =
  | "Casual"
  | "Office"
  | "Date Night"
  | "Meeting"
  | "Weekend";

export type Outfit = {
  id: string;
  context: string;
  title: string;
  reason: string;
  items: OutfitItem[];
};

export type Occasion = {
  key: string;
  label: string;
  description: string;
  icon: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text?: string;
  imageUri?: string;
  outfit?: Outfit;
  createdAt: number;
};

export type WeatherData = {
  location: string;
  tempF: number;
  condition: string;
  rainChance: number;
  windMph: number;
  uvIndex: number;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  icon: "sparkles" | "sun" | "heart" | "bell" | "crown";
};
