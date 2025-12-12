import { Link, NavLink } from 'react-router';
import { useEffect, useState } from 'react';
import { useModal } from '../../context/modal-context';
import ContactModal from '../../components/ContactModal';
import { IoClose, IoMenu } from 'react-icons/io5';
import { AnimatePresence, motion } from 'motion/react';

const navRoutes = [
  { name: 'Home', path: '/' },
  { name: 'Skills', path: '/skills' },
  { name: 'Projects', path: '/projects' },
  { name: 'Contacts', path: '/contacts' },
];

function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { openModal } = useModal();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header
        className={`fixed top-4 left-1/2 translate-x-[-50%] w-[90%]  md:w-full h-12 md:h-16 max-w-7xl rounded-4xl z-15 bg-black/50 backdrop-blur-3xl text-white flex items-center justify-between px-8 inset-shadow-white transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-24'
        }`}
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden rounded-4xl">
          <div className="absolute inset-0 w-full h-full header-bg translate-x-[-50%]"></div>
        </div>

        <div className="flex items-center justify-between w-full relative z-1">
          <div>
            <Link to="/" className="text-xl md:text-2xl font-bold">
              Bohdan{' '}
              <span className="font-GreatVibes text-3xl md:text-4xl text-transparent bg-clip-text gradient-main">
                Vivchar
              </span>
            </Link>
          </div>

          <nav>
            <ul className="md:flex gap-8 text-lg hidden">
              {navRoutes.map((route) => (
                <li key={route.path}>
                  <NavLink
                    to={route.path}
                    className={({ isActive }) =>
                      `relative text-xl tracking-wide after:content-[''] after:absolute after:left-1/2 after:bottom-[-3px] after:translate-x-[-50%] after:w-full after:scale-x-0 after:h-0.5  after:transition-transform after:duration-300 hover:after:scale-x-100  ${
                        isActive
                          ? 'gradient-text after:bg-gradient-main'
                          : 'after:bg-white'
                      }`
                    }
                  >
                    {route.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            className="button md:flex! hidden!"
            onClick={() => openModal(<ContactModal />)}
          >
            Contact Me
          </button>

          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <IoClose className="text-3xl" />
            ) : (
              <IoMenu className="text-3xl" />
            )}
          </button>
        </div>
      </header>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-10 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navRoutes.map((route, index) => (
              <motion.div
                key={route.path}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <NavLink
                  to={route.path}
                  className={({ isActive }) =>
                    `text-2xl font-semibold ${
                      isActive ? 'gradient-text' : 'text-white'
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {route.name}
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
