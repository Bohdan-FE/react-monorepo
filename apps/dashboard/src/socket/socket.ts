import { io } from 'socket.io-client';

// connect to your backend
export const socket = io('http://localhost:3000', {
  transports: ['websocket'], // optional but recommended
});
