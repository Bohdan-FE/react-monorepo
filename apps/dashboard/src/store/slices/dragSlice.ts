import { StateCreator } from 'zustand';
import { Task } from '../../hooks/useTasks';

type DragData = Task | undefined | null;

export interface DragStore {
  dragData: DragData;
  draggableElement: (EventTarget & Element) | null;
  position: {
    x: number;
    y: number;
  };
  previewSize: { width: number; height: number };
  offset: { x: number; y: number };
  endPosition: { x: number; y: number };
  setEndPosition: (position: { x: number; y: number }) => void;
  setDraggableElement: (element: (EventTarget & Element) | null) => void;
  setDragData: (data: DragData) => void;
  setOnDragEnd: (fn: () => void) => void;
  onDragEnd: () => void;
  setPosition: (position: { x: number; y: number }) => void;
  setPreview: (size: { width: number; height: number }) => void;
  setOffset: (offset: { x: number; y: number }) => void;
}

export const createDragSlice: StateCreator<
  DragStore,
  [],
  [],
  DragStore
> = set => ({
  dragData: null,
  draggableElement: null,
  position: { x: 0, y: 0 },
  previewSize: { width: 0, height: 0 },
  offset: { x: 0, y: 0 },
  endPosition: { x: 0, y: 0 },
  setEndPosition: position => set(() => ({ endPosition: position })),
  setOffset: offset => set(() => ({ offset })),
  setPosition: position => set(() => ({ position })),
  setDraggableElement: element => set(() => ({ draggableElement: element })),
  setDragData: data => set(() => ({ dragData: data })),
  setOnDragEnd: fn => set(() => ({ onDragEnd: fn })),
  onDragEnd: () => {},
  setPreview: size =>
    set(() => ({
      previewSize: size,
    })),
});
