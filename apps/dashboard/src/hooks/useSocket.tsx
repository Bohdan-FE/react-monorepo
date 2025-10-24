import { useEffect, useState, useCallback } from 'react';

import type { Socket } from 'socket.io-client';
import { socketService } from '../socket/socketService';

interface UseSocketOptions {
  url: string;
  token?: string;
  autoConnect?: boolean;
}

export function useSocket({
  url,
  token,
  autoConnect = true,
}: UseSocketOptions) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Connect to socket
  useEffect(() => {
    if (!autoConnect) return;

    const sock = socketService.connect(url, token);
    setSocket(sock);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    sock.on('connect', handleConnect);
    sock.on('disconnect', handleDisconnect);

    return () => {
      sock.off('connect', handleConnect);
      sock.off('disconnect', handleDisconnect);
      socketService.disconnect();
    };
  }, [url, token, autoConnect]);

  // Emit safely
  const emit = useCallback(
    (event: string, data?: any) => {
      if (!socket || !socket.connected) {
        console.warn(`⚠️ Cannot emit "${event}" — socket not connected`);
        return;
      }
      socket.emit(event, data);
    },
    [socket]
  );

  // Subscribe to event with auto-cleanup
  const on = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      if (!socket) return;
      socket.on(event, callback);
      return () => socket.off(event, callback);
    },
    [socket]
  );

  return {
    socket,
    isConnected,
    emit,
    on,
  };
}
