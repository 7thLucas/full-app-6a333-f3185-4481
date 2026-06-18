import React from "react";
import { FURNITURE_TEMPLATES } from "~/room-designer/types";
import type { FurnitureTemplate } from "~/room-designer/types";

interface FurnitureToolbarProps {
  onDragStart: (type: string) => void;
  primaryColor: string;
}

function FurnitureCard({ template, primaryColor }: { template: FurnitureTemplate; primaryColor: string }) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("furnitureType", template.type);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      title={`Drag ${template.label} onto canvas`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "8px 4px",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        background: "#fff",
        cursor: "grab",
        userSelect: "none",
        transition: "box-shadow 0.15s, border-color 0.15s",
        minWidth: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = primaryColor;
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 2px ${primaryColor}22`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e7eb";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          backgroundColor: template.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
        }}
      >
        {template.icon}
      </div>
      <span
        style={{
          fontSize: 10,
          color: "#374151",
          fontWeight: 600,
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {template.label}
      </span>
      {template.wallMounted && (
        <span
          style={{
            fontSize: 8,
            color: "#9ca3af",
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          wall
        </span>
      )}
    </div>
  );
}

export function FurnitureToolbar({ onDragStart, primaryColor }: FurnitureToolbarProps) {
  return (
    <div
      style={{
        width: 120,
        flexShrink: 0,
        background: "#f9fafb",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "12px 8px 8px",
          borderBottom: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: 0,
          }}
        >
          Furniture
        </p>
        <p style={{ fontSize: 10, color: "#9ca3af", margin: "2px 0 0", lineHeight: 1.3 }}>
          Drag onto canvas
        </p>
      </div>
      <div
        style={{
          padding: 8,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
        }}
      >
        {FURNITURE_TEMPLATES.map((template) => (
          <FurnitureCard
            key={template.type}
            template={template}
            primaryColor={primaryColor}
          />
        ))}
      </div>
    </div>
  );
}
