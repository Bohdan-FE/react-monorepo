import { JSX } from 'react';
import { StateCreator } from 'zustand';

type StoreState = {
  modal: null | JSX.Element;
};

type StoreActions = {
  openModal: (modal: JSX.Element) => void;
  closeModal: () => void;
};

export type ModalState = StoreState & StoreActions;

export const createModalSlice: StateCreator<ModalState, [], [], ModalState> = (
  set
) => ({
  modal: null,
  openModal: (modal: JSX.Element) => set(() => ({ modal })),
  closeModal: () => set({ modal: null }),
});
