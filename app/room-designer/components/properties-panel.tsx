import React from "react";
import type { FurnitureItem } from "~/room-designer/types";
import type { RoomDesignerState } from "~/room-designer/hooks/use-room-designer";

interface PropertiesPanelProps {
  item: FurnitureItem;
  state: RoomDesignerState;
  primaryColor: string;
}

export function PropertiesPanel({ item, state, primaryColor }: PropertiesPanelProps) {
  const { resizeItem, moveItem, room } = state;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: "12px 16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        display: "flex",
        alignItems: "center",
        gap: 16,
        zIndex: 30,
        minWidth: 360,
        maxWidth: 500,
      }}
    >
      <div>
        <p style={{ margin: 0, fontSize: 11, color: "#6b7280", fontWeight: 600 }}>SELECTED</p>
        <p style={{ margin: 0, fontSize: 14, color: "#111827", fontWeight: 700 }}>{item.label}</p>
      </div>
      <div style={{ width: 1, height: 32, background: "#e5e7eb" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: "#6b7280", whiteSpace: "nowrap" }}>Width:</span>
        <input
          type="number"
          min={1}
          max={room.width}
          value={item.width}
          onChange={(e) => resizeItem(item.id, Number(e.target.value), item.height)}
          style={{
            width: 48,
            height: 28,
            borderRadius: 6,
            border: `1px solid ${primaryColor}55`,
            textAlign: "center",
            fontSize: 13,
            fontWeight: 600,
            outline: "none",
            color: "#111827",
          }}
        />
        <span style={{ fontSize: 11, color: "#6b7280", whiteSpace: "nowrap" }}>cells</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: "#6b7280", whiteSpace: "nowrap" }}>Height:</span>
        <input
          type="number"
          min={1}
          max={room.length}
          value={item.height}
          onChange={(e) => resizeItem(item.id, item.width, Number(e.target.value))}
          style={{
            width: 48,
            height: 28,
            borderRadius: 6,
            border: `1px solid ${primaryColor}55`,
            textAlign: "center",
            fontSize: 13,
            fontWeight: 600,
            outline: "none",
            color: "#111827",
          }}
        />
        <span style={{ fontSize: 11, color: "#6b7280", whiteSpace: "nowrap" }}>cells</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: "#6b7280", whiteSpace: "nowrap" }}>X:</span>
        <input
          type="number"
          min={0}
          max={room.width - 1}
          value={item.x}
          onChange={(e) => moveItem(item.id, Number(e.target.value), item.y)}
          style={{
            width: 44,
            height: 28,
            borderRadius: 6,
            border: `1px solid ${primaryColor}55`,
            textAlign: "center",
            fontSize: 13,
            fontWeight: 600,
            outline: "none",
            color: "#111827",
          }}
        />
        <span style={{ fontSize: 11, color: "#6b7280", whiteSpace: "nowrap" }}>Y:</span>
        <input
          type="number"
          min={0}
          max={room.length - 1}
          value={item.y}
          onChange={(e) => moveItem(item.id, item.x, Number(e.target.value))}
          style={{
            width: 44,
            height: 28,
            borderRadius: 6,
            border: `1px solid ${primaryColor}55`,
            textAlign: "center",
            fontSize: 13,
            fontWeight: 600,
            outline: "none",
            color: "#111827",
          }}
        />
      </div>
    </div>
  );
}
