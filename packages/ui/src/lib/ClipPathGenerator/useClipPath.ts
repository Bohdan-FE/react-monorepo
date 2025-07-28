import { useEffect, useRef } from 'react';
import { ClipPathParams, getClipPath } from './generateClipPathString';

function useClipPath(clipPathParams: ClipPathParams) {
  const ref = useRef<HTMLDivElement | null>(null);
  const observer = useRef<ResizeObserver | null>(null);

  const setClipPath = () => {
    if (!ref.current) return;
    const card = ref.current;
    const clipPath = getClipPath({
      ...clipPathParams,
      width: card.offsetWidth,
      height: card.offsetHeight,
    });
    card.style.visibility = 'visible';
    card.style.clipPath = clipPath;
    card.style.transition = 'all 0.3s ease';
  };

  useEffect(() => {
    const card = ref.current;
    if (!card) return;

    card.style.visibility = 'hidden';

    // Create ResizeObserver instance
    observer.current = new ResizeObserver(() => {
      setClipPath();
    });

    // Observe the card element
    observer.current.observe(card);

    // Initial call after delay
    return () => {
      observer.current?.disconnect();
    };
  }, [clipPathParams]);

  return ref;
}

export default useClipPath;
