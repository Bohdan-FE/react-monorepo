import { Link, NavLink, useLocation } from 'react-router';
import Profile from '../Profile';
import { useStore } from '../../../store/store';
import AuthModal from '../Modal/AuthModal';
import { NAVIGATION } from './navigation';
import { IoChevronBackCircleOutline } from 'react-icons/io5';
import { useState } from 'react';
import { FiLogIn } from 'react-icons/fi';
import clsx from 'clsx';
import { useUser } from '../../../hooks/useUser';
import { motion } from 'motion/react';

function Sidebar() {
  const openModal = useStore((state) => state.openModal);
  const [isOpened, setIsOpened] = useState(false);
  const { data: user } = useUser();
  const location = useLocation();

  return (
    <motion.aside
      className={clsx(
        'bg-blue-dark fixed top-0 left-0 h-full overflow-hidden  flex flex-col shrink-0  shadow-big z-[10]'
      )}
      animate={{
        width: isOpened ? 232 : 64,
        // borderBottomRightRadius: isOpened ? '0rem' : '50%',
        // borderTopRightRadius: isOpened ? '0rem' : '50%',
        transition: { duration: 0.2, ease: 'easeInOut' },
      }}
      onMouseEnter={() => setIsOpened(true)}
      onMouseLeave={() => setIsOpened(false)}
    >
      <button
        className="absolute top-2 right-2 z-20"
        onClick={() => setIsOpened((prev) => !prev)}
      >
        <IoChevronBackCircleOutline className="w-5 h-5" />
      </button>
      <Profile full={isOpened} />
      <nav className="z-10">
        <ul>
          {NAVIGATION.map((item) => (
            <NavLink to={item.href} key={item.name}>
              <li
                className={clsx(
                  'px-4 py-4  hover:scale-105 grid transition-all   overflow-hidden',
                  {
                    'grid-cols-[minmax(auto,max-content)minmax(auto,1fr)]':
                      isOpened,
                    'grid-cols-[minmax(auto,auto)minmax(0px,0fr)]': !isOpened,
                  },
                  location.pathname === item.href
                    ? 'bg-pink rounded-xl shadow-small scale-105 mx-[0.6rem] text-white'
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
              </li>
            </NavLink>
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
    </motion.aside>
  );
}

export default Sidebar;
