import { useStore } from '../../store/store';

import { useUser } from '../../hooks/useUser';
import ChatBox from '../components/ChatBox/ChatBox';
import UserFilter from '../components/UserFilter/UserFilter';

const Chat = () => {
  const { data: me } = useUser();
  const target = useStore((store) => store.selectedUser);

  return (
    <div className="flex justify-between h-full">
      {me && <ChatBox me={me} target={target} />}

      <UserFilter />
    </div>
  );
};

export default Chat;
