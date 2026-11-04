import React, { useState, useEffect } from 'react';
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  Building2,
  FileText,
  Send,
  AlertCircle,
  Sparkles,
  X
} from 'lucide-react';
import { MortgageRecord } from '../types/mortgage';
import { buildPolicyDocEmail, PolicyEmailOptions } from '../utils/formatters';
import { openMailClient } from '../utils/obfuscation';

interface PolicyEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MortgageRecord | null;
  initialLoanNumber?: string;
  initialBorrowerName?: string;
  initialPolicyNumber?: string;
  onToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export function PolicyEmailModal({
  isOpen,
  onClose,
  record,
  initialLoanNumber = '',
  initialBorrowerName = '',
  initialPolicyNumber = '',
  onToast
}: PolicyEmailModalProps) {
  const [toEmail, setToEmail] = useState('');
  const [loanNumber, setLoanNumber] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [carrierName, setCarrierName] = useState('');
  const [includeFooter, setIncludeFooter] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync state when modal opens or record changes
  useEffect(() => {
    if (record) {
      setToEmail(record.email?.trim() || '');
      setLoanNumber(initialLoanNumber || '');
      setBorrowerName(initialBorrowerName || '');
      setPolicyNumber(initialPolicyNumber || '');
      setCarrierName('');
    }
  }, [record, initialLoanNumber, initialBorrowerName, initialPolicyNumber, isOpen]);

  // Handle ESC key to close
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

  if (!isOpen || !record) return null;

  const emailOptions: PolicyEmailOptions = {
    toEmail: toEmail.trim(),
    loanNumber: loanNumber.trim(),
    borrowerName: borrowerName.trim(),
    policyNumber: policyNumber.trim(),
    carrierName: carrierName.trim(),
    includeDetailsFooter: includeFooter
  };

  const { subject, body, mailtoUrl } = buildPolicyDocEmail(record, emailOptions);

  const copyToClipboard = async (text: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      onToast('Copied to Clipboard', label, 'success');
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      onToast('Copy Failed', 'Unable to copy to clipboard', 'error');
    }
  };

  const handleCopyAll = () => {
    const fullText = `To: ${toEmail || 'Not specified'}\nSubject: ${subject}\n\n${body}`;
    copyToClipboard(fullText, 'full_email', 'Full Email Template & Subject');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-email-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative bg-white border border-[#a8b3c0] rounded-[8px] w-full max-w-2xl max-h-[92vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 text-[#222]">
        {/* Modal Header */}
        <div className="qq-modal-header px-4 py-3 text-white flex items-center justify-between gap-3 shadow-xs shrink-0 select-none">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-[4px] bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-white/90 font-mono">
                  Email Dispatcher
                </span>
                <span className="text-[10.5px] bg-white/20 text-white font-semibold px-2 py-0.2 rounded font-sans">
                  Dec Page & Invoice
                </span>
              </div>
              <h2
                id="policy-email-modal-title"
                className="text-[15px] sm:text-[16px] font-bold text-white tracking-tight truncate leading-snug drop-shadow-xs"
              >
                Send Policy Documents to Mortgagee
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="qq-modal-close-btn shrink-0 cursor-pointer shadow-md ml-1"
            title="Close (Esc)"
            aria-label="Close"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-4 bg-[#fbfcfd]">
          {/* Recipient Target Banner */}
          <div className="bg-white border border-[#d2d9e2] rounded-[4px] p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded bg-[#e8f4fd] border border-[#bde0fe] text-[#004b91] flex items-center justify-center shrink-0 mt-0.5">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[13.5px] font-bold text-[#1f4e79] truncate">
                  {record.Name}
                </h3>
                <p className="text-[11.5px] text-[#555] truncate">
                  {record.Address ? `${record.Address}, ${record.City || ''} ${record.State || ''} ${record.ZIP || ''}`.trim() : 'No physical address on file'}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {record.Online && (
                <a
                  href={record.Online.startsWith('http') ? record.Online : `https://${record.Online}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="qq-btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1"
                  title="Open Mortgagee Document Portal"
                >
                  <ExternalLink className="w-3 h-3 text-[#1f4e79]" />
                  <span>Portal</span>
                </a>
              )}
            </div>
          </div>

          {/* Form Fields: Loan # & Policy Details */}
          <div className="bg-white border border-[#d2d9e2] rounded-[4px] p-3.5 shadow-2xs space-y-3">
            <div className="flex items-center gap-1.5 border-b border-[#eee] pb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#1f4e79]" />
              <h4 className="text-[11.5px] font-bold text-[#333] uppercase tracking-wider">
                Loan & Reference Customization
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11.5px]">
              <div>
                <label className="block text-[#444] font-medium mb-1">
                  Recipient Email Address <span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="e.g. mortgagee_docs@servicing.com"
                  className="app-input w-full font-mono text-[12px]"
                />
                {!toEmail.trim() && (
                  <p className="text-[10.5px] text-amber-700 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>No direct email found for this mortgagee. Enter one or copy the template.</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[#444] font-medium mb-1">
                  Loan # / Mortgage Account # <span className="text-[#1f4e79] font-bold">(In Subject & Body)</span>
                </label>
                <input
                  type="text"
                  value={loanNumber}
                  onChange={(e) => setLoanNumber(e.target.value)}
                  placeholder="e.g. 1092837482"
                  className="app-input w-full font-semibold"
                />
              </div>

              <div>
                <label className="block text-[#444] font-medium mb-1">
                  Named Insured / Policyholder
                </label>
                <input
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="e.g. John & Jane Doe"
                  className="app-input w-full"
                />
              </div>

              <div>
                <label className="block text-[#444] font-medium mb-1">
                  Policy Number
                </label>
                <input
                  type="text"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  placeholder="e.g. HO3-993821"
                  className="app-input w-full"
                />
              </div>
            </div>

            {/* Include Footer Option */}
            <div className="pt-1 flex items-center gap-2">
              <label className="inline-flex items-center gap-2 text-[11.5px] text-[#444] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeFooter}
                  onChange={(e) => setIncludeFooter(e.target.checked)}
                  className="rounded border-[#aaa] text-[#1f4e79] focus:ring-[#1f4e79]"
                />
                <span>Include policy reference summary block in email footer</span>
              </label>
            </div>
          </div>

          {/* Real-time Email Preview Card */}
          <div className="bg-[#fcfcfc] border border-[#cbd5e1] rounded-[4px] overflow-hidden shadow-2xs">
            <div className="px-3.5 py-2 qq-card-header flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#1f4e79]" />
                <span className="text-[11.5px] font-bold text-[#2d3748] uppercase tracking-wider">
                  Email Message Preview
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => copyToClipboard(subject, 'subject', 'Email Subject Line')}
                  className="qq-btn-secondary text-[11px] py-0.5 px-2 flex items-center gap-1 cursor-pointer"
                  title="Copy subject line"
                >
                  {copiedKey === 'subject' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Subject</span>
                </button>

                <button
                  type="button"
                  onClick={() => copyToClipboard(body, 'body', 'Email Body Text')}
                  className="qq-btn-secondary text-[11px] py-0.5 px-2 flex items-center gap-1 cursor-pointer"
                  title="Copy body text"
                >
                  {copiedKey === 'body' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Body</span>
                </button>
              </div>
            </div>

            {/* Email Header Info */}
            <div className="p-3 bg-[#f8fafd] border-b border-[#e2e8f0] text-[12px] space-y-1.5 font-sans" data-nosnippet="true">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-[#64748b] font-medium w-16 shrink-0">To:</span>
                <span className="font-mono text-[#0f172a] font-semibold">
                  {toEmail ? toEmail : <span className="text-[#94a3b8] italic">No recipient email set</span>}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                <span className="text-[#64748b] font-medium w-16 shrink-0 pt-0.5">Subject:</span>
                <span className="font-semibold text-[#004b91] break-all select-all">
                  {subject}
                </span>
              </div>
            </div>

            {/* Email Body Content */}
            <div className="p-3.5 bg-white font-sans text-[12.5px] text-[#1e293b] whitespace-pre-wrap leading-relaxed select-all selection:bg-[#cce2ff] max-h-56 overflow-y-auto">
              {body}
            </div>

            <div className="px-3 py-1.5 bg-[#f1f5f9] border-t border-[#e2e8f0] text-[11px] text-[#64748b] flex items-center gap-1.5">
              <span className="font-semibold text-[#475569]">Workflow Note:</span>
              <span>Remember to attach your declaration page PDF and invoice in your email client after opening.</span>
            </div>
          </div>
        </div>

        {/* Modal Footer with Primary Mailto Action and Copy Actions */}
        <div className="px-4 py-3 bg-[#f1f4f8] border-t border-[#d8e0e8] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyAll}
              className="qq-btn-secondary text-[11.5px] py-1.5 px-3 flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              {copiedKey === 'full_email' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Full Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#555]" />
                  <span>Copy Full Template</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="qq-btn-secondary text-[11.5px] py-1.5 px-3.5 font-semibold cursor-pointer"
            >
              Cancel
            </button>

            {/* Primary Action: Mail Client Launcher Button */}
            <button
              type="button"
              onClick={() => {
                onToast('Email Client Opened', 'Opening your default mail app with pre-filled policy docs template', 'success');
                openMailClient(toEmail || '', subject, body);
              }}
              className="qq-btn-green py-1.5 px-4 text-[12px] flex items-center gap-2 font-bold cursor-pointer shadow-sm text-center justify-center"
              title="Open default email application"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send via your email app</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
