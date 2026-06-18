export type FurnitureType =
  | "chair"
  | "table"
  | "vase"
  | "bed"
  | "lamp"
  | "door"
  | "window"
  | "sofa"
  | "desk"
  | "wardrobe";

export type WallSide = "top" | "bottom" | "left" | "right";

export interface FurnitureItem {
  id: string;
  type: FurnitureType;
  label: string;
  x: number; // grid col
  y: number; // grid row
  width: number; // grid cells wide
  height: number; // grid cells tall
  rotation: number; // degrees: 0, 90, 180, 270
  wallSide?: WallSide; // for door/window
  color?: string;
}

export interface RoomConfig {
  width: number; // in chosen unit
  length: number; // in chosen unit
  unit: "meters" | "feet";
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface FurnitureTemplate {
  type: FurnitureType;
  label: string;
  defaultWidth: number;
  defaultHeight: number;
  icon: string;
  wallMounted?: boolean;
  color: string;
}

export const FURNITURE_TEMPLATES: FurnitureTemplate[] = [
  { type: "chair",    label: "Chair",    defaultWidth: 1, defaultHeight: 1, icon: "🪑", color: "#92400e" },
  { type: "table",    label: "Table",    defaultWidth: 2, defaultHeight: 1, icon: "🪵", color: "#78350f" },
  { type: "sofa",     label: "Sofa",     defaultWidth: 3, defaultHeight: 1, icon: "🛋️", color: "#1e40af" },
  { type: "bed",      label: "Bed",      defaultWidth: 2, defaultHeight: 3, icon: "🛏️", color: "#6d28d9" },
  { type: "desk",     label: "Desk",     defaultWidth: 2, defaultHeight: 1, icon: "🗄️", color: "#065f46" },
  { type: "wardrobe", label: "Wardrobe", defaultWidth: 2, defaultHeight: 1, icon: "🚪", color: "#374151" },
  { type: "lamp",     label: "Lamp",     defaultWidth: 1, defaultHeight: 1, icon: "💡", color: "#d97706" },
  { type: "vase",     label: "Vase",     defaultWidth: 1, defaultHeight: 1, icon: "🪴", color: "#059669" },
  { type: "door",     label: "Door",     defaultWidth: 1, defaultHeight: 1, icon: "🚪", color: "#6b7280", wallMounted: true },
  { type: "window",   label: "Window",   defaultWidth: 2, defaultHeight: 1, icon: "🪟", color: "#0ea5e9", wallMounted: true },
];
