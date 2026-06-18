import React from "react";
import type { RoomConfig } from "~/room-designer/types";

interface TopBarProps {
  appName: string;
  room: RoomConfig;
  onRoomUpdate: (updates: Partial<RoomConfig>) => void;
  onClear: () => void;
  primaryColor: string;
  accentColor: string;
  selectedItemId: string | null;
  onRotate: () => void;
  onDelete: () => void;
}

export function TopBar({
  appName,
  room,
  onRoomUpdate,
  onClear,
  primaryColor,
  accentColor,
  selectedItemId,
  onRotate,
  onDelete,
}: TopBarProps) {
  return (
    <div
      style={{
        height: 56,
        background: primaryColor,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 16,
        flexShrink: 0,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 20,
      }}
    >
      {/* App title */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: accentColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 800,
            color: "#fff",
          }}
        >
          u
        </div>
        <span
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: "-0.02em",
          }}
        >
          {appName}
        </span>
      </div>

      <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.2)" }} />

      {/* Room dimension controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, whiteSpace: "nowrap" }}>
          Room size:
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            type="number"
            min={2}
            max={30}
            value={room.width}
            onChange={(e) => onRoomUpdate({ width: Math.max(2, Math.min(30, Number(e.target.value))) })}
            style={{
              width: 52,
              height: 28,
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              textAlign: "center",
              fontSize: 13,
              fontWeight: 600,
              outline: "none",
              padding: "0 4px",
            }}
          />
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>×</span>
          <input
            type="number"
            min={2}
            max={30}
            value={room.length}
            onChange={(e) => onRoomUpdate({ length: Math.max(2, Math.min(30, Number(e.target.value))) })}
            style={{
              width: 52,
              height: 28,
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              textAlign: "center",
              fontSize: 13,
              fontWeight: 600,
              outline: "none",
              padding: "0 4px",
            }}
          />
        </div>

        <select
          value={room.unit}
          onChange={(e) => onRoomUpdate({ unit: e.target.value as "meters" | "feet" })}
          style={{
            height: 28,
            borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            fontSize: 12,
            outline: "none",
            padding: "0 6px",
            cursor: "pointer",
          }}
        >
          <option value="meters" style={{ color: "#111827", background: "#fff" }}>meters</option>
          <option value="feet" style={{ color: "#111827", background: "#fff" }}>feet</option>
        </select>
      </div>

      <div style={{ flex: 1 }} />

      {/* Selected item actions */}
      {selectedItemId && (
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={onRotate}
            title="Rotate 90°"
            style={{
              height: 32,
              padding: "0 12px",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            ↻ Rotate
          </button>
          <button
            onClick={onDelete}
            title="Delete selected"
            style={{
              height: 32,
              padding: "0 12px",
              borderRadius: 6,
              border: "1px solid rgba(239,68,68,0.5)",
              background: "rgba(239,68,68,0.2)",
              color: "#fca5a5",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            ✕ Delete
          </button>
        </div>
      )}

      <button
        onClick={onClear}
        title="Clear all furniture"
        style={{
          height: 32,
          padding: "0 12px",
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.3)",
          background: "transparent",
          color: "rgba(255,255,255,0.7)",
          fontSize: 12,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        Clear All
      </button>
    </div>
  );
}
