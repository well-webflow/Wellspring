import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router';

interface CardProps {
  children: React.ReactNode;
  href?: string; // optional Next.js link
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Card({ children, href, onClick, disabled = false, className }: CardProps) {
  const baseClass = clsx(
    'rounded-md p-5 transition-opacity duration-200',
    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90',
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
