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
            'bg-actionPrimaryBackground text-actionPrimaryText hover:text-actionPrimaryTextHover hover:bg-actionPrimaryBackgroundHover':
              color === 'primary',
            'bg-actionSecondaryBackground box-shadow text-actionSecondaryText hover:text-actionSecondaryTextHover hover:bg-actionSecondaryBackgroundHover':
              color === 'secondary',
          },
          {
            'px-2 py-1 text-xs rounded-sm ': size === 'sm',
            'px-3 py-2 text-sm': size === 'md',
          },
          'rounded-sm flex flex-row gap-3 items-center shadow-sm transition',
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
