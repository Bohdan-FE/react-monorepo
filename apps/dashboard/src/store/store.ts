import { create } from 'zustand';
import { createDateSlice, DateStore } from './slices/dateSlice';
import { createModalSlice, ModalState } from './slices/modalSlice';
import { createDragSlice, DragStore } from './slices/dragSlice';
import { createTaskSlice, TaskStore } from './slices/taskSlice';

export const useStore = create<
  DateStore & ModalState & DragStore & TaskStore
>()((...a) => ({
  ...createDateSlice(...a),
  ...createModalSlice(...a),
  ...createDragSlice(...a),
  ...createTaskSlice(...a),
}));
