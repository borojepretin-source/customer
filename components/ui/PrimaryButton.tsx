'use client';

import { motion, MotionProps } from 'framer-motion';
import { ReactNode, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface PrimaryButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps> {
  children: ReactNode;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const sizeClasses = {
  sm: 'h-10 px-6 text-sm',
  md: 'h-14 px-10 text-base',
  lg: 'h-16 px-12 text-lg',
};

export default function PrimaryButton({
  children,
  loading = false,
  size = 'md',
  fullWidth = false,
  className,
  disabled,
  ...props
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={isDisabled ? {} : { scale: 1.03, y: -1 }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={clsx(
        'relative inline-flex items-center justify-center gap-2',
        'font-bold tracking-widest uppercase rounded-xl',
        'text-white overflow-hidden',
        'shadow-md hover:shadow-lg',
        'transition-all duration-200',
        sizeClasses[size],
        fullWidth && 'w-full',
        isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'cursor-pointer bg-[#E83E8C] hover:bg-[#d6337b]',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {/* Shimmer overlay */}
      {!isDisabled && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />
      )}

      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Memproses...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
