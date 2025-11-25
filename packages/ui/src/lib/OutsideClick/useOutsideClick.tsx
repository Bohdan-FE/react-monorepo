import { useEffect, useRef, RefObject } from 'react';

function useOutsideClick<T extends HTMLElement>(
  callback: () => void
): RefObject<T> {
  const ref = useRef<T>(null!);

  useEffect(() => {
    const handleClick = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [callback]);

  return ref;
}

export default useOutsideClick;
