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
  disabledTooltip?: string;
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
  disabledTooltip,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        clsx(
          {
            'bg-action-primary-background text-action-primary-text ': color === 'primary',
            'bg-action-secondary-background box-shadow text-action-secondary-text': color === 'secondary',
          },
          {
            'hover:text-action-primary-text-hover hover:bg-action-primary-background-hover':
              color === 'primary' && !disabled,
            'hover:text-action-secondary-text-hover hover:bg-action-secondary-background-hover':
              color === 'secondary' && !disabled,
          },
          {
            'px-2 h-7 text-sm rounded-xs ': size === 'sm',
            'px-3 h-14 text-base': size === 'md',
            'px-5 h-16 text-lg': size === 'lg',
          },
          { 'h-full text-center': fillHeight },
          { 'w-full text-center': fillWidth },
          'rounded-xs flex flex-row gap-2 items-center shadow-xs transition',
          disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
          className
        )
      )}
      disabled={disabled}
      title={disabled && disabledTooltip ? disabledTooltip : undefined}
      {...props}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </button>
  );
}
