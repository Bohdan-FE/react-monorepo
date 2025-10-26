import React, { useRef, useEffect } from 'react';

interface InfinityScrollContainerProps {
  loadMore: () => void;
  hasMore: boolean;
  children: React.ReactNode;
  threshold?: number; // px before reaching the end
}

export const InfinityScrollContainer: React.FC<
  InfinityScrollContainerProps
> = ({ loadMore, hasMore, children, threshold = 200 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore) return;

    const container = containerRef.current;
    const sentinel = sentinelRef.current;
    if (!container || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        root: container,
        rootMargin: `0px 0px ${threshold}px 0px`,
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    // ✅ Handle the case when the sentinel is visible immediately
    if (
      container.scrollHeight <= container.clientHeight ||
      sentinel.getBoundingClientRect().top <= container.clientHeight
    ) {
      loadMore();
    }

    return () => observer.disconnect();
  }, [hasMore, loadMore, threshold]);

  return (
    <div
      ref={containerRef}
      className="infinite-scroll-container pr-4"
      style={{ overflowY: 'auto', height: '100%' }}
    >
      {children}
      {/* Sentinel div at the end of the list */}
      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
};
