import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children }: { children: ReactNode }) => {
  const elRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    elRef.current = document.createElement('div');
    document.body.appendChild(elRef.current);
    document.body.classList.add('overflow-hidden');
    setMounted(true);

    return () => {
      if (elRef.current && document.body.contains(elRef.current)) {
        document.body.removeChild(elRef.current);
      }
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return mounted && elRef.current
    ? createPortal(<>{children}</>, elRef.current)
    : null;
};

export default Portal;
