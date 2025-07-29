import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonColor = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: IconDefinition;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  color?: ButtonColor;
}

export default function Button({
  text,
  icon,
  size = 'md',
  color = 'secondary',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        clsx(
          {
            'bg-action-primary-background text-action-primary-text hover:text-action-primary-text-hover hover:bg-action-primary-background-hover':
              color === 'primary',
            'bg-action-secondary-background box-shadow text-action-secondary-text hover:text-action-secondary-text-hover hover:bg-action-secondary-background-hover':
              color === 'secondary',
          },
          {
            'px-2 py-1 text-xs rounded-xs ': size === 'sm',
            'px-3 py-2 text-sm': size === 'md',
          },
          'rounded-xs flex flex-row gap-3 items-center shadow-xs transition',
          className
        )
      )}
      {...props}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </button>
  );
}
