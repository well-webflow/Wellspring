import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import React from 'react';

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: React.ReactNode;
}

interface ParagraphProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export function Heading({ level, children, className }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const defaultClassName = twMerge(
    clsx(
      {
        'font-brand text-4xl': level === 1,
        'font-brand text-2xl': level === 2,
        'font-brand text-xl': level === 3,
        'font-bold text-lg': level === 4,
        'text-sm': level === 5,
        'text-xs': level === 6,
      },
      className
    )
  );
  return <Tag className={defaultClassName}>{children}</Tag>;
}

export function Paragraph({ size = 'md', children, className }: ParagraphProps) {
  const cls = twMerge(
    clsx(
      {
        'text-sm': size === 'sm',
        'text-base': size === 'md',
        'text-lg': size === 'lg',
      },
      'mb-3',
      className
    )
  );
  return <p className={cls}>{children}</p>;
}

export function Caption({ children, className }: ParagraphProps) {
  const cls = twMerge(clsx('text-sm mb-3 text-text2', className));
  return <p className={cls}>{children}</p>;
}
