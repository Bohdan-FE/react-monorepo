import { useEffect, useRef, useState } from 'react';

import { useStore } from '../../../../store/store';
import { useQueryClient } from '@tanstack/react-query';
import { Message, MessageStatus } from '../../../../models/Message';
import clsx from 'clsx';
import { IoCheckmarkDoneSharp, IoCheckmarkOutline } from 'react-icons/io5';
import { User } from '../../../../models/User';
import ModalLayout from '../../../layout/ModalLayout';
import { IoIosCloseCircle } from 'react-icons/io';

interface MessageItemProps {
  message: Message;
  me: User;
  target: User;
  setChat: React.Dispatch<React.SetStateAction<Message[]>>;
}

const MessageItem = ({ message, me, target, setChat }: MessageItemProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const emit = useStore((store) => store.emit);
  const queryClient = useQueryClient();
  const meId = me._id;
  const targetId = target._id;

  const openModal = useStore((store) => store.openModal);
  const closeModal = useStore((store) => store.closeModal);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          (message.status === MessageStatus.DELIVERED ||
            message.status === MessageStatus.SENT) &&
          message.from === targetId
        ) {
          emit('messageRead', message._id);
          setChat((prevChat) =>
            prevChat.map((msg) =>
              msg._id === message._id
                ? { ...msg, status: MessageStatus.READ }
                : msg
            )
          );
          queryClient.invalidateQueries({ queryKey: ['unreadMessagesCount'] });
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
  }, [message.status, message.from, targetId, message._id, emit]);

  const openImage = () => {
    openModal(
      <ModalLayout>
        <div className="h-[80vh] w-[80vw] overflow-auto bg-blue-dark rounded-3xl shadow-big p-4 relative">
          <button
            className="top-4 right-4 absolute text-white text-3xl"
            onClick={() => closeModal()}
          >
            <IoIosCloseCircle />
          </button>
          <img
            className="size-full object-contain object-center"
            src={message.imageUrl}
            alt="Enlarged view"
          />
        </div>
      </ModalLayout>
    );
  };

  if (!targetId || !meId) return null;

  return (
    <div
      ref={messageRef}
      className={clsx('flex gap-2 items-end max-w-[65%] pr-1', {
        'self-end': message.from === meId,
        'flex-row-reverse self-start': message.from === targetId,
      })}
    >
      <div
        className={clsx(
          'rounded-xl shadow-small p-3  space-y-2 mb-4 min-w-[10rem]',
          {
            'bg-green-300 backdrop-blur-[1rem] rounded-br-none':
              message.from === meId,
            'bg-purple-300 backdrop-blur-[1rem] rounded-bl-none':
              message.from === targetId,
          }
        )}
      >
        {message.imageUrl && (
          <div
            className=" overflow-hidden h-[225px] relative cursor-pointer bg-white rounded-md"
            onClick={() => openImage()}
          >
            <img
              src={message.imageUrl}
              alt="Sent Image"
              width={225}
              height={225}
              className={clsx(
                'size-full  max-h-[225px] object-contain object-center rounded-md border-2 border-black'
              )}
            />
          </div>
        )}
        <p className="whitespace-pre-wrap">{message.message}</p>
        <div
          className={clsx('flex items-end gap-2', {
            'justify-end flex-row-reverse': message.from === meId,
            'justify-end ': message.from === targetId,
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
      <div className="size-[3rem] shrink-0 rounded-full overflow-hidden border-2 shadow-small bg-white">
        <img
          className="size-full object-center object-cover"
          src={
            message.from === meId
              ? me.avatarURL || '/jiraiya.png'
              : target.avatarURL || '/jiraiya.png'
          }
        />
      </div>
    </div>
  );
};
export default MessageItem;
