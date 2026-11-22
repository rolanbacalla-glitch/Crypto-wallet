import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, X } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { APPLE_REDUCED_CROSSFADE, APPLE_SPRING_SNAPPY } from '../motion/appleMotion';

export function ToastStack() {
  const { toasts, dismissToast } = useWallet();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2.5 w-[calc(100vw-2.5rem)] max-w-sm pointer-events-none"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon =
            toast.tone === 'success'
              ? CheckCircle2
              : toast.tone === 'warning'
                ? AlertTriangle
                : toast.tone === 'danger'
                  ? ShieldAlert
                  : Info;
          const iconColor =
            toast.tone === 'success'
              ? 'text-emerald-400'
              : toast.tone === 'warning'
                ? 'text-amber-400'
                : toast.tone === 'danger'
                  ? 'text-red-400'
                  : 'text-sky-400';

          return (
            <motion.div
              key={toast.id}
              layout
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 18, scale: 0.96 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: 28, scale: 0.96 }
              }
              transition={prefersReducedMotion ? APPLE_REDUCED_CROSSFADE : APPLE_SPRING_SNAPPY}
              style={{ willChange: 'transform, opacity' }}
              className="pointer-events-auto bg-[#161B22] border border-white/[0.12] rounded-xl px-4 py-3 shadow-2xl flex items-start gap-3"
            >
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#F3F5F8]">{toast.title}</p>
                {toast.detail && (
                  <p className="text-xs text-[#9AA4B2] mt-0.5 leading-snug">{toast.detail}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="text-[#6B7686] hover:text-white transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
