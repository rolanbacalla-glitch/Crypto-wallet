import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, X } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export function ToastStack() {
  const { toasts, dismissToast } = useWallet();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2.5 w-[calc(100vw-2.5rem)] max-w-sm pointer-events-none"
    >
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
          <div
            key={toast.id}
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
          </div>
        );
      })}
    </div>
  );
}
