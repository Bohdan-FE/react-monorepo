import { NavLink, useLocation } from 'react-router';
import Profile from '../Profile';
import { useStore } from '../../../store/store';
import AuthModal from '../Modal/AuthModal';
import { NAVIGATION } from './navigation';
import { useState } from 'react';
import { FiLogIn } from 'react-icons/fi';
import clsx from 'clsx';
import { useUser } from '../../../hooks/useUser';
import { motion } from 'motion/react';
import { useLogout } from '../../../hooks/useLogout';
import { MdLogout } from 'react-icons/md';
import useUnreadMessagesCount from '../../../hooks/useUnreadMessagesCount';

function Sidebar() {
  const openModal = useStore((state) => state.openModal);
  const [isOpened, setIsOpened] = useState(false);
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  const location = useLocation();

  const { data: unreadMessagesCount } = useUnreadMessagesCount();

  return (
    <motion.aside
      className={clsx(
        'bg-blue-dark fixed top-0 left-0 h-full overflow-hidden  flex flex-col shrink-0  shadow-big z-[10]'
      )}
      animate={{
        width: isOpened ? 232 : 64,
        transition: { duration: 0.2, ease: 'easeInOut' },
      }}
      onMouseEnter={() => setIsOpened(true)}
      onMouseLeave={() => setIsOpened(false)}
    >
      <Profile full={isOpened} />
      <nav className="z-10">
        <ul className="flex flex-col gap-3">
          {NAVIGATION.map((item) => (
            <NavLink to={item.href} key={item.name}>
              <li
                className={clsx(
                  'px-4 py-4  hover:scale-105 grid transition-all mx-[0.6rem]  relative',
                  {
                    'grid-cols-[minmax(auto,max-content)minmax(auto,1fr)]':
                      isOpened,
                    'grid-cols-[minmax(auto,auto)minmax(0px,0fr)]': !isOpened,
                  },
                  location.pathname === item.href
                    ? 'bg-pink rounded-xl shadow-small scale-105  text-white'
                    : 'hover:pl-6'
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

                {item.name === 'Chat' && unreadMessagesCount > 0 && (
                  <div
                    className={clsx(
                      'absolute  bg-orange rounded-full flex items-center justify-center shrink-0 aspect-square',
                      {
                        'top-1 right-1 translate-y-[-50%] translate-x-[50%] px-1 text-[0.65rem]':
                          !isOpened,
                        'top-1/2 translate-y-[-50%] right-3 px-2 text-xs':
                          isOpened,
                      }
                    )}
                  >
                    <span className=" font-bold">{unreadMessagesCount}</span>
                  </div>
                )}
              </li>
            </NavLink>
          ))}
          {!user ? (
            <button
              className="w-full mx-[0.6rem]"
              onClick={() => openModal(<AuthModal />)}
            >
              <li
                className={clsx(
                  'px-4 py-4  grid transition-all duration-300 overflow-hidden',
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
          ) : (
            <button className="w-full px-[0.6rem]" onClick={() => logout()}>
              <li
                className={clsx(
                  'px-4 py-4  grid transition-all duration-300 overflow-hidden',
                  {
                    'grid-cols-[minmax(auto,max-content)minmax(auto,1fr)]':
                      isOpened,
                    'grid-cols-[minmax(auto,auto)minmax(0px,0fr)]': !isOpened,
                  }
                )}
              >
                <div>
                  <MdLogout className="w-4 h-4 mx-auto" />
                </div>
                <div className={clsx('flex items-center px-4')}>
                  <p className="font-bold overflow-hidden whitespace-nowrap">
                    Logout
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
    </motion.aside>
  );
}

export default Sidebar;
