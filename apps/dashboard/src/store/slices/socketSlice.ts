import type { StateCreator } from 'zustand';

import type { Socket } from 'socket.io-client';
import { socketService } from '../../socket/socketService';

export interface SocketStore {
  socket: Socket | null;
  isConnected: boolean;
  connect: (url: string, token?: string) => void;
  disconnect: () => void;
  emit: (event: string, data?: any) => void;
  on: <T = any>(event: string, callback: (data: T) => void) => void;
  off: <T = any>(event: string, callback?: (data: T) => void) => void;
  once: <T = any>(event: string, callback: (data: T) => void) => void;
}

export const createSocketSlice: StateCreator<SocketStore> = (set, get) => ({
  socket: null,
  isConnected: false,

  connect: (url, token) => {
    const existing = get().socket;
    if (existing && existing.connected) return;

    const socket = socketService.connect(url, token);

    socket.on('connect', () => set({ isConnected: true }));
    socket.on('disconnect', () => set({ isConnected: false }));

    set({ socket });
  },

  disconnect: () => {
    socketService.disconnect();
    set({ socket: null, isConnected: false });
  },

  emit: (event, data) => {
    const socket = get().socket;
    if (!socket?.connected) {
      console.warn(`⚠️ Tried to emit "${event}" before socket was ready`);
      return;
    }
    socket.emit(event, data);
  },

  on: (event, callback) => {
    get().socket?.on(event, callback);
  },

  off: (event, callback) => {
    get().socket?.off(event, callback);
  },

  once: (event, callback) => {
    get().socket?.once(event, callback);
  },
});
