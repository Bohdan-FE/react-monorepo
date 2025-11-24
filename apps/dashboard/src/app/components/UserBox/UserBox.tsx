import clsx from 'clsx';
import { useAcceptFriendship } from '../../../hooks/useAcceptFriendship';
import { useRejectFriendRequest } from '../../../hooks/useRejectFriend';
import { useRemoveFriend } from '../../../hooks/useRemoveFriend';
import { useRequestFriend } from '../../../hooks/useRequestFriend';
import { User } from '../../../models/User';
import { useStore } from '../../../store/store';
import { MdPersonAddDisabled } from 'react-icons/md';
import { IoPersonAdd } from 'react-icons/io5';
import { TbCancel } from 'react-icons/tb';
import { FaUserCheck } from 'react-icons/fa';

function UserBox({ user }: { user: User }) {
  const selectUser = useStore((store) => store.selectUser);
  const selectedUser = useStore((store) => store.selectedUser);
  const { mutate: sendFriendRequest } = useRequestFriend();
  const { mutate: rejectFriendRequest } = useRejectFriendRequest();
  const { mutate: removeFriend } = useRemoveFriend();
  const { mutate: acceptFriendRequest } = useAcceptFriendship();

  const sendFriendRequestHandler = (
    e: React.MouseEvent<HTMLButtonElement>,
    userId: string
  ) => {
    e.stopPropagation();
    sendFriendRequest(userId);
  };

  const rejectFriendRequestHandler = (
    e: React.MouseEvent<HTMLButtonElement>,
    userId: string
  ) => {
    e.stopPropagation();
    rejectFriendRequest(userId);
  };

  const removeFriendHandler = (
    e: React.MouseEvent<HTMLButtonElement>,
    userId: string
  ) => {
    e.stopPropagation();
    removeFriend(userId);
  };

  const acceptFriendRequestHandler = (
    e: React.MouseEvent<HTMLButtonElement>,
    userId: string
  ) => {
    e.stopPropagation();
    acceptFriendRequest(userId);
  };

  return (
    <div
      className={clsx(
        'cursor-pointer p-2 rounded-2xl border-2 min-w-[16.875rem] group  shadow-small flex items-center justify-between gap-4 relative transition-colors',
        selectedUser?._id === user._id && 'bg-blue-dark text-white',
        selectedUser?._id !== user._id && 'bg-white'
      )}
      onClick={() => selectUser(user)}
    >
      <div className="flex items-center max-w-1/2 gap-1">
        <div className="size-[3rem] shrink-0  relative">
          <div className="w-full h-full rounded-full overflow-hidden border-2">
            <img
              src={user.avatarURL || '/jiraiya.png'}
              alt={user.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {user.isOnline && (
            <div className="absolute bottom-[0.1rem] right-[0.1rem] size-3 rounded-full border-2 border-white bg-green-500"></div>
          )}
        </div>

        <div className="flex flex-col ">
          <p className="font-semibold text-md truncate">{user.name}</p>
          {user.lastMessage && (
            <p className="text-sm opacity-70 line-clamp-2 max-w-[10rem] leading-none">
              {user.lastMessage.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {user.relationshipStatus === 'none' && (
          <button
            className={styles.button + ' bg-pink text-white'}
            onClick={(event) => sendFriendRequestHandler(event, user._id)}
          >
            <IoPersonAdd className="shrink-0 text-base" />
            <p className="truncate">Add friend</p>
          </button>
        )}
        {user.relationshipStatus === 'request_sent' && (
          <>
            <button
              className={styles.button + ' bg-orange text-white'}
              onClick={(event) => rejectFriendRequestHandler(event, user._id)}
            >
              <TbCancel className="shrink-0 text-base" />
              <p className="truncate">Cancel Request</p>
            </button>
          </>
        )}
        {user.relationshipStatus === 'request_received' && (
          <>
            <button
              className={styles.button + ' bg-orange text-white'}
              onClick={(event) => acceptFriendRequestHandler(event, user._id)}
            >
              <FaUserCheck className="shrink-0 text-base" />
              <p className="truncate">Accept</p>
            </button>
            <button
              className={styles.button + ' bg-blue text-white'}
              onClick={(event) => rejectFriendRequestHandler(event, user._id)}
            >
              <TbCancel className="shrink-0 text-base" />
              <p className="truncate">Reject</p>
            </button>
          </>
        )}
        {user.relationshipStatus === 'friend' && (
          <button
            className={styles.button + ' bg-blue text-white'}
            onClick={(event) => removeFriendHandler(event, user._id)}
          >
            <MdPersonAddDisabled className="shrink-0 text-base" />
            <p className="truncate">Remove Friend</p>
          </button>
        )}
      </div>

      {user.relationshipStatus === 'request_received' && (
        <div className="left-1/2 top-0 translate-[-50%] absolute px-2 py-1 rounded-3xl bg-orange  text-sm border">
          <p className="text-[0.75rem]">New request!</p>
        </div>
      )}

      {user.unreadCount > 0 && (
        <div className="ml-auto rounded-full bg-orange border-2 shadow-small text-sm px-2 aspect-square flex items-center justify-center self-start shrink-0 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
          <p className="leading-none">{user.unreadCount}</p>
        </div>
      )}
    </div>
  );
}

export default UserBox;

const styles = {
  button:
    'rounded-full h-8 px-2 shadow-small text-sm  font-light active:scale-95 justify-center active:shadow-none items-center grid grid-cols-[minmax(0px,auto)_minmax(0px,0fr)] hover:grid-cols-[minmax(0px,auto)_minmax(0px,1fr)] hover:gap-1 transition-all',
};
