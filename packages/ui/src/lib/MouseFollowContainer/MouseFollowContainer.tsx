import { ReactNode, useEffect, useState } from 'react';

export function MouseFollowContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMove);

    return () => {
      document.removeEventListener('mousemove', handleMove);
    };
  }, []);
  if (!pos) return null;
  return (
    <div
      className={`fixed z-[999] pointer-events-none rounded-full ${className}`}
      style={{ top: pos.y, left: pos.x }}
    >
      {children}
    </div>
  );
}
