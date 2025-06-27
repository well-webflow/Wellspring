import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface HorizontalRuleProps {
  className?: string;
}

export default function HorizontalRule({ className }: HorizontalRuleProps) {
  const wrapperClass = twMerge(clsx('w-full my-3', className));

  return (
    <div className={wrapperClass}>
      <hr className="h-[1px] w-full bg-border1 opacity-25" />
    </div>
  );
}
