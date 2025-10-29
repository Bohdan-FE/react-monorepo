import { useEffect, useRef, useState } from 'react';
import { User } from '../../../models/User';
import { Message, MessageStatus } from '../../../models/Message';
import { useStore } from '../../../store/store';
import { useMessagesPaginated } from '../../../hooks/useMessagesPaginated';
import clsx from 'clsx';
import { throttle } from 'lodash';
import { useQueryClient } from '@tanstack/react-query';
import { InfinityScrollContainer } from '@acme/ui';
import { IoCheckmarkDoneSharp, IoCheckmarkOutline } from 'react-icons/io5';

function ChatBox({ me, target }: { me: User; target?: User | null }) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const on = useStore((store) => store.on);
  const emit = useStore((store) => store.emit);
  const off = useStore((store) => store.off);
  const isConnected = useStore((store) => store.isConnected);
  const {
    data: chatHistory,
    hasNext,
    fetchNext,
  } = useMessagesPaginated({
    userId: target?._id || '',
    enabled: !!target?._id,
  });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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

      queryClient.invalidateQueries({ queryKey: ['users'] });
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
    <div
      style={{ padding: 20 }}
      className="bg-white/50 w-full flex flex-col h-full backdrop-blur-sm"
    >
      <div className="flex justify-between">
        <h2>Private Chat 💬</h2>
        <p>{target?.name}</p>
      </div>
      <div
        className="flex-1"
        style={{
          border: '1px solid #ccc',
          overflowY: 'auto',
          marginBottom: 10,
          padding: 10,
        }}
      >
        <InfinityScrollContainer
          loadMore={fetchNext}
          hasMore={!!hasNext}
          reverse
        >
          <div className="flex flex-col gap-2 justify-end min-h-full">
            {chat.map((c) => (
              <MessageItem key={c._id} message={c} me={me} target={target!} />
            ))}
            <div ref={chatEndRef} />
          </div>
        </InfinityScrollContainer>
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

const MessageItem = ({
  message,
  me,
  target,
}: {
  message: Message;
  me: User;
  target: User;
}) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const emit = useStore((store) => store.emit);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          (message.status === MessageStatus.DELIVERED ||
            message.status === MessageStatus.SENT) &&
          message.from === target._id
        ) {
          console.log('Message read:', message._id);
          emit('messageRead', message._id);
        }
      },
      { threshold: 0.5 }
    );

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => {
      if (messageRef.current) {
        observer.unobserve(messageRef.current);
      }
    };
  }, [message.status, message.from, target._id, message._id, emit]);

  return (
    <div
      ref={messageRef}
      className={clsx('flex gap-1 items-end max-w-[65%] ', {
        'self-end': message.from === me._id,
        'flex-row-reverse self-start': message.from === target._id,
      })}
    >
      <div
        className={clsx('rounded-xl shadow-small p-3 px-6 space-y-2 mb-4', {
          'bg-blue-light rounded-br-none': message.from === me._id,
          'bg-yellow text-black rounded-bl-none': message.from === target._id,
        })}
      >
        <p className="">{message.message}</p>
        <div
          className={clsx('flex items-end gap-2', {
            'justify-start flex-row-reverse': message.from === me._id,
            'justify-end ': message.from === target._id,
          })}
        >
          <p className="italic text-black/50 text-xs">
            {new Date(message.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
            })}{' '}
            {new Date(message.createdAt).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </p>

          {message.status === MessageStatus.SENT && (
            <IoCheckmarkOutline className="text-black/50" />
          )}
          {message.status === MessageStatus.DELIVERED && (
            <IoCheckmarkDoneSharp className="text-black/50 font-bold" />
          )}
          {message.status === MessageStatus.READ && (
            <IoCheckmarkDoneSharp className="text-blue font-bold" />
          )}
        </div>
      </div>
      <div className="size-[3rem] shrink-0 rounded-full overflow-hidden">
        <img
          className="size-full object-center object-cover"
          src="/jiraiya.png"
        />
      </div>
    </div>
  );
};
