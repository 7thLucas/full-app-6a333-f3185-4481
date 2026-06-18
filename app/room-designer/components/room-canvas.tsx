import React, { useCallback, useRef, useState } from "react";
import type { FurnitureItem, FurnitureType } from "~/room-designer/types";
import { FURNITURE_TEMPLATES } from "~/room-designer/types";
import type { RoomDesignerState } from "~/room-designer/hooks/use-room-designer";

interface RoomCanvasProps {
  state: RoomDesignerState;
  cellSize: number;
  showGrid: boolean;
  canvasBackground: string;
  wallColor: string;
  floorColor: string;
}

interface DragState {
  itemId: string;
  startMouseX: number;
  startMouseY: number;
  startItemX: number;
  startItemY: number;
}

function FurnitureItemView({
  item,
  cellSize,
  isSelected,
  onSelect,
  onDragStart,
}: {
  item: FurnitureItem;
  cellSize: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragStart: (e: React.MouseEvent, id: string, itemX: number, itemY: number) => void;
}) {
  const template = FURNITURE_TEMPLATES.find((t) => t.type === item.type);
  const icon = template?.icon ?? "📦";

  const style: React.CSSProperties = {
    position: "absolute",
    left: item.x * cellSize,
    top: item.y * cellSize,
    width: item.width * cellSize,
    height: item.height * cellSize,
    backgroundColor: item.color ?? "#6b7280",
    border: isSelected ? "2px solid #3730a3" : "1px solid rgba(0,0,0,0.2)",
    borderRadius: 4,
    cursor: "grab",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    boxShadow: isSelected
      ? "0 0 0 2px rgba(55,48,163,0.4)"
      : "0 1px 3px rgba(0,0,0,0.2)",
    zIndex: isSelected ? 10 : 1,
    transition: "box-shadow 0.1s",
    overflow: "hidden",
  };

  return (
    <div
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item.id);
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onDragStart(e, item.id, item.x, item.y);
      }}
    >
      <span style={{ fontSize: Math.min(cellSize * 0.5, 28) }}>{icon}</span>
      {item.height * cellSize > 28 && (
        <span
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            padding: "0 2px",
            lineHeight: 1.2,
            fontWeight: 600,
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          {item.label}
        </span>
      )}
    </div>
  );
}

export function RoomCanvas({
  state,
  cellSize,
  showGrid,
  canvasBackground,
  wallColor,
  floorColor,
}: RoomCanvasProps) {
  const { room, items, selectedId, setSelectedId, addItem, moveItem, draggingNewType } = state;
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);

  const cols = room.width;
  const rows = room.length;

  const canvasWidth = cols * cellSize;
  const canvasHeight = rows * cellSize;

  const getGridPos = useCallback(
    (clientX: number, clientY: number): { gx: number; gy: number } => {
      if (!canvasRef.current) return { gx: 0, gy: 0 };
      const rect = canvasRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      return {
        gx: Math.floor(x / cellSize),
        gy: Math.floor(y / cellSize),
      };
    },
    [cellSize]
  );

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragState) return;
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const dx = e.clientX - dragState.startMouseX;
      const dy = e.clientY - dragState.startMouseY;
      const dCols = Math.round(dx / cellSize);
      const dRows = Math.round(dy / cellSize);
      const newX = Math.max(0, Math.min(cols - 1, dragState.startItemX + dCols));
      const newY = Math.max(0, Math.min(rows - 1, dragState.startItemY + dRows));
      moveItem(dragState.itemId, newX, newY);
    },
    [dragState, cellSize, cols, rows, moveItem]
  );

  const handleCanvasMouseUp = useCallback(() => {
    setDragState(null);
  }, []);

  const handleItemDragStart = useCallback(
    (e: React.MouseEvent, id: string, itemX: number, itemY: number) => {
      setSelectedId(id);
      setDragState({
        itemId: id,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startItemX: itemX,
        startItemY: itemY,
      });
    },
    [setSelectedId]
  );

  // Drop from sidebar
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("furnitureType") as FurnitureType;
      if (!type) return;
      const { gx, gy } = getGridPos(e.clientX, e.clientY);
      const clampedX = Math.max(0, Math.min(cols - 1, gx));
      const clampedY = Math.max(0, Math.min(rows - 1, gy));
      addItem(type, clampedX, clampedY);
    },
    [getGridPos, addItem, cols, rows]
  );

  // Build grid lines
  const gridLines: React.ReactNode[] = [];
  if (showGrid) {
    for (let c = 0; c <= cols; c++) {
      gridLines.push(
        <line
          key={`v${c}`}
          x1={c * cellSize}
          y1={0}
          x2={c * cellSize}
          y2={canvasHeight}
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={0.5}
        />
      );
    }
    for (let r = 0; r <= rows; r++) {
      gridLines.push(
        <line
          key={`h${r}`}
          x1={0}
          y1={r * cellSize}
          x2={canvasWidth}
          y2={r * cellSize}
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={0.5}
        />
      );
    }
  }

  const WALL = 8;

  return (
    <div
      style={{
        position: "relative",
        overflow: "auto",
        flex: 1,
        background: canvasBackground,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 0,
      }}
    >
      {/* Room container */}
      <div
        style={{
          position: "relative",
          width: canvasWidth + WALL * 2,
          height: canvasHeight + WALL * 2,
          flexShrink: 0,
          margin: 24,
        }}
      >
        {/* Walls */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: `${WALL}px solid ${wallColor}`,
            borderRadius: 2,
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        {/* Floor / canvas */}
        <div
          ref={canvasRef}
          style={{
            position: "absolute",
            left: WALL,
            top: WALL,
            width: canvasWidth,
            height: canvasHeight,
            backgroundColor: floorColor,
            cursor: dragState ? "grabbing" : "default",
          }}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onClick={() => setSelectedId(null)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Grid SVG */}
          <svg
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            width={canvasWidth}
            height={canvasHeight}
          >
            {gridLines}
          </svg>

          {/* Furniture items */}
          {items.map((item) => (
            <FurnitureItemView
              key={item.id}
              item={item}
              cellSize={cellSize}
              isSelected={selectedId === item.id}
              onSelect={setSelectedId}
              onDragStart={handleItemDragStart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
