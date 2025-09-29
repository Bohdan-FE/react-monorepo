import { ReactNode, useEffect, useState } from 'react';

function MouseFollowContainer({ children }: { children: ReactNode }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMove);

    return () => {
      document.removeEventListener('mousemove', handleMove);
    };
  }, []);

  return (
    <div
      className="fixed z-[100] pointer-events-none rounded-full"
      style={{ top: pos.y, left: pos.x, transform: 'translate(-50%, 50%)' }}
    >
      {children}
    </div>
  );
}

export default MouseFollowContainer;
