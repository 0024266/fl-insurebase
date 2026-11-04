import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalCount?: number;
  children: React.ReactNode;
}

export function QuickViewModal({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  icon,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  currentIndex,
  totalCount,
  children
}: QuickViewModalProps) {
  const { isSpanish } = useLanguage();
  // Listen for Escape key and Left / Right arrow navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input inside modal (e.g. loan number customizer)
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT');

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (!isInput) {
        if ((e.key === 'ArrowLeft' || e.key === 'h' || e.key === 'k') && hasPrev && onPrev) {
          e.preventDefault();
          onPrev();
        } else if ((e.key === 'ArrowRight' || e.key === 'l' || e.key === 'j') && hasNext && onNext) {
          e.preventDefault();
          onNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onPrev, onNext, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative bg-white border border-[#a8b3c0] rounded-[8px] w-full max-w-4xl max-h-[92vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 text-[#222]">
        {/* Modal Header Bar with Glossy Green Gradient and Navigation Controls */}
        <div className="qq-modal-header px-4 py-2.5 text-white flex items-center justify-between gap-3 shadow-xs shrink-0 select-none">
          {/* Left: Icon, Title & Badge */}
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && (
              <div className="w-7 h-7 rounded-[4px] bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-2xs">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] uppercase tracking-wider font-bold text-white/90 font-mono">
                  {isSpanish ? 'Vista Rápida' : 'QuickView Details'}
                </span>
                {badge}
              </div>
              <h2 className="text-[15px] sm:text-[16px] font-bold text-white tracking-tight truncate leading-snug drop-shadow-xs">
                {title}
              </h2>
              {subtitle && (
                <div className="text-[11px] text-white/85 truncate font-medium">
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          {/* Right: Record Navigation Controls (Prev / Next & Counter) + Close Button */}
          <div className="flex items-center gap-2 shrink-0">
            {totalCount !== undefined && currentIndex !== undefined && (
              <div className="hidden sm:inline-flex items-center bg-black/25 text-white/95 text-[11px] font-mono px-2 py-0.5 rounded-[3px] border border-white/20">
                <span>
                  {currentIndex + 1} of {totalCount}
                </span>
              </div>
            )}

            <div className="inline-flex items-center rounded-[3px] border border-white/30 bg-black/20 p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={onPrev}
                disabled={!hasPrev}
                className={`p-1 rounded-[2px] transition-colors cursor-pointer ${
                  hasPrev
                    ? 'text-white hover:bg-white/25 active:bg-white/35'
                    : 'text-white/40 cursor-not-allowed'
                }`}
                title="Previous Record (← key)"
                aria-label="Previous Record"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-3.5 bg-white/25"></div>
              <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                className={`p-1 rounded-[2px] transition-colors cursor-pointer ${
                  hasNext
                    ? 'text-white hover:bg-white/25 active:bg-white/35'
                    : 'text-white/40 cursor-not-allowed'
                }`}
                title="Next Record (→ key)"
                aria-label="Next Record"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Signature Circular Close Button - Fully visible and never clipped */}
            <button
              type="button"
              onClick={onClose}
              className="qq-modal-close-btn shrink-0 cursor-pointer shadow-md ml-1"
              title="Close QuickView (Esc)"
              aria-label="Close QuickView"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-3.5 sm:p-5 bg-[#fbfcfd]">
          {children}
        </div>

        {/* Modal Footer Bar */}
        <div className="px-4 py-2 bg-[#f1f4f8] border-t border-[#d8e0e8] flex items-center justify-between text-[11.5px] text-[#556] shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-[#64748b]">
            <span className="font-mono text-[10.5px] bg-[#e2e8f0] px-1.5 py-0.5 rounded text-[#334155]">
              Esc
            </span>
            <span>Close</span>
            <span className="text-[#cbd5e1]">•</span>
            <span className="font-mono text-[10.5px] bg-[#e2e8f0] px-1.5 py-0.5 rounded text-[#334155]">
              ← / →
            </span>
            <span>Navigate records</span>
          </div>
          <div className="ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="qq-btn-secondary text-[11.5px] py-1 px-4 font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
