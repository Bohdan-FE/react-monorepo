import { NavLink } from 'react-router';
import { useEffect, useState } from 'react';

function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
    <header
      className={`fixed top-4 left-1/2 translate-x-[-50%] w-full h-16 max-w-7xl rounded-4xl z-5 bg-black/50 backdrop-blur-3xl text-white flex items-center justify-between px-8 inset-shadow-white transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-24'
      }`}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden rounded-4xl">
        <div className="absolute inset-0 w-full h-full header-bg translate-x-[-50%]"></div>
      </div>
      <div className="flex items-center justify-between w-full relative z-1">
        <div>
          <p className="text-2xl font-bold">
            Bohdan{' '}
            <span className="font-GreatVibes text-4xl text-transparent bg-clip-text gradient-main">
              Vivchar
            </span>
          </p>
        </div>

        <nav>
          <ul className="flex gap-8 text-lg">
            <li>
              <NavLink to="/" className="hover:underline">
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/skills" className="hover:underline">
                Skills
              </NavLink>
            </li>
            <li>
              <NavLink to="#projects" className="hover:underline">
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to="#contact" className="hover:underline">
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        <button className="button">Contact Me</button>
      </div>
    </header>
  );
}

export default Header;
