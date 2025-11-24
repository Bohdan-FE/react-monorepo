import { useNavigate } from 'react-router';
import useUnreadMessagesCount from '../../../hooks/useUnreadMessagesCount';
import useUsersPaginated from '../../../hooks/useUsersPaginated';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';

function NotificationWidget() {
  const { data: users } = useUsersPaginated('request_received', '');
  const { data: unreadCount } = useUnreadMessagesCount();
  const [isOpen, setIsOpen] = useState(true);

  const navigate = useNavigate();

  const navigateToRequests = () => {
    navigate('/chat?filter=request_received');
  };

  const navigateToChat = () => {
    navigate('/chat?filter=all');
  };
  useEffect(() => {
    setIsOpen(true);
  }, [users, unreadCount]);

  if (
    (users.length === 0 && !unreadCount) ||
    !isOpen ||
    localStorage.getItem('showNotifications') === 'false'
  )
    return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: '120%' }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed z-[20] bottom-4 right-4 rounded-2xl overflow-hidden w-84 border shadow-small"
    >
      <div className="bg-orange p-2 relative">
        <p className="text-center text-white">Notifications</p>
        <RxCross2
          className="absolute right-2 top-1/2 translate-y-[-50%] cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
      </div>
      <div className="h-26 bg-white flex flex-col gap-3 p-4">
        {unreadCount ? (
          <div className="flex gap-1 justify-between border-b pb-3 border-black/10">
            <p className="">
              Unread messages:{' '}
              <strong className="text-red">{unreadCount}</strong>
            </p>
            <button
              className="bg-blue text-white rounded-3xl px-2 border border-black text-sm shadow-small active:scale-95 active:shadow-none transition-all"
              onClick={navigateToChat}
            >
              Show
            </button>
          </div>
        ) : null}

        {users.length > 0 ? (
          <div className="flex  gap-1 justify-between">
            <p className="">
              New friends requests:{' '}
              <strong className="text-red">{users.length}</strong>
            </p>
            <button
              className="bg-orange text-white rounded-3xl px-2 border border-black text-sm shadow-small active:scale-95 active:shadow-none transition-all"
              onClick={navigateToRequests}
            >
              Show
            </button>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

export default NotificationWidget;
