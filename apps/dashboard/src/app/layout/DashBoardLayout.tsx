import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar/Sidebar';

function DashBoardLayout() {
  return (
    <div className=" h-screen flex  shadow-lg bg-white border-4 border-black bg-[url('/naruto-bg.png')] bg-center bg-no-repeat">
      <Sidebar />
      <main className="w-full bg-white/70">
        <Outlet />
      </main>
    </div>
  );
}

export default DashBoardLayout;
