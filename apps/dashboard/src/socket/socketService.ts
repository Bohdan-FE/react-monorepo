import { io, Socket } from 'socket.io-client';

export type SocketEvents =
  | 'connect'
  | 'disconnect'
  | 'connect_error'
  | 'registered'
  | 'privateMessage'
  | 'messageStatusUpdate'
  | 'error'
  | 'errorMessage'
  | 'typing'
  | 'stopTyping'
  | 'userOnline'
  | 'userOffline';

class SocketService {
  private socket: Socket | null = null;
  private url: string | null = null;
  private token: string | null = null;

  /**
   * Connect to socket server with optional JWT token
   */
  connect(url: string, token?: string): Socket {
    // Already connected? Just return the existing socket.
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    // If already created but not connected yet, just reuse it.
    if (this.socket && !this.socket.connected) {
      this.socket.connect();
      return this.socket;
    }

    this.url = url;
    this.token = token || null;

    this.socket = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      autoConnect: false,
      auth: token ? { token } : undefined,
    });

    this.registerBaseListeners();
    this.socket.connect();

    console.log('🧩 Connecting to socket:', url);
    return this.socket;
  }

  /**
   * Cleanly disconnect from socket
   */
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting socket');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Listen for specific event
   */
  on<T = any>(event: SocketEvents | string, callback: (data: T) => void) {
    this.socket?.on(event, callback);
  }

  /**
   * Stop listening for specific event
   */
  off<T = any>(event: SocketEvents | string, callback?: (data: T) => void) {
    this.socket?.off(event, callback);
  }

  /**
   * Emit event with optional data
   */
  emit(event: string, data?: any) {
    if (!this.socket?.connected) {
      console.warn('⚠️ Tried to emit before connection was established');
      return;
    }
    this.socket.emit(event, data);
  }

  /**
   * Promise-based connection (waits until connected)
   */
  async waitForConnection(timeout = 5000): Promise<void> {
    if (this.socket?.connected) return;

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error('Socket connection timeout')),
        timeout
      );

      this.socket?.once('connect', () => {
        clearTimeout(timer);
        resolve();
      });

      this.socket?.connect();
    });
  }

  /**
   * Reconnect manually (if token changed)
   */
  reconnectWithToken(token: string) {
    if (!this.url) throw new Error('No previous socket URL');
    this.disconnect();
    this.connect(this.url, token);
  }

  /**
   * Basic connection event listeners
   */
  private registerBaseListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      if (this.token) {
        this.socket?.emit('register', this.token);
        console.log('✅ Socket registered with token:', this.token);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('⚠️ Socket connection error:', err.message);
    });
  }

  /**
   * Getter for direct socket instance
   */
  get instance() {
    return this.socket;
  }
}

export const socketService = new SocketService();
