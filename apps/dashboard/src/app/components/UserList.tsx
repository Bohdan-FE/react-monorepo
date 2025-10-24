import { useRequestFriend } from '../../hooks/useRequestFriend';
import { useAcceptFriendship } from '../../hooks/useAcceptFriendship';
import { useRejectFriendRequest } from '../../hooks/useRejectFriend';
import { useRemoveFriend } from '../../hooks/useRemoveFriend';
import useUsersPaginated from '../../hooks/useUsersPaginated';
import { useStore } from '../../store/store';

function UserList() {
  const { data: users } = useUsersPaginated();
  const { mutate: sendFriendRequest } = useRequestFriend();
  const { mutate: rejectFriendRequest } = useRejectFriendRequest();
  const { mutate: removeFriend } = useRemoveFriend();
  const { mutate: acceptFriendRequest } = useAcceptFriendship();
  const selectUser = useStore((store) => store.selectUser);

  return (
    <div className="bg-green-400">
      <h3>User List</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <img
              src={user.avatarUrl || '/jiraiya.png'}
              alt={user.name}
              width={30}
              height={30}
              style={{ borderRadius: '50%', marginRight: 10 }}
              className="cursor-pointer"
              onClick={() => selectUser(user)}
            />
            <p>
              {user.name} - Status: {user.relationshipStatus}
            </p>

            <div className="flex gap-6">
              {/* <button>Send Message</button> */}
              {user.relationshipStatus === 'none' && (
                <button onClick={() => sendFriendRequest(user._id)}>
                  Send Friend Request
                </button>
              )}
              {user.relationshipStatus === 'friend' && (
                <button onClick={() => removeFriend(user._id)}>Unfriend</button>
              )}
              {user.relationshipStatus === 'request_received' && (
                <>
                  <button onClick={() => acceptFriendRequest(user._id)}>
                    Accept Friend Request
                  </button>
                  <button onClick={() => rejectFriendRequest(user._id)}>
                    Reject Friend Request
                  </button>
                </>
              )}
              {user.relationshipStatus === 'request_sent' && (
                <button onClick={() => rejectFriendRequest(user._id)}>
                  Unsend Friend Request
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
