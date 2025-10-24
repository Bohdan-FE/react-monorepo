import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar/Sidebar';
import { useEffect } from 'react';
import { useStore } from '../../store/store';
import { useUser } from '../../hooks/useUser';

function DashBoardLayout() {
  const connect = useStore((store) => store.connect);
  const disconnect = useStore((store) => store.disconnect);
  const { data: user } = useUser();

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      connect('http://localhost:3000', token);
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
      <main className="w-full border-black bg-[url('/naruto-bg.png')]  bg-center bg-no-repeat flex-1 pl-16">
        <Outlet />
      </main>
    </div>
  );
}

export default DashBoardLayout;
