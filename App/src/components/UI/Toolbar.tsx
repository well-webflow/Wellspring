import clsx from 'clsx';

interface ToolbarProps {
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

export function Toolbar({ children, position = 'top' }: ToolbarProps) {
  const cls = clsx(
    'w-full flex items-center justify-between p-2 border-b border-border2 bg-background1 z-10',
    position === 'top' && 'sticky top-0',
    position === 'bottom' && 'mt-auto sticky bottom-0 left-0 right-0'
  );
  return <div className={cls}>{children}</div>;
}
