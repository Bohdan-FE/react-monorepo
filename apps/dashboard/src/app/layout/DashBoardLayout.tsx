import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar/Sidebar';

function DashBoardLayout() {
  return (
    <div className=" h-screen flex shadow-lg bg-yellow-light border-4 ">
      <Sidebar />
      <main className="w-full border-black bg-[url('/naruto-bg.png')]  bg-center bg-no-repeat flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default DashBoardLayout;
