import { StateCreator } from 'zustand';
import { User } from '../../models/User';

type StoreState = {
  selectedUser: User | null;
};

type StoreActions = {
  selectUser: (user: User | null) => void;
};

export type UserStore = StoreState & StoreActions;

export const createUserSlice: StateCreator<UserStore> = (set) => ({
  selectedUser: null,
  selectUser: (user: User | null) => set(() => ({ selectedUser: user })),
});
