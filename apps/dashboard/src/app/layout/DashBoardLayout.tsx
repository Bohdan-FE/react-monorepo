import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar';

function DashBoardLayout() {
  return (
    <div className="p-8 h-dvh bg-emerald-100 ">
      <div className="flex rounded-4xl shadow-lg bg-white h-full border-4 border-black">
        <Sidebar />
        <main className="w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashBoardLayout;
