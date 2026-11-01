import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router';

interface CardProps {
  size?: 'sm' | 'lg';
  children: React.ReactNode;
  href?: string; // optional Next.js link
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  title?: string;
}

export default function Card({ children, href, onClick, size = 'lg', disabled = false, className, title }: CardProps) {
  const isClickable = Boolean(onClick && !disabled);

  const baseClass = clsx(
    'rounded-md transition-all duration-200 min-w-0 p-4',
    size === 'sm' ? 'py-2' : 'py-5',
    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90',
    isClickable &&
      'hover:scale-[1.02] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    (href || onClick) && 'cursor-pointer',
    'bg-background2',
    className
  );

  // Cards hold block content (headings, icons), which a <button> can't contain, so clickable cards
  // are divs that act as buttons: focusable, and activated with Enter or Space
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  }

  const content = (
    <div
      className={baseClass}
      onClick={isClickable ? onClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-disabled={disabled || undefined}
      title={title}
    >
      {children}
    </div>
  );

  if (href && !disabled) {
    return <Link to={href}>{content}</Link>;
  }

  return content;
}
