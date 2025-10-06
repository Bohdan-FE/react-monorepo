import { StateCreator } from 'zustand';
import { Task } from '../../hooks/useTasks';

type StoreState = {
  selectedTask: Task | null;
};

type StoreActions = {
  selectTask: (task: Task | null) => void;
};

export type TaskStore = StoreState & StoreActions;

export const createTaskSlice: StateCreator<TaskStore, [], [], TaskStore> = (
  set
) => ({
  selectedTask: null,
  selectTask: (task: Task | null) => set(() => ({ selectedTask: task })),
});
