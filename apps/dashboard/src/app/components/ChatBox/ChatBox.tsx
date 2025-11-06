import { use, useEffect, useRef, useState } from 'react';
import { User } from '../../../models/User';
import { Message, MessageStatus } from '../../../models/Message';
import { useStore } from '../../../store/store';
import { useMessagesPaginated } from '../../../hooks/useMessagesPaginated';
import clsx from 'clsx';
import { throttle } from 'lodash';
import { useQueryClient } from '@tanstack/react-query';
import { InfiniteScrollContainer } from '@acme/ui';
import {
  IoCheckmarkDoneSharp,
  IoCheckmarkOutline,
  IoSend,
} from 'react-icons/io5';
import { MdOutlineDoubleArrow } from 'react-icons/md';

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
    isFetchingNextPage,
    isLoading,
  } = useMessagesPaginated({
    userId: target?._id || '',
    enabled: !!target?._id,
  });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    if (!chat.length) return;
    if (isInitialLoad) {
      chatEndRef.current?.scrollIntoView();
      setIsInitialLoad(false);
    } else {
      const container = containerRef.current;
      if (container) {
        const newScrollHeight = container.scrollHeight;
        const scrollDifference =
          newScrollHeight - previousScrollHeightRef.current;
        container.scrollTop += scrollDifference;
      }
    }
  }, [chat]);

  useEffect(() => {
    if (chatHistory) {
      const container = containerRef.current;
      if (container && !isInitialLoad) {
        previousScrollHeightRef.current = container.scrollHeight;
      }

      const sortedChat = [...chatHistory].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setChat(sortedChat);
    }
  }, [chatHistory, isInitialLoad]);

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

      queryClient.resetQueries({ queryKey: ['messages', target?._id] });
    };
  }, [isConnected]);

  useEffect(() => {
    const interceptor = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsAtBottom(true);
          } else {
            setIsAtBottom(false);
          }
        });
      },
      {
        root: null, // viewport
        rootMargin: '0px 0px 1000px 0px', // start observing 100px before the element is visible
        threshold: 0,
      }
    );
    if (chatEndRef.current) {
      interceptor.observe(chatEndRef.current);
    }
    return () => {
      if (chatEndRef.current) {
        interceptor.unobserve(chatEndRef.current);
      }
    };
  }, [chatEndRef]);

  const handleMessageStatusUpdate = (data: {
    messageId: string;
    status: MessageStatus;
  }) => {
    setChat((prevChat) =>
      prevChat.map((msg) =>
        msg._id === data.messageId ? { ...msg, status: data.status } : msg
      )
    );
    queryClient.invalidateQueries({ queryKey: ['users'] });
    queryClient.invalidateQueries({ queryKey: ['unreadMessagesCount'] });
  };

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
    queryClient.setQueryData(['users'], (oldData: any) => {
      if (!oldData) return [];
      const updatedUsers = oldData.map((user: User) => {
        if (user._id === data.from) {
          return { ...user, lastMessage: data };
        }
        return user;
      });
      return updatedUsers;
    });

    setIsTyping(false);
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

  const startTyping = throttle((e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

      queryClient.invalidateQueries({ queryKey: ['users'] });

      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-blue/70 w-full flex flex-col h-full backdrop-blur-sm rounded-2xl shadow-big overflow-hidden border-2">
      <div className="flex justify-between p-2">
        {target && (
          <div className="flex items-center gap-2">
            <div className="size-[3rem] shrink-0  relative">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src={target.avatarUrl || '/jiraiya.png'}
                  alt={target.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {target.isOnline && (
                <div className="absolute bottom-[0.1rem] right-[0.1rem] size-3 rounded-full border-2 border-white bg-green-500"></div>
              )}
            </div>
            <div>
              <p className="font-semibold ">{target.name}</p>
              {target.isOnline ? (
                <span className="text-green-800">Online</span>
              ) : (
                <span className=" italic text-sm whitespace-nowrap">
                  Last online:{' '}
                  {new Date(target.lastSeen)
                    .toLocaleString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })
                    .replace(',', '')}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      <div
        className=" flex-1 overflow-y-auto rounded-xl border-2 p-2 mx-4 bg-[url('/naruto-chat-bg.jpg')] bg-size-[20%_auto]"
        ref={containerRef}
      >
        {!isLoading ? (
          <div className="flex flex-col gap-2 justify-end min-h-full">
            <InfiniteScrollContainer loadMore={fetchNext} hasNext={!!hasNext} />
            {isFetchingNextPage && <div className="loader mx-auto my-4"></div>}
            {chat.map((c) => (
              <MessageItem
                key={c._id}
                message={c}
                me={me}
                target={target!}
                setChat={setChat}
              />
            ))}
            <div ref={chatEndRef} />
          </div>
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </div>

      <div className="p-4 relative">
        <button
          className="bottom-[calc(100%+1rem)] left-1/2 translate-x-[-50%] bg-white border-2 shadow-small rounded-full p-2 z-2 absolute active:scale-95 active:shadow-none transition-all"
          style={{
            display: !isAtBottom ? 'block' : 'none',
          }}
          onClick={() => {
            containerRef.current?.scrollTo({
              top: containerRef.current.scrollHeight,
              behavior: 'smooth',
            });
          }}
        >
          <MdOutlineDoubleArrow className="rotate-[90deg] text-2xl" />
        </button>
        {isTyping ? <p>{target?.name} is typing...</p> : <p></p>}

        <div className="flex gap-4">
          <textarea
            id="chat-message-input"
            name="chat-message-input"
            className="bg-white p-2 rounded-xl w-full field-sizing-content max-h-[8rem] resize-none border-2 focus:outline-none"
            placeholder="Message..."
            value={message}
            onChange={startTyping}
            onKeyDown={handleKeyPress}
            rows={1}
          />
          <button
            className="px-4 rounded-md shadow-small flex items-center justify-center bg-pink active:shadow-none active:scale-95 transition-all"
            onClick={sendMessage}
          >
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;

const MessageItem = ({
  message,
  me,
  target,
  setChat,
}: {
  message: Message;
  me: User;
  target: User;
  setChat: React.Dispatch<React.SetStateAction<Message[]>>;
}) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const emit = useStore((store) => store.emit);
  const queryClient = useQueryClient();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          (message.status === MessageStatus.DELIVERED ||
            message.status === MessageStatus.SENT) &&
          message.from === target._id
        ) {
          emit('messageRead', message._id);
          setChat((prevChat) =>
            prevChat.map((msg) =>
              msg._id === message._id
                ? { ...msg, status: MessageStatus.READ }
                : msg
            )
          );
          queryClient.setQueryData(['unreadMessagesCount'], (oldData: any) => {
            if (!oldData) return 0;
            return oldData - 1;
          });
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
  }, [message.status, message.from, target?._id, message?._id, emit]);

  return (
    <div
      ref={messageRef}
      className={clsx('flex gap-1 items-end max-w-[65%]', {
        'self-end': message.from === me._id,
        'flex-row-reverse self-start': message.from === target?._id,
      })}
    >
      <div
        className={clsx(
          'rounded-xl shadow-small p-3 px-6 space-y-2 mb-4 min-w-[10rem]',
          {
            'bg-green-300 backdrop-blur-[1rem] rounded-br-none':
              message.from === me._id,
            'bg-purple-300 backdrop-blur-[1rem] rounded-bl-none ':
              message.from === target?._id,
          }
        )}
      >
        <p className="whitespace-pre-wrap">{message.message}</p>
        <div
          className={clsx('flex items-end gap-2', {
            'justify-end flex-row-reverse': message.from === me._id,
            'justify-end ': message.from === target?._id,
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
