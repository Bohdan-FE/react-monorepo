// hooks/ui/useScrollRestoration.ts
'use client';

import { useEffect } from 'react';

import { usePathname, useRouter } from 'next/navigation';

// hooks/ui/useScrollRestoration.ts

export function useScrollRestoration() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let shouldRestoreScroll = false;

    const saveScrollPos = (path: string) => {
      sessionStorage.setItem(
        `scroll-pos:${path}`,
        JSON.stringify({ x: window.scrollX, y: window.scrollY }),
      );
    };

    const restoreScrollPos = (path: string) => {
      const pos = sessionStorage.getItem(`scroll-pos:${path}`);
      if (pos) {
        const { x, y } = JSON.parse(pos);
        window.scrollTo(x, y);
      }
    };

    const onBeforeUnload = () => saveScrollPos(pathname);
    const onPopState = () => {
      shouldRestoreScroll = true;
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('popstate', onPopState);

    // Detect path change
    let prevPathname = pathname;
    const interval = setInterval(() => {
      if (prevPathname !== pathname) {
        if (shouldRestoreScroll) {
          restoreScrollPos(pathname);
          shouldRestoreScroll = false;
        }
        prevPathname = pathname;
      }
    }, 100);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('popstate', onPopState);
    };
  }, [pathname]);
}
