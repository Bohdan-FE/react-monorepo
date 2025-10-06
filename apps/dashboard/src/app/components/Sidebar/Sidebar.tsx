import { Link } from 'react-router';
import Profile from '../Profile';
import { useStore } from '../../../store/store';
import AuthModal from '../Modal/AuthModal';
import CreateTaskModal from '../Modal/CreateTaskModal';
import { NAVIGATION } from './navigation';
import { IoChevronBackCircleOutline } from 'react-icons/io5';
import { useState } from 'react';
import { FiLogIn } from 'react-icons/fi';
import clsx from 'clsx';
import { useUser } from '../../../hooks/useUser';

function Sidebar() {
  const openModal = useStore((state) => state.openModal);
  const [isOpened, setIsOpened] = useState(true);
  const { data: user } = useUser();

  return (
    <aside
      className={clsx(
        'bg-blue-light  border-r-4 overflow-hidden relative transition-all duration-300 flex flex-col shrink-0 shadow-big'
      )}
    >
      <button
        className="absolute top-2 right-2"
        onClick={() => setIsOpened((prev) => !prev)}
      >
        <IoChevronBackCircleOutline className="w-5 h-5" />
      </button>
      <Profile full={isOpened} />
      <nav>
        <ul>
          {NAVIGATION.map((item) => (
            <Link to={item.href} key={item.name}>
              <li
                className={clsx(
                  'px-4 py-4 hover:bg-orange/40 grid transition-all duration-300 overflow-hidden',
                  {
                    'grid-cols-[minmax(auto,max-content)minmax(auto,1fr)]':
                      isOpened,
                    'grid-cols-[minmax(auto,auto)minmax(0px,0fr)]': !isOpened,
                  }
                )}
              >
                <div>
                  <item.IconComponent className="w-4 h-4 mx-auto" />
                </div>
                <div className={clsx('flex items-center px-4')}>
                  <p className="font-bold overflow-hidden whitespace-nowrap">
                    {item.name}
                  </p>
                </div>
              </li>
            </Link>
          ))}
          {!user && (
            <button className="w-full" onClick={() => openModal(<AuthModal />)}>
              <li
                className={clsx(
                  'px-4 py-4 hover:bg-orange/40 grid transition-all duration-300 overflow-hidden',
                  {
                    'grid-cols-[minmax(auto,max-content)minmax(auto,1fr)]':
                      isOpened,
                    'grid-cols-[minmax(auto,auto)minmax(0px,0fr)]': !isOpened,
                  }
                )}
              >
                <div>
                  <FiLogIn className="w-4 h-4 mx-auto" />
                </div>
                <div className={clsx('flex items-center px-4')}>
                  <p className="font-bold overflow-hidden whitespace-nowrap">
                    Login
                  </p>
                </div>
              </li>
            </button>
          )}
        </ul>
      </nav>
      {/* <button onClick={() => openModal(<AuthModal />)}>Login/sign up</button>
      <button onClick={() => openModal(<CreateTaskModal />)}>
        Create task
      </button> */}
    </aside>
  );
}

export default Sidebar;
