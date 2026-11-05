import React, { useState, useEffect } from 'react';
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  Building2,
  FileText,
  Send,
  RotateCcw,
  X
} from 'lucide-react';
import { MortgageRecord } from '../types/mortgage';
import { buildPolicyDocEmail } from '../utils/formatters';
import { copyToClipboard as copyTextToClipboard } from '../utils/clipboard';

interface PolicyEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MortgageRecord | null;
  initialLoanNumber?: string;
  initialBorrowerName?: string;
  initialPolicyNumber?: string;
  initialPropertyAddress?: string;
  onToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export function PolicyEmailModal({
  isOpen,
  onClose,
  record,
  initialLoanNumber = '',
  initialBorrowerName = '',
  initialPolicyNumber = '',
  initialPropertyAddress = '',
  onToast
}: PolicyEmailModalProps) {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [loanNumber, setLoanNumber] = useState('');
  const [insuredName, setInsuredName] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync state when modal opens or record changes
  useEffect(() => {
    if (record && isOpen) {
      setRecipientEmail(record.email?.trim() || '');
      setLoanNumber(initialLoanNumber || '');
      setInsuredName(initialBorrowerName || '');
      setPolicyNumber(initialPolicyNumber || '');
      setPropertyAddress(initialPropertyAddress || '');
      setCopiedKey(null);
    }
  }, [
    record,
    initialLoanNumber,
    initialBorrowerName,
    initialPolicyNumber,
    initialPropertyAddress,
    isOpen
  ]);

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

  const lenderLegalName =
    record.Name?.trim() ||
    (record as unknown as { name?: string }).name?.trim() ||
    '';

  const rawRecordAddress = (record as unknown as { address?: string | { full?: string } }).address;
  const formattedRecordClause = [
    record.Name2?.trim(),
    record.Address?.trim(),
    [record.City?.trim(), record.State?.trim(), record.ZIP?.trim()].filter(Boolean).join(' ')
  ]
    .filter(Boolean)
    .join(', ');

  const mortgageeClauseOnFile =
    typeof rawRecordAddress === 'string' && rawRecordAddress.trim()
      ? rawRecordAddress.trim()
      : rawRecordAddress && typeof rawRecordAddress === 'object' && rawRecordAddress.full
      ? rawRecordAddress.full
      : formattedRecordClause;

  // Generate dynamic, zero-placeholder subject, body, and mailto URL
  const { subject, body, mailtoUrl } = buildPolicyDocEmail(record, {
    recipientEmail,
    loanNumber,
    insuredName,
    policyNumber,
    propertyAddress
  });

  const handleCopy = async (text: string, key: string, label: string) => {
    const success = await copyTextToClipboard(text);
    if (success) {
      setCopiedKey(key);
      onToast('Copied to Clipboard', label, 'success');
      setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 1500);
    } else {
      onToast('Copy Failed', 'Unable to copy to clipboard', 'error');
    }
  };

  const handleClearFields = () => {
    setLoanNumber('');
    setInsuredName('');
    setPolicyNumber('');
    setPropertyAddress('');
    setRecipientEmail(record.email?.trim() || '');
    onToast('Fields Cleared', 'Reset loan, borrower, policy, and property address fields.', 'info');
  };

  const handleSendViaEmailApp = () => {
    onToast(
      'Email Client Opened',
      'Opening your default email app with pre-filled policy documents template',
      'success'
    );
    window.location.href = mailtoUrl;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-email-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative bg-white border border-[#a8b3c0] rounded-[8px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 text-[#222]">
        {/* Modal Header */}
        <div className="qq-modal-header px-4 py-2.5 text-white flex items-center justify-between gap-3 shadow-xs shrink-0 select-none">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-[4px] bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2
                id="policy-email-modal-title"
                className="text-[15px] sm:text-[16px] font-bold text-white tracking-tight truncate leading-snug drop-shadow-xs"
              >
                Send Policy Documents to Mortgagee
              </h2>
              <p className="text-[11px] text-white/90 font-normal truncate">
                Quickly generate pre-formatted escrow billing and policy evidence emails for lender insurance departments.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="qq-modal-close-btn shrink-0 cursor-pointer shadow-md ml-1"
            title="Close (Esc)"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Modal Scrollable Body (max-h-[85vh] overflow-y-auto) */}
        <div className="max-h-[85vh] overflow-y-auto flex-1 p-3.5 sm:p-4 space-y-3 bg-[#fbfcfd]">
          {/* 1. Lender Card (Top) */}
          <div className="bg-white border border-[#d2d9e2] rounded-[4px] p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded bg-[#e8f4fd] border border-[#bde0fe] text-[#004b91] flex items-center justify-center shrink-0 mt-0.5">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[13.5px] font-bold text-[#1f4e79] truncate">
                  {lenderLegalName}
                </h3>
                {mortgageeClauseOnFile && (
                  <p className="text-[11.5px] text-[#555] truncate" title={mortgageeClauseOnFile}>
                    <span className="font-semibold text-[#444]">Mortgagee Mailing Clause:</span>{' '}
                    {mortgageeClauseOnFile}
                  </p>
                )}
              </div>
            </div>

            {record.Online && record.Online.trim() && (
              <div className="shrink-0 flex items-center gap-2">
                <a
                  href={record.Online.startsWith('http') ? record.Online : `https://${record.Online}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="qq-btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 font-semibold"
                  title="Open Mortgagee Document Portal"
                >
                  <ExternalLink className="w-3 h-3 text-[#1f4e79]" />
                  <span>Lender Portal</span>
                </a>
              </div>
            )}
          </div>

          {/* 2. Compact Instructions Alert (Middle - Clean 2-Line Banner) */}
          <div className="bg-[#eef5fc] border border-[#b6d4fe] rounded-[4px] px-3 py-2 text-[11.5px] text-[#1e3a5f] leading-snug shadow-2xs">
            <strong className="font-bold text-[#0f2942]">Lender OCR Notice:</strong> Servicing centers route incoming mail by Loan #. Enter your details below, click{' '}
            <strong className="font-bold text-[#0f2942]">Open in Email App</strong> (or copy), and attach your Dec Page and Invoice PDF.
          </div>

          {/* 3. Streamlined Form Inputs Grid (Bottom) */}
          <div className="bg-white border border-[#d2d9e2] rounded-[4px] p-3 shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]">
              {/* Field 1: Recipient Email Address */}
              <div>
                <label
                  htmlFor="dispatcher-recipient-email"
                  className="block text-[#333] font-bold mb-1 text-[11.5px]"
                >
                  Recipient Email Address
                </label>
                <input
                  id="dispatcher-recipient-email"
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="e.g. mortgagee_docs@servicing.com"
                  className="app-input w-full font-mono text-[12px]"
                />
              </div>

              {/* Field 2: Loan # / Mortgage Account # */}
              <div>
                <label
                  htmlFor="dispatcher-loan-number"
                  className="block text-[#333] font-bold mb-1 text-[11.5px]"
                >
                  Loan # / Mortgage Account #
                </label>
                <input
                  id="dispatcher-loan-number"
                  type="text"
                  value={loanNumber}
                  onChange={(e) => setLoanNumber(e.target.value)}
                  placeholder="e.g. 1092837482"
                  className="app-input w-full font-mono font-semibold text-[12px]"
                />
              </div>

              {/* Field 3: Named Insured / Borrower */}
              <div>
                <label
                  htmlFor="dispatcher-insured-name"
                  className="block text-[#333] font-bold mb-1 text-[11.5px]"
                >
                  Named Insured / Borrower
                </label>
                <input
                  id="dispatcher-insured-name"
                  type="text"
                  value={insuredName}
                  onChange={(e) => setInsuredName(e.target.value)}
                  placeholder="e.g. John & Jane Doe"
                  className="app-input w-full text-[12px]"
                />
              </div>

              {/* Field 4: Policy Number */}
              <div>
                <label
                  htmlFor="dispatcher-policy-number"
                  className="block text-[#333] font-bold mb-1 text-[11.5px]"
                >
                  Policy Number
                </label>
                <input
                  id="dispatcher-policy-number"
                  type="text"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  placeholder="e.g. HO3-993821"
                  className="app-input w-full font-mono text-[12px]"
                />
              </div>

              {/* Field 5: Insured Property Address */}
              <div className="md:col-span-2">
                <label
                  htmlFor="dispatcher-property-address"
                  className="block text-[#333] font-bold mb-1 text-[11.5px]"
                >
                  Insured Property Address
                </label>
                <input
                  id="dispatcher-property-address"
                  type="text"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  placeholder="e.g. 1234 Ocean Dr, Apt 5B, Miami, FL 33139"
                  className="app-input w-full text-[12px]"
                />
              </div>
            </div>
          </div>

          {/* 4. Concise Email Preview Card */}
          <div className="bg-[#fcfcfc] border border-[#cbd5e1] rounded-[4px] overflow-hidden shadow-2xs">
            <div className="px-3 py-1.5 qq-card-header flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#1f4e79]" />
                <span className="text-[11px] font-bold text-[#2d3748] uppercase tracking-wider">
                  Email Preview
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCopy(subject, 'subject', 'Email Subject Line')}
                  className="qq-btn-secondary text-[11px] py-0.5 px-2.5 flex items-center gap-1 cursor-pointer font-semibold"
                  title="Copy subject line"
                >
                  {copiedKey === 'subject' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Subject</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(body, 'body', 'Email Body Text')}
                  className="qq-btn-secondary text-[11px] py-0.5 px-2.5 flex items-center gap-1 cursor-pointer font-semibold"
                  title="Copy email body text"
                >
                  {copiedKey === 'body' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Body</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Subject Header Bar */}
            <div
              className="px-3 py-2 bg-[#f8fafd] border-b border-[#e2e8f0] text-[11.5px] space-y-1 font-sans"
              data-nosnippet="true"
            >
              <div className="flex items-center gap-2">
                <span className="text-[#64748b] font-bold w-14 shrink-0">To:</span>
                <span className="font-mono text-[#0f172a] font-semibold truncate">
                  {recipientEmail.trim() || <span className="text-[#94a3b8] italic">No recipient email set</span>}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#64748b] font-bold w-14 shrink-0">Subject:</span>
                <span className="font-semibold text-[#004b91] break-words select-all leading-snug">
                  {subject}
                </span>
              </div>
            </div>

            {/* Email Body Content */}
            <div className="p-3 bg-white font-mono text-[11.5px] text-[#1e293b] whitespace-pre-wrap leading-relaxed select-all selection:bg-[#cce2ff] max-h-48 overflow-y-auto">
              {body}
            </div>
          </div>
        </div>

        {/* 5. Streamlined Modal Footer */}
        <div className="px-4 py-2.5 bg-[#f1f4f8] border-t border-[#d8e0e8] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={handleClearFields}
            className="qq-btn-secondary text-[11.5px] py-1.5 px-3 flex items-center gap-1.5 font-semibold text-[#555] hover:text-rose-700 cursor-pointer"
            title="Clear all form fields"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Fields</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="qq-btn-secondary text-[11.5px] py-1.5 px-3.5 font-semibold cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleSendViaEmailApp}
              className="qq-btn-green py-1.5 px-4 text-[12px] flex items-center gap-2 font-bold cursor-pointer shadow-xs text-center justify-center"
              title="Open in your default email application"
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
