import Sidebar from '../components/Sidebar/Sidebar';
import { useEffect } from 'react';
import { useStore } from '../../store/store';
import { useUser } from '../../hooks/useUser';
import { useQueryClient } from '@tanstack/react-query';
import { Outlet, useLocation } from 'react-router';
import NotificationWidget from '../components/NotificationWidget/NotifivationWidget';

function DashBoardLayout() {
  const connect = useStore((store) => store.connect);
  const disconnect = useStore((store) => store.disconnect);
  const { data: user } = useUser();
  const on = useStore((store) => store.on);
  const queryClient = useQueryClient();
  const location = useLocation();
  const selectedUser = useStore((state) => state.selectedUser);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      connect('http://localhost:3000', token);
      on('user_status_change', () => {
        queryClient.invalidateQueries({
          queryKey: ['users'],
        });
      });

      on('privateMessage', () => {
        if (location.pathname !== '/chat' && !selectedUser) {
          console.log('Private message received');
          queryClient.invalidateQueries({ queryKey: ['unreadMessagesCount'] });
        }
      });

      on('friendRequestAccepted', () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      });

      on('friendRequestRejected', () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      });

      on('friendRemoved', () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      });

      on('friendRequestReceived', () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      });
    }

    const handleBeforeUnload = () => {
      disconnect();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      disconnect();
    };
  }, [user]);

  return (
    <div className=" h-screen flex shadow-lg bg-yellow-light border-4 ">
      <Sidebar />
      <main className="w-full border-black bg-[url('/naruto-bg.png')]  bg-center bg-no-repeat flex-1 pl-16 select-none">
        <Outlet />
      </main>
      <NotificationWidget />
    </div>
  );
}

export default DashBoardLayout;
