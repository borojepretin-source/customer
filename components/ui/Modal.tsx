'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  /** Hide the backdrop close trigger */
  persistent?: boolean;
}

export default function Modal({ open, onClose, title, children, persistent = false }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(6px)' }}
            onClick={persistent ? undefined : onClose}
          />

          {/* Panel */}
          <motion.div
            key="modal-panel"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-lg rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-white"
            >
              {/* Header */}
              {(title || onClose) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  {title && (
                    <h2 className="text-base font-bold text-black tracking-wide">{title}</h2>
                  )}
                  {onClose && !persistent && (
                    <button
                      onClick={onClose}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-black/40 hover:text-black hover:bg-gray-100 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="px-6 py-5">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
