import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useMessagesPaginated } from '../../../../hooks/useMessagesPaginated';
import { Message } from '../../../../models/Message';
import MessageItem from './MessageItem';
import { InfiniteScrollContainer } from '@acme/ui';
import { User } from '../../../../models/User';

interface ChatHistoryProps {
  chat: Message[];
  setChat: React.Dispatch<React.SetStateAction<Message[]>>;
  me: User;
  target: User;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

function ChatHistory({
  chat,
  setChat,
  me,
  target,
  chatEndRef,
  scrollRef,
}: ChatHistoryProps) {
  const previousScrollHeightRef = useRef<number | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const {
    data: chatHistory,
    hasNext,
    fetchNext,
    isFetchingNextPage,
  } = useMessagesPaginated({
    userId: target._id,
    enabled: !!target._id,
  });

  useLayoutEffect(() => {
    if (!chat.length) return;
    if (isInitialLoad) {
      chatEndRef.current?.scrollIntoView();
      setIsInitialLoad(false);
    } else {
      const container = scrollRef.current;
      if (container) {
        const newScrollHeight = container.scrollHeight;
        if (previousScrollHeightRef.current === null) {
          previousScrollHeightRef.current = newScrollHeight;
        }
        const scrollDifference =
          newScrollHeight - previousScrollHeightRef.current;
        container.scrollTop += scrollDifference;
      }
    }
  }, [chat]);

  useLayoutEffect(() => {
    if (chatHistory) {
      const container = scrollRef.current;
      if (container && !isInitialLoad) {
        previousScrollHeightRef.current = container.scrollHeight;
      }
      const reversedChatHistory = [...chatHistory].reverse();
      setChat(reversedChatHistory);
    }
  }, [chatHistory, isInitialLoad]);

  return (
    <div
      className="flex flex-col gap-2 justify-end min-h-full w-full overflow-y-auto"
      ref={scrollRef}
    >
      <InfiniteScrollContainer loadMore={fetchNext} hasNext={!!hasNext} />

      {isFetchingNextPage && <div className="loader mx-auto my-4"></div>}
      {chat.map((c, i) => (
        <MessageItem
          key={c._id + '-' + i}
          message={c}
          me={me}
          target={target}
          setChat={setChat}
        />
      ))}

      <div ref={chatEndRef} />
    </div>
  );
}
export default ChatHistory;
