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
}

export default function Card({ children, href, onClick, size = 'lg', disabled = false, className }: CardProps) {
  const baseClass = clsx(
    'rounded-md transition-all duration-200 min-w-0',
    size === 'sm' ? 'p-2' : 'p-5',
    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90',
    onClick && !disabled && 'hover:scale-[1.02] hover:shadow-md',
    (href || onClick) && 'cursor-pointer',
    'bg-background2',
    className
  );

  const content = (
    <div className={baseClass} onClick={disabled ? undefined : onClick} aria-disabled={disabled}>
      {children}
    </div>
  );

  if (href && !disabled) {
    return <Link to={href}>{content}</Link>;
  }

  return content;
}
