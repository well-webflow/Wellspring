import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import Button from './Button';
import { SettingSize } from '../../apps/waterfall/components/Setting';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: SettingSize;
  classNames?: string;
  submit?: () => void;
}

export function Input({ submit, inputSize = 'base', classNames, ...props }: InputProps) {
  const sizeClasses = {
    base: 'w-[220px]',
    lg: 'w-[330px]',
    full: 'flex-1',
  };

  const classes = twMerge(
    clsx(
      'h-11 bg-background1 flex shrink-0 border-2 border-border1 rounded-xs focus-within:border-primary p-2 overflow-hidden',
      sizeClasses[inputSize],
      classNames
    )
  );

  return (
    <div className={classes}>
      <input {...props} className="text-action-primary-text w-full h-full outline-none" />
      {submit && (
        <Button size="sm" fillHeight onClick={submit}>
          Submit
        </Button>
      )}
    </div>
  );
}
