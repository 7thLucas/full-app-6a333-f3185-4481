/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent",
        },
      ],
    },
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "App Tagline",
    },
    {
      fieldName: "defaultRoomUnit",
      type: "enum",
      required: false,
      label: "Default Room Unit",
      options: ["meters", "feet"],
    },
    {
      fieldName: "defaultRoomWidth",
      type: "number",
      required: false,
      label: "Default Room Width",
      min: 1,
      max: 100,
    },
    {
      fieldName: "defaultRoomLength",
      type: "number",
      required: false,
      label: "Default Room Length",
      min: 1,
      max: 100,
    },
    {
      fieldName: "gridCellSize",
      type: "number",
      required: false,
      label: "Grid Cell Size (px)",
      min: 20,
      max: 100,
    },
    {
      fieldName: "aiWelcomeMessage",
      type: "string",
      required: false,
      label: "AI Bot Welcome Message",
    },
    {
      fieldName: "aiSystemPromptExtra",
      type: "string",
      required: false,
      label: "AI Bot Extra System Instructions",
    },
    {
      fieldName: "showGridLines",
      type: "boolean",
      required: false,
      label: "Show Grid Lines",
    },
    {
      fieldName: "canvasBackground",
      type: "color",
      required: false,
      label: "Canvas Background Color",
    },
    {
      fieldName: "wallColor",
      type: "color",
      required: false,
      label: "Room Wall Color",
    },
    {
      fieldName: "floorColor",
      type: "color",
      required: false,
      label: "Floor Color",
    },
  ],
};