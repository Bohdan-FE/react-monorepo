import { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  loadMore: () => void;
  hasNext: boolean;
}

export function InfiniteScrollContainer({
  loadMore,
  hasNext,
}: InfiniteScrollProps) {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNext) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' } // triggers slightly before reaching bottom
    );

    const el = observerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNext, loadMore]);

  return <div ref={observerRef} />;
}
