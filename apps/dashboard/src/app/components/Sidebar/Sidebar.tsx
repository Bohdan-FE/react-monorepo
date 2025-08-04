import { Link } from 'react-router';
import Profile from '../Profile';
import { useStore } from '../../../store/store';
import AuthModal from '../Modal/AuthModal';
import CreateTaskModal from '../Modal/CreateTaskModal';
import { NAVIGATION } from './navigation';
import { IoChevronBackCircleOutline } from 'react-icons/io5';
import { useState } from 'react';
import clsx from 'clsx';

function Sidebar() {
  const openModal = useStore((state) => state.openModal);
  const [isOpened, setIsOpened] = useState(true);

  return (
    <aside
      className={clsx(
        'bg-yellow flex flex-col border-r overflow-hidden relative transition-all duration-300',
        isOpened ? 'w-16' : 'w-xs'
      )}
    >
      <button
        className="absolute top-2 right-2"
        onClick={() => setIsOpened((prev) => !prev)}
      >
        <IoChevronBackCircleOutline className="w-5 h-5" />
      </button>
      <Profile />
      <nav>
        <ul>
          {NAVIGATION.map((item) => (
            <Link to={item.href} key={item.name}>
              <li className="px-4 py-4 hover:bg-orange/40 transition-colors duration-75 flex items-center gap-4">
                <item.IconComponent className="w-4 h-4 shrink-0" />
                <p className="font-bold">{item.name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
      <button onClick={() => openModal(<AuthModal />)}>Login/sign up</button>
      <button onClick={() => openModal(<CreateTaskModal />)}>
        Create task
      </button>
    </aside>
  );
}

export default Sidebar;
