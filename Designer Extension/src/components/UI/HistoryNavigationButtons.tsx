import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface HistoryNavigationButtonsProps {
  minPath?: string; // Minimum path that prevents going back further
}

export default function HistoryNavigationButtons({ minPath }: HistoryNavigationButtonsProps) {
  const location = useLocation();
  const [navigationStack, setNavigationStack] = useState<number[]>([0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const historyIdx = window.history.state?.idx ?? 0;

    // Update navigation tracking
    setNavigationStack((prev) => {
      const currentPos = prev.indexOf(historyIdx);

      if (currentPos === -1) {
        // New forward navigation - prune any forward history and add new entry
        // If we're in the middle of the stack, this is a branch - remove forward entries
        const prunedStack = currentIndex < prev.length - 1 ? prev.slice(0, currentIndex + 1) : [...prev];
        prunedStack.push(historyIdx);
        setCurrentIndex(prunedStack.length - 1);
        return prunedStack;
      } else {
        // Back/forward navigation - update current index
        setCurrentIndex(currentPos);
        return prev;
      }
    });
  }, [location, currentIndex]);

  const isAtMinPath = minPath ? location.pathname === minPath : false;
  const canGoBack = currentIndex > 0 && !isAtMinPath;
  const canGoForward = currentIndex < navigationStack.length - 1;

  const handleBack = () => {
    // Prevent going back if we're at the minimum path
    if (isAtMinPath) return;

    if (canGoBack) window.history.back();
  };

  const handleForward = () => {
    if (canGoForward) window.history.forward();
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleBack}
        disabled={!canGoBack}
        className={`text-lg ${
          canGoBack ? 'opacity-100 cursor-pointer text-text2 hover:text-white' : 'opacity-30 cursor-not-allowed text-text3'
        }`}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button
        onClick={handleForward}
        disabled={!canGoForward}
        className={`text-lg ${
          canGoForward
            ? 'opacity-100 cursor-pointer text-text2 hover:text-white'
            : 'opacity-30 cursor-not-allowed text-text3'
        }`}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}
