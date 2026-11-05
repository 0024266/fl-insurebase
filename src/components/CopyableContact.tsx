import React, { useState } from 'react';
import { Phone, Printer, Copy, Check } from 'lucide-react';
import { cleanPhoneUri } from '../utils/formatters';
import { copyToClipboard } from '../utils/clipboard';

interface CopyableContactProps {
  value: string | null | undefined;
  type: 'phone' | 'fax';
  label?: string;
  className?: string;
}

/**
 * Dual-Action Phone & FAX Component
 * Keeps tel: dialing for softphones/mobile while offering a 1-click clipboard copy
 * with a floating 1.5s "Copied to clipboard!" confirmation tooltip.
 */
export function CopyableContact({ value, type, label, className = '' }: CopyableContactProps) {
  const [copied, setCopied] = useState(false);
  const isPhone = type === 'phone';

  if (!value || !value.trim()) {
    return (
      <span className="text-[11.5px] text-[#999999] italic">
        {isPhone ? 'No phone on file' : 'No FAX on file'}
      </span>
    );
  }

  const trimmedValue = value.trim();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const success = await copyToClipboard(trimmedValue);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className={`relative inline-flex items-center gap-1.5 group/contact ${className}`}>
      {/* Primary Interaction: Phone Dial Link or FAX Text */}
      {isPhone ? (
        <a
          href={`tel:${cleanPhoneUri(trimmedValue)}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[#286090] hover:underline font-mono font-semibold text-[12.5px] tracking-tight inline-flex items-center gap-1"
          title={`Click to dial ${trimmedValue} on mobile/VoIP softphone`}
        >
          <Phone className="w-3 h-3 text-[#286090] shrink-0" />
          <span>{trimmedValue}</span>
        </a>
      ) : (
        <span className="text-[#333333] font-mono font-semibold text-[12.5px] tracking-tight inline-flex items-center gap-1">
          <Printer className="w-3 h-3 text-[#666666] shrink-0" />
          <span>{trimmedValue}</span>
        </span>
      )}

      {/* Mini Clipboard Trigger */}
      <button
        type="button"
        onClick={handleCopy}
        className="p-1 rounded text-[#777777] hover:text-[#0066c0] hover:bg-[#eef5fc] transition-colors cursor-pointer shrink-0"
        title={isPhone ? 'Click to copy phone' : 'Click to copy fax'}
        aria-label={isPhone ? 'Click to copy phone' : 'Click to copy fax'}
      >
        {copied ? (
          <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
        ) : (
          <Copy className="w-3 h-3 text-[#666666]" />
        )}
      </button>

      {/* Floating Copy Confirmation Tooltip & Hover Tooltip */}
      {copied ? (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md z-30 whitespace-nowrap animate-in fade-in duration-100 flex items-center gap-1 pointer-events-none">
          <Check className="w-2.5 h-2.5 stroke-[3]" />
          <span>Copied to clipboard!</span>
        </div>
      ) : (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#222222] text-white text-[10px] font-medium px-1.5 py-0.5 rounded shadow-sm z-30 whitespace-nowrap opacity-0 group-hover/contact:opacity-100 transition-opacity pointer-events-none">
          {isPhone ? 'Click to copy phone' : 'Click to copy fax'}
        </div>
      )}
    </div>
  );
}
