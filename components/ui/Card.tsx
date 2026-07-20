'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  borderless?: boolean;
  as?: 'div' | 'section' | 'article';
}

export default function Card({
  children,
  className,
  borderless = false,
  as: Component = 'div',
}: CardProps) {
  return (
    <Component
      className={clsx(
        'rounded-3xl bg-white shadow-lg',
        !borderless && 'border border-gray-200',
        className
      )}
    >
      {children}
    </Component>
  );
}
