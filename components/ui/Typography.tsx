'use client';

import { ReactNode, ElementType } from 'react';
import clsx from 'clsx';

type TypographyVariant = 'display' | 'title' | 'body' | 'caption' | 'label';

type TypographyElement = 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'strong';

interface TypographyProps {
  children: ReactNode;
  variant?: TypographyVariant;
  as?: TypographyElement;
  className?: string;
  centered?: boolean;
}

const variantClasses: Record<TypographyVariant, string> = {
  display: 'text-4xl md:text-5xl font-extrabold tracking-tight',
  title: 'text-2xl md:text-3xl font-bold tracking-tight',
  body: 'text-base md:text-lg font-medium tracking-normal',
  caption: 'text-xs md:text-sm font-medium uppercase tracking-[0.24em]',
  label: 'text-sm md:text-base font-semibold tracking-wide',
};

const elementMap: Record<TypographyElement, TypographyElement> = {
  p: 'p',
  span: 'span',
  div: 'div',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  strong: 'strong',
};

export default function Typography({
  children,
  variant = 'body',
  as = 'p',
  className,
  centered = false,
}: TypographyProps) {
  const Tag = elementMap[as] as ElementType;

  return (
    <Tag
      className={clsx(
        variantClasses[variant],
        centered ? 'text-center' : 'text-left',
        'text-black/80',
        className
      )}
    >
      {children}
    </Tag>
  );
}
