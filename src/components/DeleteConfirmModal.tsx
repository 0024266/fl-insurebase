import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { MortgageRecord } from '../types/mortgage';
import { FloridaZipRecord } from '../types/permits';
import { formatZipCode } from '../utils/permitFormatters';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mortgageRecord?: MortgageRecord | null;
  permitRecord?: FloridaZipRecord | null;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  mortgageRecord,
  permitRecord
}: DeleteConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || (!mortgageRecord && !permitRecord)) return null;

  const isPermit = Boolean(permitRecord);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white border border-[#a8b3c0] rounded-[8px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-[#222]">
        {/* Modal Header Bar with Nested Close Button */}
        <div className="px-4 py-2.5 bg-gradient-to-b from-[#8b1c1c] to-[#6a1212] border-b border-[#4d0c0c] flex items-center justify-between gap-2 text-white select-none shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-[3px] bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-2xs">
              <AlertTriangle className="w-3.5 h-3.5 text-white" />
            </div>
            <h3 id="delete-confirm-title" className="text-sm font-bold text-white tracking-wide truncate">
              {isPermit ? 'Confirm Florida ZIP Deletion' : 'Confirm Account Deletion'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog (Esc)"
            className="qq-modal-close-btn shrink-0 cursor-pointer shadow-md"
            title="Close (Esc)"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        <div className="p-5 space-y-3.5 text-xs">
          <p className="text-[#333] leading-relaxed">
            {isPermit ? (
              <>
                Are you sure you want to permanently delete the permit record for ZIP{' '}
                <strong className="text-[#111]">
                  "{formatZipCode(permitRecord?.zip || '')} - {permitRecord?.City}"
                </strong>?
              </>
            ) : (
              <>
                Are you sure you want to permanently delete the mortgagee record for{' '}
                <strong className="text-[#111]">"{mortgageRecord?.Name}"</strong>?
              </>
            )}
          </p>

          <div className="p-3 bg-neutral-50 border border-[#d8d8d8] rounded-[4px] font-mono text-[11.5px] text-[#444] space-y-0.5">
            {isPermit ? (
              <>
                <p className="font-bold text-[#111]">
                  ZIP {formatZipCode(permitRecord?.zip || '')} — {permitRecord?.City}, FL
                </p>
                <p className="text-[#666]">{permitRecord?.County} COUNTY</p>
                {permitRecord?.Terrain && (
                  <p className="text-[#888]">Wind Exposure: Terrain {permitRecord?.Terrain}</p>
                )}
              </>
            ) : (
              <>
                <p className="font-bold text-[#111]">{mortgageRecord?.Name}</p>
                {mortgageRecord?.Name2 && <p className="text-[#666]">{mortgageRecord?.Name2}</p>}
                {mortgageRecord?.Address && <p className="text-[#888]">{mortgageRecord?.Address}</p>}
              </>
            )}
          </div>

          <div className="pt-3 border-t border-[#e0e0e0] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="qq-btn-secondary py-1.5 px-3.5 text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="bg-gradient-to-b from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:bg-rose-800 border border-rose-900 text-white font-bold py-1.5 px-3.5 text-xs rounded-[3px] shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Record</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
