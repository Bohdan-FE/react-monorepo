import UserList from '../components/UserList';
import FriendsList from '../components/FriendsList';
import { useStore } from '../../store/store';

import { useUser } from '../../hooks/useUser';
import ChatBox from '../components/ChatBox/ChatBox';

const Chat = () => {
  const { data: me } = useUser();
  const target = useStore((store) => store.selectedUser);

  return (
    <div className="flex justify-between gap-8">
      {me && target && <ChatBox me={me} target={target} />}

      <UserList />
      <FriendsList />
    </div>
  );
};

export default Chat;
