import { useEffect, useRef, useState } from 'react';
import { User } from '../../../models/User';
import { Message, MessageStatus } from '../../../models/Message';
import { useStore } from '../../../store/store';
import { useMessagesPaginated } from '../../../hooks/useMessagesPaginated';
import clsx from 'clsx';
import { throttle } from 'lodash';

function ChatBox({ me, target }: { me: User; target?: User | null }) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const on = useStore((store) => store.on);
  const emit = useStore((store) => store.emit);
  const off = useStore((store) => store.off);
  const isConnected = useStore((store) => store.isConnected);
  const { data: chatHistory } = useMessagesPaginated(target?._id || '');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView();
  }, [chat]);

  useEffect(() => {
    if (chatHistory) {
      // сортируем по createdAt, если нужно на клиенте
      const sortedChat = [...chatHistory].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setChat(sortedChat);
    }
  }, [chatHistory]);

  useEffect(() => {
    if (!isConnected) return;

    on('privateMessage', handlePrivateMessage);
    on('error', handleError);
    on('errorMessage', handleErrorMessage);
    on('typing', handleTyping);

    return () => {
      off('privateMessage', handlePrivateMessage);
      off('error', handleError);
      off('errorMessage', handleErrorMessage);
      off('typing', handleTyping);
    };
  }, [isConnected]);

  const handlePrivateMessage = (data: Message) => {
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

      return [...prevChat, data];
    });
  };

  const handleError = (error: any) => {
    console.error('Socket error:', error);
  };

  const handleErrorMessage = (error: any) => {
    console.error('Socket error message:', error);
  };

  const handleTyping = (userId: string) => {
    if (!target) return;
    if (userId === target._id) {
      setIsTyping(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => setIsTyping(false), 3000);
    }
  };

  const startTyping = throttle((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (target) {
      emit('typing', target._id);
    }
  }, 300);

  const sendMessage = () => {
    if (message && target?._id) {
      const tempId = 'temporary-id-' + Math.random().toString(36).substr(2, 9);
      const newMessage = {
        _id: tempId,
        to: target._id,
        from: me?._id || 'unknown',
        message,
        createdAt: new Date().toISOString(),
        status: MessageStatus.SENT,
      };

      setChat((prev) => [...prev, newMessage]);
      setMessage('');

      emit('privateMessage', newMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ padding: 20 }} className="bg-white w-full">
      <div className="flex justify-between">
        <h2>Private Chat 💬</h2>
        <p>{target?.name}</p>
      </div>

      <div
        className="flex flex-col gap-2"
        style={{
          border: '1px solid #ccc',
          height: 250,
          overflowY: 'auto',
          marginBottom: 10,
          padding: 10,
        }}
      >
        {chat.map((c) => (
          <div
            key={c._id}
            className={clsx('p-2 rounded-md bg-blue-100 max-w-2/3', {
              'self-end bg-orange': c.from === me._id,
            })}
          >
            <b>{c.from === me._id ? 'You' : target?.name}:</b> {c.message}{' '}
            <small style={{ color: '#888' }}>
              {new Date(c.createdAt || '').toLocaleTimeString()}
            </small>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {isTyping ? <p>{target?.name} is typing...</p> : <p></p>}

      <input
        placeholder="Message..."
        value={message}
        onChange={startTyping}
        onKeyDown={handleKeyPress}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatBox;
