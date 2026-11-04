import React from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { ToastMessage } from '../types/mortgage';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const isSuccess = t.type === 'success' || !t.type;
        const isError = t.type === 'error';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto p-3 rounded-[3px] border shadow-lg flex items-start gap-2.5 animate-in slide-in-from-bottom-2 fade-in duration-150 ${
              isSuccess
                ? 'bg-white border-[#549e39] text-[#222]'
                : isError
                ? 'bg-white border-rose-600 text-[#222]'
                : 'bg-white border-[#004b91] text-[#222]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#549e39]" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-600" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-[#004b91]" />}
            </div>

            <div className="flex-1 min-w-0 text-[12px]">
              <p className="font-bold text-[#111]">{t.title}</p>
              {t.description && (
                <p className="text-[11px] text-[#555] mt-0.5 truncate">{t.description}</p>
              )}
            </div>

            <button
              onClick={() => onDismiss(t.id)}
              className="text-[#888] hover:text-[#222] p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
