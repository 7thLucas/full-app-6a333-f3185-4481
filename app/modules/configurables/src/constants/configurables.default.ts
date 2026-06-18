/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  tagline?: string;
  defaultRoomUnit?: string;
  defaultRoomWidth?: number;
  defaultRoomLength?: number;
  gridCellSize?: number;
  aiWelcomeMessage?: string;
  aiSystemPromptExtra?: string;
  showGridLines?: boolean;
  canvasBackground?: string;
  wallColor?: string;
  floorColor?: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "uDesign",
  logoUrl: "FILL_LOGO_URL_HERE",
  brandColor: {
    primary: "#3730a3",
    secondary: "#0d9488",
    accent: "#f59e0b",
  },
  tagline: "Design your dream room", // fill it here
  defaultRoomUnit: "meters",          // must match enum options
  defaultRoomWidth: 5,                // fill it here
  defaultRoomLength: 4,               // fill it here
  gridCellSize: 50,                   // fill it here
  aiWelcomeMessage: "Hi! I'm your AI interior designer. Tell me about your room and I'll help you arrange it perfectly.", // fill it here
  aiSystemPromptExtra: "",            // fill it here
  showGridLines: true,                // fill it here
  canvasBackground: "#f5f0e8",        // fill it here
  wallColor: "#4b5563",               // fill it here
  floorColor: "#fef3c7",              // fill it here
};
