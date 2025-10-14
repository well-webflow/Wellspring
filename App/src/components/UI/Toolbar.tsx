import clsx from 'clsx';
import HistoryNavigationButtons from './HistoryNavigationButtons';

interface ToolbarProps {
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

const SHOW_PATH = false;

export function Toolbar({ children, position = 'top' }: ToolbarProps) {
  const cls = clsx(
    'w-full flex items-center justify-between p-2 border-b border-border2 bg-background1 z-10',
    position === 'top' && 'sticky top-0',
    position === 'bottom' && 'mt-auto sticky bottom-0 left-0 right-0'
  );
  return (
    <div className={cls}>
      <div className="flex flex-row gap-2 w-full justify-between">
        <HistoryNavigationButtons minPath="/waterfall" />
        {SHOW_PATH && <div className="text-sm text-text2">{location.pathname}</div>}
        <div className="flex flex-row gap-2 w-full justify-between items-center pl-1">{children}</div>
      </div>
    </div>
  );
}
