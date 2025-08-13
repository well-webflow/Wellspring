import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export type InputSize = 'sm' | 'base' | 'lg';

interface BaseFormFieldProps {
  children: React.ReactNode;
  classNames?: string;
  size?: InputSize;
}

const sizeClasses = {
  sm: 'w-[180px]',
  base: 'w-[220px]',
  lg: 'w-[330px]',
};

export function BaseInput({ children, classNames, size = 'base' }: BaseFormFieldProps) {
  const classes = twMerge(
    clsx(
      'h-11 bg-background1 flex border-2 border-border1 rounded-xs focus-within:border-primary p-2 overflow-hidden',
      sizeClasses[size],
      classNames
    )
  );

  return <div className={classes}>{children}</div>;
}
