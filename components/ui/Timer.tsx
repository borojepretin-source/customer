'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface TimerProps {
  /** Total seconds to count down */
  totalSeconds: number;
  /** Called when timer reaches 0 */
  onExpired?: () => void;
  /** If false, shows a large countdown number (e.g. shutter 3-2-1) */
  compact?: boolean;
}

export default function Timer({ totalSeconds, onExpired, compact = true }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (remaining <= 0) {
      onExpired?.();
      return;
    }
    const id = setTimeout(() => setRemaining((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, onExpired]);

  const pct = ((totalSeconds - remaining) / totalSeconds) * 100;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  if (!compact) {
    // Large countdown number for shutter
    return (
      <motion.div
        key={remaining}
        initial={{ scale: 1.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.6, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="text-[120px] font-bold text-white leading-none tracking-tighter select-none"
        style={{ textShadow: '0 0 60px rgba(230,0,122,0.6)' }}
      >
        {remaining}
      </motion.div>
    );
  }

  // Compact session timer with ring
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const isLow = remaining <= 60;

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-12 h-12">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 54 54">
          <circle cx="27" cy="27" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <motion.circle
            cx="27"
            cy="27"
            r={radius}
            fill="none"
            stroke={isLow ? '#ff4444' : '#E6007A'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={clsx(
              'text-[10px] font-bold leading-none tabular-nums',
              isLow ? 'text-red-400' : 'text-white'
            )}
          >
            {mins > 0 ? `${mins}m` : `${secs}s`}
          </span>
        </div>
      </div>

      <span
        className={clsx(
          'text-sm font-bold tabular-nums tracking-widest',
          isLow ? 'text-red-400 animate-pulse' : 'text-white'
        )}
      >
        {timeStr}
      </span>
    </div>
  );
}
