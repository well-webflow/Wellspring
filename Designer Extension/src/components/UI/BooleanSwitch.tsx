import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface BooleanSwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  classNames?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BooleanSwitch({ classNames, checked = false, onChange, ...props }: BooleanSwitchProps) {
  return (
    <label className={twMerge('relative cursor-pointer inline-block', classNames)}>
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} {...props} />
      <div
        className={twMerge(
          clsx(
            'w-11 h-6 rounded-full transition-colors',
            'peer-checked:bg-action-primary-background bg-border1',
            'peer-focus:ring-2 peer-focus:ring-primary/50'
          )
        )}
      ></div>
      <div
        className={twMerge(
          clsx('absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform', 'peer-checked:translate-x-5')
        )}
      ></div>
    </label>
  );
}
