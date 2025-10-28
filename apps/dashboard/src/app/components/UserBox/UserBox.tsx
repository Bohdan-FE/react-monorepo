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

function UserBox({ user }: { user: User }) {
  const selectUser = useStore((store) => store.selectUser);
  const { mutate: sendFriendRequest } = useRequestFriend();
  const { mutate: rejectFriendRequest } = useRejectFriendRequest();
  const { mutate: removeFriend } = useRemoveFriend();
  const { mutate: acceptFriendRequest } = useAcceptFriendship();

  return (
    <div
      className={clsx(
        'cursor-pointer p-2 rounded-2xl border-2 min-w-[16.875rem] group bg-white'
      )}
      onClick={() => selectUser(user)}
    >
      <div className="flex items-center">
        <div className="size-[3rem] shrink-0  relative">
          <div className="w-full h-full rounded-full overflow-hidden">
            <img
              src={user.avatarUrl || '/jiraiya.png'}
              alt={user.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {user.isOnline && (
            <div className="absolute bottom-[0.1rem] right-[0.1rem] size-3 rounded-full border-2 border-white bg-green-500"></div>
          )}
        </div>

        <div className="flex flex-col ">
          <p className="font-semibold text-md">{user.name}</p>
          {/* {user.isOnline ? (
            <span className="text-green-500">Online</span>
          ) : (
            <span className="text-gray-500 italic text-sm whitespace-nowrap">
              Last online:{' '}
              {new Date(user.lastSeen)
                .toLocaleString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })
                .replace(',', '')}
            </span>
          )} */}

          {user.lastMessage && (
            <p className="text-sm text-gray-600 line-clamp-2 max-w-[10rem] leading-none">
              {user.lastMessage.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-rows-[minmax(0px,0fr)] group-hover:grid-rows-[minmax(0px,1fr)] overflow-hidden transition-all duration-200 ease-in-out">
        <div className="grid [direction:rtl] grid-cols-2 gap-2 mt-[0.25rem] transition-all duration-200 ease-in-out p-1">
          {/* <button>Send Message</button> */}
          {user.relationshipStatus === 'none' && (
            <button
              className={styles.button + ' bg-pink text-white'}
              onClick={() => sendFriendRequest(user._id)}
            >
              <IoPersonAdd className="shrink-0 text-base" />
              <p>Add to Friends</p>
            </button>
          )}
          {user.relationshipStatus === 'friend' && (
            <button
              className={styles.button + ' bg-blue text-white'}
              onClick={() => removeFriend(user._id)}
            >
              <MdPersonAddDisabled className="shrink-0 text-base" />
              <p>Remove Friend</p>
            </button>
          )}
          {user.relationshipStatus === 'request_received' && (
            <>
              <button
                className={styles.button + ' bg-orange'}
                onClick={() => acceptFriendRequest(user._id)}
              >
                <IoPersonAdd className="shrink-0 text-base" />
                <p>Accept Request</p>
              </button>
              <button
                className={styles.button + ' bg-blue text-white'}
                onClick={() => rejectFriendRequest(user._id)}
              >
                <MdPersonAddDisabled className="shrink-0" />
                <p>Reject Request</p>
              </button>
            </>
          )}
          {user.relationshipStatus === 'request_sent' && (
            <>
              <button
                className={styles.button + ' bg-orange text-white'}
                onClick={() => rejectFriendRequest(user._id)}
              >
                <TbCancel className="shrink-0 text-base" />
                <p>Cancel Request</p>
              </button>
              <div className="flex items-center ">
                <p className="text-sm italic text-gray-500">
                  Friends request sent
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserBox;

const styles = {
  button:
    'rounded-xl px-2 py-[0.25rem] shadow-small text-sm [direction:initial] font-light active:scale-95 justify-center active:shadow-none items-center flex gap-1',
};
