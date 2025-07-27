import { Link } from 'react-router';
import Profile from './Profile';
import { useStore } from '../../store/store';
import AuthModal from './Modal/AuthModal';
import CreateTaskModal from './Modal/CreateTaskModal';

function Sidebar() {
  const openModal = useStore(state => state.openModal);
  const navigation = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'About',
      href: '/about',
    },
    {
      name: 'Services',
      href: '/services',
    },
    {
      name: 'Contact',
      href: '/contact',
    },
  ];

  return (
    <aside className="w-xs rounded-l-4xl bg-cyan-100 flex flex-col border-r-2 ">
      <Profile />
      <nav>
        <ul>
          {navigation.map(item => (
            <Link to={item.href} key={item.name}>
              <li className="px-8 py-4 hover:bg-cyan-200 transition-colors duration-75">
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
