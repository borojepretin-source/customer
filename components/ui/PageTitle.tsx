'use client';

import { motion } from 'framer-motion';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function PageTitle({ title, subtitle, centered = true }: PageTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={centered ? 'text-center' : 'text-left'}
    >
      <h1
        className="font-bold text-black leading-tight tracking-tight"
        style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="mt-2 text-black/60 font-medium leading-relaxed"
          style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1rem)' }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
