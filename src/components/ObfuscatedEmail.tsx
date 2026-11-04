import React, { useState } from 'react';
import { Mail, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { splitEmail, openMailClient } from '../utils/obfuscation';

interface ObfuscatedEmailProps {
  email: string;
  className?: string;
  showIcon?: boolean;
  allowCopy?: boolean;
  clickable?: boolean;
  subject?: string;
  body?: string;
  visualMask?: string; // Optional custom visual label to completely mask the real email visually
  onToast?: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

/**
 * ObfuscatedEmail Component
 * 
 * Prevents automated email harvesters & SEO scrapers from harvesting email addresses:
 * 1. Uses `data-nosnippet="true"` attribute to instruct search engine crawlers not to index or snippet the text.
 * 2. Splits username and domain across discrete DOM span elements with honeypot decoy anti-bot tags.
 * 3. Handles mailto dispatches via dynamic user-triggered events rather than static crawler-visible `href="mailto:"` attributes.
 * 4. Supports complete visual masking (e.g. "Directory Administrator") when requested.
 */
export function ObfuscatedEmail({
  email,
  className = '',
  showIcon = false,
  allowCopy = false,
  clickable = true,
  subject,
  body,
  visualMask,
  onToast
}: ObfuscatedEmailProps) {
  const [copied, setCopied] = useState(false);

  if (!email || !email.trim()) {
    return <span className="text-[#999]">—</span>;
  }

  const cleanEmail = email.trim();
  const { user, domain } = splitEmail(cleanEmail);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!clickable) return;

    if (onToast) {
      onToast(
        'Email Client Opened',
        visualMask ? 'Opening mail application to message Administrator' : `Opening mail application for ${cleanEmail}`,
        'info'
      );
    }
    openMailClient(cleanEmail, subject, body);
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(cleanEmail);
      setCopied(true);
      if (onToast) {
        onToast('Copied to Clipboard', visualMask ? 'Admin Contact Info' : cleanEmail, 'success');
      }
      setTimeout(() => setCopied(false), 2000);
    } catch {
      if (onToast) {
        onToast('Copy Failed', 'Unable to copy email address', 'error');
      }
    }
  };

  // If a visual mask is requested, display the clean label without exposing the raw email string
  if (visualMask) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        {showIcon && <Mail className="w-3.5 h-3.5 text-[#1f4e79] shrink-0" />}
        {clickable ? (
          <button
            type="button"
            onClick={handleClick}
            className="text-[#1f4e79] hover:underline font-semibold text-left inline-flex items-center gap-1 cursor-pointer focus:outline-none"
            title="Click to open your default mail application"
          >
            <span>{visualMask}</span>
            <ExternalLink className="w-3 h-3 opacity-75" />
          </button>
        ) : (
          <span className="font-semibold text-[#1f4e79]">{visualMask}</span>
        )}
        <span
          className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded font-sans"
          title="Direct verified contact channel (protected from bots and web scrapers)"
        >
          <ShieldCheck className="w-2.5 h-2.5" />
          <span>Protected</span>
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`} data-nosnippet="true">
      {showIcon && <Mail className="w-3.5 h-3.5 text-[#1f4e79] shrink-0" />}

      {clickable ? (
        <button
          type="button"
          onClick={handleClick}
          className="text-[#1f4e79] hover:underline font-medium text-left truncate cursor-pointer font-mono text-[12px] focus:outline-none"
          title="Send email via your mail client (Protected from web scrapers)"
        >
          {/* DOM anti-scraper split tags */}
          <span>{user}</span>
          <span className="hidden select-none" aria-hidden="true">
            _no_harvest_
          </span>
          <span>&#64;</span>
          <span>{domain}</span>
        </button>
      ) : (
        <span className="font-mono text-[12px] text-[#333] select-all">
          <span>{user}</span>
          <span className="hidden select-none" aria-hidden="true">
            _no_harvest_
          </span>
          <span>&#64;</span>
          <span>{domain}</span>
        </span>
      )}

      {allowCopy && (
        <button
          type="button"
          onClick={handleCopy}
          className="p-1 text-[#666] hover:text-[#1f4e79] rounded transition-colors cursor-pointer"
          title="Copy email address"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
        </button>
      )}
    </span>
  );
}
