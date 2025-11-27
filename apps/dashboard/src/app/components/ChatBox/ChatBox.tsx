import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { MessageStatus } from '../../../models/Message';
import { useStore } from '../../../store/store';

import { throttle } from 'lodash';
import { useQueryClient } from '@tanstack/react-query';

import { IoSend } from 'react-icons/io5';
import { MdOutlineDoubleArrow } from 'react-icons/md';
import { useChat } from '../../../hooks/useChat';
import { useUser } from '../../../hooks/useUser';
import ChatHistory from './components/ChatHistory';
import SendFile from './components/SendFile';
import useUploadImageMessage from '../../../hooks/useUploadMessageImage';
import { LuTrash2 } from 'react-icons/lu';

function ChatBox() {
  const [message, setMessage] = useState('');
  const { data: me } = useUser();
  const target = useStore((store) => store.selectedUser);
  const emit = useStore((store) => store.emit);
  const isConnected = useStore((store) => store.isConnected);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const { chat, setChat, isTyping } = useChat(target?._id, me?._id);
  const uploadImageMutation = useUploadImageMessage();
  const [file, setFile] = useState<File | null>(null);

  useLayoutEffect(() => {
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
        threshold: 0,
        rootMargin: '400px',
        root: containerRef.current || undefined,
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

  const throttledTyping = useMemo(
    () =>
      throttle((id: string) => {
        emit('typing', id);
      }, 600),
    []
  );

  const startTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (target) {
      throttledTyping(target._id);
    }
  };

  const sendMessage = () => {
    if (!target?._id || !me?._id) return;

    if (!message && !file) return;

    const tempId = 'temporary-id-' + Math.random().toString(36).substr(2, 9);

    const tempMessage: any = {
      _id: tempId,
      to: target._id,
      from: me._id,
      createdAt: new Date().toISOString(),
      status: MessageStatus.SENT,
    };

    if (message) tempMessage.message = message;

    if (file) tempMessage.imageUrl = URL.createObjectURL(file);

    setChat((prev) => [...prev, tempMessage]);
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    setMessage('');
    setFile(null);

    if (!file) {
      emit('privateMessage', tempMessage);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      return;
    }

    uploadImageMutation.mutate(file, {
      onSuccess: (data) => {
        const finalMessage = {
          ...tempMessage,
          imageUrl: data.imageUrl,
        };

        emit('privateMessage', finalMessage);

        setChat((prev) =>
          prev.map((m) =>
            m._id === tempId ? { ...m, imageUrl: data.imageUrl } : m
          )
        );

        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!target || !isConnected || !me) {
    return (
      <div className="bg-blue/70 py-8 px-4 w-full flex flex-col justify-center items-center h-full backdrop-blur-sm rounded-2xl shadow-big overflow-hidden border-2">
        <div
          className=" flex-1  w-full overflow-y-auto rounded-xl border-2 mx-4 bg-[url('/naruto-chat-bg.jpg')] bg-size-[20%_auto]"
          ref={containerRef}
        >
          <div className="bg-white/30 p-2 min-h-full flex items-center justify-center backdrop-blur-sm">
            <p className="text-center text-xl font-bold">
              Select a user to start chatting
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue/70 w-full flex flex-col h-full backdrop-blur-sm rounded-2xl shadow-big overflow-hidden border-2">
      <div className="flex justify-between p-2">
        {target && (
          <div className="flex items-center gap-2">
            <div className="size-[3rem] shrink-0  relative">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src={target.avatarURL || '/jiraiya.png'}
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
        {isTyping ? <p>{target?.name} is typing...</p> : <p></p>}
      </div>
      <div
        className=" flex-1 overflow-y-auto rounded-xl border-2 mx-4 bg-[url('/naruto-chat-bg.jpg')] bg-size-[20%_auto]"
        ref={containerRef}
      >
        <div className="bg-white/30 p-2 min-h-full flex items-end ">
          <ChatHistory
            chat={chat}
            setChat={setChat}
            me={me}
            target={target}
            chatEndRef={chatEndRef}
            scrollRef={containerRef}
          />
        </div>
        <div ref={chatEndRef}></div>
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
        {file && (
          <div className="h-[3rem] mb-4 flex gap-4 items-center">
            <img
              src={URL.createObjectURL(file)}
              alt="Selected file preview"
              className="h-full object-contain rounded-md"
            />

            <LuTrash2
              className="cursor-pointer"
              onClick={() => setFile(null)}
            />
          </div>
        )}
        <div className="flex gap-4">
          <textarea
            id="chat-message-input"
            name="chat-message-input"
            className="!bg-white p-2 rounded-xl w-full field-sizing-content max-h-[8rem] resize-none border-2 focus:outline-none"
            placeholder="Message..."
            value={message}
            onChange={startTyping}
            onKeyDown={handleKeyPress}
            rows={1}
          />
          <SendFile setFile={setFile} />
          <button
            className="px-3 rounded-md shadow-small flex items-center justify-center bg-pink active:shadow-none active:scale-95 transition-all"
            onClick={sendMessage}
          >
            <IoSend className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
