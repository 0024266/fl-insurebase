import React, { useState, useEffect } from 'react';
import {
  Mail,
  Copy,
  Check,
  Send,
  ExternalLink,
  MessageSquarePlus,
  Sparkles,
  Info,
  X,
  ShieldCheck
} from 'lucide-react';
import { getAdminEmail, openMailClient } from '../utils/obfuscation';

export type SubmissionType =
  | 'correct_mortgage'
  | 'new_mortgage'
  | 'correct_permit'
  | 'new_permit'
  | 'general_feedback';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetEmail?: string;
  initialType?: SubmissionType;
  initialEntityName?: string;
  initialDetails?: string;
  onToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export function FeedbackModal({
  isOpen,
  onClose,
  targetEmail,
  initialType = 'correct_mortgage',
  initialEntityName = '',
  initialDetails = '',
  onToast
}: FeedbackModalProps) {
  const [submissionType, setSubmissionType] = useState<SubmissionType>(initialType);
  const [entityName, setEntityName] = useState(initialEntityName);
  const [fieldsToUpdate, setFieldsToUpdate] = useState<string>('All relevant details');
  const [newInformation, setNewInformation] = useState(initialDetails);
  const [sourceReference, setSourceReference] = useState('');
  const [submitterInfo, setSubmitterInfo] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const destinationEmail = targetEmail || getAdminEmail();

  // Sync initial props when opened
  useEffect(() => {
    if (isOpen) {
      setSubmissionType(initialType);
      setEntityName(initialEntityName);
      setNewInformation(initialDetails);
      setSourceReference('');
      setSubmitterInfo('');
      setCopiedKey(null);
    }
  }, [isOpen, initialType, initialEntityName, initialDetails]);

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

  if (!isOpen) return null;

  // Type labels
  const typeLabels: Record<SubmissionType, { label: string; badge: string; prefix: string }> = {
    correct_mortgage: {
      label: 'Correct / Update Existing Mortgagee or Loss Payee',
      badge: 'Mortgagee Correction',
      prefix: '[Mortgagee Update]'
    },
    new_mortgage: {
      label: 'Add New Mortgagee / Loss Payee Record',
      badge: 'New Mortgagee Addition',
      prefix: '[New Mortgagee]'
    },
    correct_permit: {
      label: 'Correct Florida Property / Permit Jurisdiction Info',
      badge: 'Jurisdiction Correction',
      prefix: '[Permit Correction]'
    },
    new_permit: {
      label: 'Add New Florida Jurisdiction / Permit Portal',
      badge: 'New Jurisdiction Addition',
      prefix: '[New Jurisdiction]'
    },
    general_feedback: {
      label: 'General Directory Suggestion or Feedback',
      badge: 'Directory Feedback',
      prefix: '[Directory Feedback]'
    }
  };

  const currentTypeConfig = typeLabels[submissionType];

  // Build Subject line
  const subjectEntity = entityName.trim() || 'General Submission';
  const subject = `${currentTypeConfig.prefix} ${subjectEntity} - Update Submission`;

  // Build Body text (Email address is visually hidden and protected)
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const bodyLines: string[] = [
    'Attn: Directory Administrator',
    '',
    `SUBMISSION TYPE: ${currentTypeConfig.label}`,
    `TARGET ENTITY / JURISDICTION / ZIP: ${entityName.trim() || 'Not specified'}`,
    `FIELD(S) TO UPDATE / ADD: ${fieldsToUpdate.trim() || 'General details'}`,
    '',
    '--------------------------------------------------',
    'NEW / CORRECTED INFORMATION:',
    '--------------------------------------------------',
    newInformation.trim() || '(Please review the requested changes/data provided below)',
    '',
    '--------------------------------------------------',
    'SUPPORTING DETAILS & SOURCE REFERENCE:',
    '--------------------------------------------------',
    sourceReference.trim() || 'Direct agent/user verification',
    '',
    '--------------------------------------------------',
    'SUBMITTER INFORMATION:',
    '--------------------------------------------------',
    submitterInfo.trim() || 'Agency Team Member (submitted via Agency Directory Web Portal)',
    `Submitted at: ${timestamp}`
  ];

  const body = bodyLines.join('\n');

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

  const handleCopyFullEmail = () => {
    const fullText = `To: Directory Administrator\nSubject: ${subject}\n\n${body}`;
    copyToClipboard(fullText, 'full_email', 'Complete Email Template & Subject');
  };

  const handleEmailUpdate = () => {
    const customSubject = `[FL InsureBase] Data Correction - ${entityName.trim() || 'General'}`;
    onToast(
      'Email Client Opened',
      'Opening default email app with pre-filled update template for FL InsureBase',
      'success'
    );
    openMailClient(destinationEmail, customSubject, body);
  };

  const handleSubmitOnGithub = () => {
    const issueTitle = `[FL InsureBase] Data Correction - ${entityName.trim() || 'General'}`;
    const githubUrl = `https://github.com/0024266/fl-insurebase/issues/new?title=${encodeURIComponent(
      issueTitle
    )}&body=${encodeURIComponent(body)}`;
    window.open(githubUrl, '_blank', 'noopener,noreferrer');
    onToast(
      'GitHub Issue Opened',
      'Opening pre-filled GitHub Issue on 0024266/fl-insurebase repository',
      'info'
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
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
              <MessageSquarePlus className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-white/90 font-mono">
                  FL InsureBase Crowdsourcing
                </span>
                <span className="text-[10.5px] bg-white/20 text-white font-semibold px-2 py-0.2 rounded font-sans inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  <span>Direct Peer Submissions</span>
                </span>
              </div>
              <h2
                id="feedback-modal-title"
                className="text-[15px] sm:text-[16px] font-bold text-white tracking-tight truncate leading-snug drop-shadow-xs"
              >
                Add or Correct Information
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

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-4 bg-[#fbfcfd]">
          {/* Quick Notice Banner */}
          <div className="bg-[#f0f7ff] border border-[#b8daff] rounded-[4px] p-3 text-[12px] text-[#004b91] flex items-start gap-2.5 shadow-2xs">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#004b91]" />
            <div className="space-y-0.5">
              <div className="font-bold text-[#003870]">
                Florida Agent Crowdsourcing & Direct Peer Submissions
              </div>
              <p className="text-[#334e68] text-[11.5px] leading-relaxed">
                Submit mortgagee clause updates, property appraiser corrections, or carrier portal rules via <strong className="text-[#003870] font-bold">Direct Email Update</strong> or an <strong className="text-[#003870] font-bold">Open GitHub Issue</strong>.
              </p>
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="bg-white border border-[#d2d9e2] rounded-[4px] p-3.5 shadow-2xs space-y-3">
            <div className="flex items-center gap-1.5 border-b border-[#eee] pb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#1f4e79]" />
              <h3 className="text-[11.5px] font-bold text-[#333] uppercase tracking-wider">
                Submission Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11.5px]">
              {/* Submission Type */}
              <div className="sm:col-span-2">
                <label className="block text-[#444] font-medium mb-1">
                  What would you like to submit? <span className="text-rose-600">*</span>
                </label>
                <select
                  value={submissionType}
                  onChange={(e) => setSubmissionType(e.target.value as SubmissionType)}
                  className="app-input w-full font-semibold text-[#1f4e79]"
                >
                  <option value="correct_mortgage">Correct / Update Existing Mortgagee or Loss Payee</option>
                  <option value="new_mortgage">Add New Mortgagee / Loss Payee Record</option>
                  <option value="correct_permit">Correct Florida Property / Permit Jurisdiction Info</option>
                  <option value="new_permit">Add New Florida Jurisdiction / Permit Portal</option>
                  <option value="general_feedback">General Directory Feedback / Other Suggestion</option>
                </select>
              </div>

              {/* Entity / Jurisdiction / ZIP */}
              <div>
                <label className="block text-[#444] font-medium mb-1">
                  Entity Name, Jurisdiction or ZIP Code <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  placeholder="e.g. Pennymac Loan Services or 33411 Palm Beach"
                  className="app-input w-full font-semibold"
                />
              </div>

              {/* Fields being updated */}
              <div>
                <label className="block text-[#444] font-medium mb-1">
                  Field(s) Being Updated
                </label>
                <input
                  type="text"
                  value={fieldsToUpdate}
                  onChange={(e) => setFieldsToUpdate(e.target.value)}
                  placeholder="e.g. Servicing Email, FAX Number, Clause, Portal URL"
                  className="app-input w-full"
                />
              </div>

              {/* Corrected / New Details */}
              <div className="sm:col-span-2">
                <label className="block text-[#444] font-medium mb-1">
                  New / Corrected Information & Specific Changes <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={4}
                  value={newInformation}
                  onChange={(e) => setNewInformation(e.target.value)}
                  placeholder="Paste or type the corrected mortgagee clause, new servicing email address, updated phone/fax numbers, or portal link..."
                  className="app-input w-full font-mono text-[12px] leading-relaxed resize-y"
                />
              </div>

              {/* Source Reference */}
              <div>
                <label className="block text-[#444] font-medium mb-1">
                  Source / Verification Reference (Optional)
                </label>
                <input
                  type="text"
                  value={sourceReference}
                  onChange={(e) => setSourceReference(e.target.value)}
                  placeholder="e.g. Recent lender closing package / official portal"
                  className="app-input w-full"
                />
              </div>

              {/* Submitter Name / Contact */}
              <div>
                <label className="block text-[#444] font-medium mb-1">
                  Your Name / Agency Contact (Optional)
                </label>
                <input
                  type="text"
                  value={submitterInfo}
                  onChange={(e) => setSubmitterInfo(e.target.value)}
                  placeholder="e.g. Jane Smith, CSR (jane@agency.com)"
                  className="app-input w-full"
                />
              </div>
            </div>
          </div>

          {/* Real-time Email Preview Card */}
          <div className="bg-[#fcfcfc] border border-[#cbd5e1] rounded-[4px] overflow-hidden shadow-2xs">
            <div className="px-3.5 py-2 qq-card-header flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Mail className="w-3.5 h-3.5 text-[#1f4e79]" />
                <span className="text-[11.5px] font-bold text-[#2d3748] uppercase tracking-wider truncate">
                  Generated Email &amp; GitHub Submission Template
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => copyToClipboard(subject, 'subject', 'Email Subject')}
                  className="qq-btn-secondary text-[11px] py-0.5 px-2 flex items-center gap-1 cursor-pointer"
                  title="Copy subject line"
                >
                  {copiedKey === 'subject' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Subject</span>
                </button>

                <button
                  type="button"
                  onClick={() => copyToClipboard(body, 'body', 'Email Body')}
                  className="qq-btn-secondary text-[11px] py-0.5 px-2 flex items-center gap-1 cursor-pointer"
                  title="Copy body text"
                >
                  {copiedKey === 'body' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Body</span>
                </button>
              </div>
            </div>

            {/* Email To & Subject Bar */}
            <div className="p-3 bg-[#f8fafd] border-b border-[#e2e8f0] text-[11.5px] space-y-1.5 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-[#64748b] font-medium w-16 shrink-0">To:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[#004b91]">Directory Administrator &amp; Peer Repository</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-sans inline-flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>FL InsureBase</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                <span className="text-[#64748b] font-medium w-16 shrink-0 pt-0.5">Subject:</span>
                <span className="font-semibold text-[#111] break-all select-all leading-tight">{subject}</span>
              </div>
            </div>

            {/* Email Body Content */}
            <div className="p-3.5 bg-white font-mono text-[12px] text-[#1e293b] whitespace-pre-wrap leading-relaxed select-all selection:bg-[#cce2ff] max-h-48 overflow-y-auto">
              {body}
            </div>
          </div>
        </div>

        {/* Modal Footer with Action Buttons */}
        <div className="px-4 py-3 bg-[#f1f4f8] border-t border-[#d8e0e8] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCopyFullEmail}
            className="qq-btn-secondary text-[11.5px] py-1.5 px-3 flex items-center gap-1.5 font-semibold cursor-pointer justify-center"
          >
            {copiedKey === 'full_email' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Full Template Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#555]" />
                <span>Copy Full Template</span>
              </>
            )}
          </button>

          <div className="flex flex-wrap items-center gap-2 justify-end">
            {/* Submit on GitHub Button */}
            <button
              type="button"
              onClick={handleSubmitOnGithub}
              className="qq-btn-secondary py-1.5 px-3 text-[11.5px] flex items-center gap-1.5 font-bold cursor-pointer border-[#24292e] text-[#24292e] hover:bg-[#24292e] hover:text-white transition-colors"
              title="Open pre-filled GitHub issue on mennapro/fl-insurebase"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Submit on GitHub</span>
            </button>

            {/* Email Update Button */}
            <button
              type="button"
              onClick={handleEmailUpdate}
              className="qq-btn-green py-1.5 px-3.5 text-[12px] flex items-center gap-1.5 font-bold cursor-pointer shadow-xs text-center justify-center"
              title="Send pre-formatted email update to Directory Admin"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Email Update</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="qq-btn-silver text-[11.5px] py-1.5 px-3 font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
