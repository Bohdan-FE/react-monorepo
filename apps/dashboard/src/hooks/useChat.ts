import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../store/store';
import { Message, MessageStatus } from '../models/Message';
import { useQueryClient } from '@tanstack/react-query';

function useChat(targetId?: string, meId?: string) {
  const on = useStore((store) => store.on);
  const off = useStore((store) => store.off);
  const isConnected = useStore((store) => store.isConnected);

  const [isTyping, setIsTyping] = useState(false);
  const [chat, setChat] = useState<Message[]>([]);

  const chatRef = useRef<Message[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    chatRef.current = chat;
  }, [chat]);

  useEffect(() => {
    setChat([]);
    queryClient.resetQueries({ queryKey: ['messages', targetId] });
  }, [targetId, meId]);

  const handleMessageStatusUpdate = useCallback(
    (data: { messageId: string; status: MessageStatus }) => {
      setChat((prevChat) => {
        return prevChat.map((msg) =>
          msg._id === data.messageId ? { ...msg, status: data.status } : msg
        );
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessagesCount'] });
    },
    [targetId]
  );

  const handlePrivateMessage = useCallback(
    (data: Message) => {
      setChat((prevChat) => {
        const exists = prevChat.some((msg) => msg._id === data._id);
        if (exists) return prevChat;

        const tempIndex = prevChat.findIndex(
          (msg) =>
            msg.from === data.from &&
            msg.message === data.message &&
            msg._id.startsWith('temporary-id-')
        );

        if (tempIndex !== -1) {
          const updated = [...prevChat];
          updated[tempIndex] = data;
          return updated;
        }
        if (data.from === targetId || data.to === targetId) {
          return [...prevChat, data];
        }
        return prevChat;
      });

      if (data.from !== meId) {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['unreadMessagesCount'] });
      }

      setIsTyping(false);
    },
    [targetId]
  );

  const handleTyping = useCallback(
    (userId: string) => {
      if (!targetId) return;

      if (userId === targetId) {
        setIsTyping(true);

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => setIsTyping(false), 3000);
      }
    },
    [targetId]
  );

  const handleError = useCallback((err: any) => {
    console.error('🔥 Socket error:', err);
  }, []);

  const handleErrorMessage = useCallback((err: any) => {
    console.error('❌ Socket error message:', err);
  }, []);

  useEffect(() => {
    if (!isConnected) return;

    on('privateMessage', handlePrivateMessage);
    on('error', handleError);
    on('errorMessage', handleErrorMessage);
    on('typing', handleTyping);
    on('messageStatusUpdate', handleMessageStatusUpdate);

    return () => {
      off('privateMessage', handlePrivateMessage);
      off('error', handleError);
      off('errorMessage', handleErrorMessage);
      off('typing', handleTyping);
      off('messageStatusUpdate', handleMessageStatusUpdate);
      queryClient.resetQueries({ queryKey: ['messages', targetId] });
    };
  }, [
    isConnected,
    on,
    off,
    handlePrivateMessage,
    handleMessageStatusUpdate,
    handleTyping,
    handleError,
    handleErrorMessage,
    targetId,
  ]);

  return { chat, setChat, isTyping };
}

export { useChat };
