import { useRequestFriend } from '../../hooks/useRequestFriend';
import { useAcceptFriendship } from '../../hooks/useAcceptFriendship';
import { useRejectFriendRequest } from '../../hooks/useRejectFriend';
import { useRemoveFriend } from '../../hooks/useRemoveFriend';
import { useFriendsPaginated } from '../../hooks/useFriendsPaginated';
import { FriendshipStatus } from '../../models/User';

function FriendsList() {
  const { data: friends } = useFriendsPaginated();
  const { mutate: sendFriendRequest } = useRequestFriend();
  const { mutate: rejectFriendRequest } = useRejectFriendRequest();
  const { mutate: removeFriend } = useRemoveFriend();
  const { mutate: acceptFriendRequest } = useAcceptFriendship();

  console.log('Friends List:', friends);

  return (
    <div className="bg-white mt-8">
      <h3 className="font-bold">Friends List</h3>
      <ul>
        {friends.map((user) => (
          <li key={user._id}>
            <img
              src={user.avatarUrl || '/jiraiya.png'}
              alt={user.name}
              width={30}
              height={30}
              style={{ borderRadius: '50%', marginRight: 10 }}
            />
            <p>
              {user.name} - Status: {user.friendshipStatus}
            </p>

            <div className="flex gap-6">
              {/* <button>Send Message</button> */}
              {user.friendshipStatus === FriendshipStatus.Accepted && (
                <button onClick={() => removeFriend(user._id)}>Unfriend</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FriendsList;
