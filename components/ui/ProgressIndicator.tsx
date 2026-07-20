'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ProgressIndicatorProps {
  currentStep: number;   // 1-based
  totalSteps: number;
  labels?: string[];
}

export default function ProgressIndicator({ currentStep, totalSteps, labels }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={stepNum} className="flex items-center gap-1.5">
            <div className="flex flex-col items-center gap-0.5">
              {/* Step circle */}
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.15 : 1,
                  background: isActive
                    ? 'linear-gradient(135deg, #E83E8C, #d6337b)'
                    : isDone
                    ? '#E83E8C'
                    : '#f3f4f6', // gray-100
                  borderColor: isActive || isDone ? '#E83E8C' : '#e5e7eb', // gray-200
                }}
                transition={{ duration: 0.25 }}
                className={clsx(
                  'w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300'
                )}
              >
                {isDone ? (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span
                    className={clsx(
                      'text-[9px] font-bold leading-none',
                      isActive ? 'text-white' : 'text-black/40'
                    )}
                  >
                    {stepNum}
                  </span>
                )}
              </motion.div>

              {/* Label */}
              {labels?.[i] && (
                <span
                  className={clsx(
                    'text-[8px] font-semibold tracking-wide leading-none transition-colors duration-200',
                    isActive ? 'text-black' : isDone ? 'text-black/60' : 'text-black/30'
                  )}
                >
                  {labels[i]}
                </span>
              )}
            </div>

            {/* Connector line */}
            {stepNum < totalSteps && (
              <motion.div
                initial={false}
                animate={{ background: isDone ? '#E83E8C' : '#e5e7eb' }}
                transition={{ duration: 0.3 }}
                className="w-6 h-px mb-3"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
