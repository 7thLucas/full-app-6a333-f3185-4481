import { useState, useCallback } from "react";
import { nanoid } from "~/room-designer/utils/nanoid";
import type { FurnitureItem, FurnitureType, RoomConfig, FurnitureTemplate } from "~/room-designer/types";
import { FURNITURE_TEMPLATES } from "~/room-designer/types";

export function useRoomDesigner(initialRoom: RoomConfig) {
  const [room, setRoom] = useState<RoomConfig>(initialRoom);
  const [items, setItems] = useState<FurnitureItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingNewType, setDraggingNewType] = useState<FurnitureType | null>(null);

  const addItem = useCallback((type: FurnitureType, gridX: number, gridY: number) => {
    const template = FURNITURE_TEMPLATES.find((t) => t.type === type);
    if (!template) return;

    const newItem: FurnitureItem = {
      id: nanoid(),
      type,
      label: template.label,
      x: gridX,
      y: gridY,
      width: template.defaultWidth,
      height: template.defaultHeight,
      rotation: 0,
      color: template.color,
    };
    setItems((prev) => [...prev, newItem]);
    setSelectedId(newItem.id);
  }, []);

  const moveItem = useCallback((id: string, x: number, y: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, x, y } : item))
    );
  }, []);

  const resizeItem = useCallback((id: string, width: number, height: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, width: Math.max(1, width), height: Math.max(1, height) } : item
      )
    );
  }, []);

  const rotateItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newRotation = (item.rotation + 90) % 360;
        // swap width/height on rotate
        return { ...item, rotation: newRotation, width: item.height, height: item.width };
      })
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  const updateRoom = useCallback((updates: Partial<RoomConfig>) => {
    setRoom((prev) => ({ ...prev, ...updates }));
  }, []);

  const clearRoom = useCallback(() => {
    setItems([]);
    setSelectedId(null);
  }, []);

  const selectedItem = items.find((i) => i.id === selectedId) ?? null;

  return {
    room,
    items,
    selectedId,
    selectedItem,
    draggingNewType,
    setDraggingNewType,
    addItem,
    moveItem,
    resizeItem,
    rotateItem,
    deleteItem,
    updateRoom,
    clearRoom,
    setSelectedId,
  };
}

export type RoomDesignerState = ReturnType<typeof useRoomDesigner>;
