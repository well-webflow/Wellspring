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
  fillHeight?: boolean;
  fillWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
  color?: ButtonColor;
}

export default function Button({
  text,
  icon,
  size = 'md',
  fillHeight = false,
  fillWidth = false,
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
            'px-2 h-8 text-xs rounded-xs ': size === 'sm',
            'px-3 h-14 text-sm': size === 'md',
            'px-5 h-16 text-lg': size === 'lg',
          },
          { 'h-full text-center': fillHeight },
          { 'w-full text-center': fillWidth },
          'rounded-xs flex flex-row gap-3 items-center shadow-xs transition cursor-pointer',
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
