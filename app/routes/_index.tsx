import React from "react";
import { useConfigurables } from "~/modules/configurables";
import { useRoomDesigner } from "~/room-designer/hooks/use-room-designer";
import { FurnitureToolbar } from "~/room-designer/components/furniture-toolbar";
import { RoomCanvas } from "~/room-designer/components/room-canvas";
import { AIChatPanel } from "~/room-designer/components/ai-chat-panel";
import { TopBar } from "~/room-designer/components/top-bar";
import { PropertiesPanel } from "~/room-designer/components/properties-panel";

export default function IndexPage() {
  const { config, loading } = useConfigurables();

  const primaryColor = config?.brandColor?.primary ?? "#3730a3";
  const accentColor = config?.brandColor?.accent ?? "#f59e0b";
  const appName = config?.appName ?? "uDesign";
  const defaultUnit = (config?.defaultRoomUnit as "meters" | "feet") ?? "meters";
  const defaultWidth = typeof config?.defaultRoomWidth === "number" ? config.defaultRoomWidth : 5;
  const defaultLength = typeof config?.defaultRoomLength === "number" ? config.defaultRoomLength : 4;
  const cellSize = typeof config?.gridCellSize === "number" ? config.gridCellSize : 50;
  const showGrid = config?.showGridLines !== false;
  const canvasBackground = (config?.canvasBackground as string) ?? "#f5f0e8";
  const wallColor = (config?.wallColor as string) ?? "#4b5563";
  const floorColor = (config?.floorColor as string) ?? "#fef3c7";
  const welcomeMessage =
    (config?.aiWelcomeMessage as string) ??
    "Hi! I'm your AI interior designer. Tell me about your room and I'll help you arrange it perfectly.";
  const systemPromptExtra = (config?.aiSystemPromptExtra as string) ?? "";

  const state = useRoomDesigner({
    width: defaultWidth,
    length: defaultLength,
    unit: defaultUnit,
  });

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: primaryColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 800,
              color: "#fff",
              margin: "0 auto 12px",
            }}
          >
            u
          </div>
          <p style={{ color: "#6b7280", fontSize: 14 }}>Loading uDesign…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Inter, system-ui, sans-serif",
        background: "#fafafa",
        color: "#111827",
        overflow: "hidden",
      }}
    >
      {/* Top bar */}
      <TopBar
        appName={appName}
        room={state.room}
        onRoomUpdate={state.updateRoom}
        onClear={state.clearRoom}
        primaryColor={primaryColor}
        accentColor={accentColor}
        selectedItemId={state.selectedId}
        onRotate={() => state.selectedId && state.rotateItem(state.selectedId)}
        onDelete={() => state.selectedId && state.deleteItem(state.selectedId)}
      />

      {/* Main workspace */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        {/* Left: furniture toolbar */}
        <FurnitureToolbar
          onDragStart={() => {}}
          primaryColor={primaryColor}
        />

        {/* Center: canvas + properties panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", minWidth: 0 }}>
          <RoomCanvas
            state={state}
            cellSize={cellSize}
            showGrid={showGrid}
            canvasBackground={canvasBackground}
            wallColor={wallColor}
            floorColor={floorColor}
          />

          {/* Canvas info overlay */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "rgba(255,255,255,0.9)",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 12,
              color: "#6b7280",
              backdropFilter: "blur(4px)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              pointerEvents: "none",
            }}
          >
            {state.room.width} × {state.room.length} {state.room.unit} ·{" "}
            {state.items.length} item{state.items.length !== 1 ? "s" : ""}
          </div>

          {/* Properties panel for selected item */}
          {state.selectedItem && (
            <PropertiesPanel
              item={state.selectedItem}
              state={state}
              primaryColor={primaryColor}
            />
          )}
        </div>

        {/* Right: AI chat */}
        <AIChatPanel
          items={state.items}
          room={state.room}
          welcomeMessage={welcomeMessage}
          systemPromptExtra={systemPromptExtra}
          primaryColor={primaryColor}
          accentColor={accentColor}
        />
      </div>
    </div>
  );
}
