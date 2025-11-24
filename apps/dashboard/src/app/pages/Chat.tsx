import ChatBox from '../components/ChatBox/ChatBox';
import UserFilter from '../components/UserFilter/UserFilter';

const Chat = () => {
  return (
    <div className="flex justify-between h-full p-4 gap-4">
      <ChatBox />

      <UserFilter />
    </div>
  );
};

export default Chat;
