'use client';

import { motion, MotionProps } from 'framer-motion';
import { ReactNode, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface SecondaryButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const sizeClasses = {
  sm: 'h-10 px-6 text-sm',
  md: 'h-14 px-10 text-base',
  lg: 'h-16 px-12 text-lg',
};

export default function SecondaryButton({
  children,
  size = 'md',
  fullWidth = false,
  className,
  disabled,
  ...props
}: SecondaryButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={clsx(
        'inline-flex items-center justify-center gap-2',
        'font-semibold tracking-wide rounded-xl',
        'text-[#E83E8C] border-2 border-[#E83E8C]',
        'bg-white',
        'hover:bg-[#E83E8C]/10',
        'transition-all duration-200',
        sizeClasses[size],
        fullWidth && 'w-full',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
