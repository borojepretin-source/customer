'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  /** Current step (1-based) for the progress indicator. 0 = no indicator shown */
  step?: number;
  /** Total steps for progress indicator */
  totalSteps?: number;
  showHeader?: boolean;
  showFooter?: boolean;
  footerHint?: string;
  headerLeftElement?: React.ReactNode;
}

export default function MainLayout({
  children,
  step = 0,
  totalSteps = 7,
  showHeader = true,
  showFooter = true,
  footerHint,
  headerLeftElement,
}: MainLayoutProps) {
  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col bg-white">

      {/* ── Header ──────────────────────────────────────────────── */}
      {showHeader && <Header step={step} totalSteps={totalSteps} headerLeftElement={headerLeftElement} />}

      {/* ── Main content ────────────────────────────────────────── */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 sm:px-6 py-3">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full min-h-full flex items-center justify-center"
        >
          {children}
        </motion.div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      {showFooter && <Footer hint={footerHint} />}
    </div>
  );
}
