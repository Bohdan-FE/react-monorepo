import { create } from 'zustand';
import { createDateSlice, DateStore } from './slices/dateSlice';
import { createModalSlice, ModalState } from './slices/modalSlice';
import { createDragSlice, DragStore } from './slices/dragSlice';

export const useStore = create<DateStore & ModalState & DragStore>()(
  (...a) => ({
    ...createDateSlice(...a),
    ...createModalSlice(...a),
    ...createDragSlice(...a),
  })
);
