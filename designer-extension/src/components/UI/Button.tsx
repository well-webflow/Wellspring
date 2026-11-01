import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { ButtonHTMLAttributes, useId } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonColor = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconDefinition;
  size?: 'sm' | 'md' | 'lg';
  fillHeight?: boolean;
  fillWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
  color?: ButtonColor;
  /** Label shown on hover and keyboard focus. Also names icon-only buttons for screen readers. */
  tooltip?: string;
  /** Shown instead of tooltip while disabled, to explain why */
  disabledTooltip?: string;
  /** Use 'end' for buttons at the right edge so the label doesn't overflow */
  tooltipAlign?: 'center' | 'end';
}

export default function Button({
  icon,
  size = 'md',
  fillHeight = false,
  fillWidth = false,
  color = 'secondary',
  className,
  children,
  tooltip,
  disabledTooltip,
  tooltipAlign = 'center',
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const descriptionId = useId();
  const tooltipText = disabled && disabledTooltip ? disabledTooltip : tooltip;
  // A natively disabled button gets no hover or focus, so its reason could never be seen. When there's
  // a reason to show, keep the button focusable with aria-disabled and ignore clicks instead.
  const explainDisabled = Boolean(disabled && disabledTooltip);
  const isIconOnly = !children;

  return (
    <>
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
        disabled={disabled && !explainDisabled}
        aria-disabled={explainDisabled || undefined}
        aria-label={isIconOnly ? tooltipText : undefined}
        aria-describedby={!isIconOnly && tooltipText ? descriptionId : undefined}
        data-tooltip={tooltipText}
        data-tooltip-align={tooltipText && tooltipAlign !== 'center' ? tooltipAlign : undefined}
        onClick={explainDisabled ? (e) => e.preventDefault() : onClick}
        {...props}
      >
        {icon && <FontAwesomeIcon icon={icon} />}
        {children}
      </button>
      {/* The CSS label isn't reliably read by screen readers, so describe the button with real text */}
      {!isIconOnly && tooltipText && (
        <span id={descriptionId} hidden>
          {tooltipText}
        </span>
      )}
    </>
  );
}
