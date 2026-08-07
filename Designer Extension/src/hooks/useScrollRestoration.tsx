import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

interface ScrollPositions {
  [key: string]: number;
}

const scrollPositions: ScrollPositions = {};

export function useScrollRestoration() {
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Restore scroll position when location changes
    const savedPosition = scrollPositions[location.pathname];
    if (savedPosition !== undefined) {
      requestAnimationFrame(() => {
        container.scrollTop = savedPosition;
      });
    } else {
      container.scrollTop = 0;
    }

    // Save scroll position before navigating away
    const handleScroll = () => {
      scrollPositions[location.pathname] = container.scrollTop;
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      scrollPositions[location.pathname] = container.scrollTop;
    };
  }, [location.pathname]);

  return scrollContainerRef;
}
