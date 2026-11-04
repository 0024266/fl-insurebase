import React, { useState } from 'react';
import {
  CreditCard,
  ExternalLink,
  Globe,
  Phone,
  Mail,
  Copy,
  Check,
  Edit2,
  Trash2,
  KeyRound,
  AlertCircle,
  FileText,
  Building2,
  Clock,
  MessageSquarePlus
} from 'lucide-react';
import { CarrierRecord } from '../types/carrier';
import {
  normalizeCarrierUrl,
  formatTelHref,
  formatMailtoHref,
  parseCarrierNotesLines,
  classifyCcFee
} from '../utils/carrierFormatters';
import { renderCcFeeBadge, renderLobBadges } from './CarrierCard';
import { QuickViewModal } from './QuickViewModal';
import { useLanguage } from '../context/LanguageContext';

interface CarrierDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: CarrierRecord | null;
  isAdmin: boolean;
  onEdit: (record: CarrierRecord) => void;
  onDuplicate: (record: CarrierRecord) => void;
  onDelete: (id: string) => void;
  onSuggestCorrection?: (record: CarrierRecord) => void;
  onToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalCount?: number;
  onPrev?: () => void;
  onNext?: () => void;
}

export function CarrierDetailModal({
  isOpen,
  onClose,
  record,
  isAdmin,
  onEdit,
  onDuplicate,
  onDelete,
  onSuggestCorrection,
  onToast,
  hasPrev = false,
  hasNext = false,
  currentIndex = 0,
  totalCount = 0,
  onPrev,
  onNext
}: CarrierDetailModalProps) {
  const { isSpanish } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!record) return null;

  const paymentUrl = normalizeCarrierUrl(record.Payments);
  const agentPortalUrl = normalizeCarrierUrl(record.AgentPortalLogin);
  const publicWebUrl = normalizeCarrierUrl(record.PublicWebsite);
  const noteLines = parseCarrierNotesLines(record.Notes);
  const feeCategory = classifyCcFee(record.CC_Fee);

  const csTel = formatTelHref(record.CustomerServicePhone);
  const claimsTel = formatTelHref(record.ClaimsPhone);
  const agentTel = formatTelHref(record.ForAgents);
  const csMail = formatMailtoHref(record.CustomerServiceEmail);
  const claimsMail = formatMailtoHref(record.ClaimsEmail);

  const handleCopy = (value: string, key: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    onToast(`Copied ${label}`, value, 'success');
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 1800);
  };

  const handleCopySummary = () => {
    const lines = [
      `Carrier: ${record.Carrier}`,
      record.OtherNames ? `Aliases: ${record.OtherNames}` : '',
      record.Payments ? `Payment Link: ${record.Payments}` : '',
      `Credit Card Fee: ${record.CC_Fee || 'Contact carrier'}`,
      record.CustomerServicePhone
        ? `Customer Service Phone: ${record.CustomerServicePhone}`
        : '',
      record.CustomerServiceEmail
        ? `Customer Service Email: ${record.CustomerServiceEmail}`
        : '',
      record.ClaimsPhone ? `Claims Phone: ${record.ClaimsPhone}` : '',
      record.ClaimsEmail ? `Claims Email: ${record.ClaimsEmail}` : '',
      record.ForAgents ? `Agent Support Line: ${record.ForAgents}` : ''
    ].filter(Boolean);
    handleCopy(lines.join('\n'), 'all_summary', 'Carrier Contact Summary');
  };

  return (
    <QuickViewModal
      isOpen={isOpen}
      onClose={onClose}
      title={record.Carrier}
      subtitle={
        record.OtherNames && record.OtherNames !== record.Carrier
          ? record.OtherNames
          : 'Insurance Carrier & Underwriting Desk Reference'
      }
      badge={
        record.CitizensTakeout ? (
          <span className="text-[10px] bg-amber-500/30 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded font-bold font-sans">
            Citizens Takeout
          </span>
        ) : null
      }
      icon={<Building2 className="w-4 h-4" />}
      hasPrev={hasPrev}
      hasNext={hasNext}
      currentIndex={currentIndex}
      totalCount={totalCount}
      onPrev={onPrev}
      onNext={onNext}
    >
      <div className="space-y-4 text-[#222222] font-sans">
        {/* Top Summary Header & Admin Actions */}
        <div className="bg-[#f8fafc] border border-[#d5dde6] rounded-[4px] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[16px] font-bold text-[#286090]">
                {record.Carrier}
              </h2>
              {renderCcFeeBadge(record.CC_Fee)}
            </div>
            {record.OtherNames && (
              <p className="text-[12px] text-[#555555]">
                <strong>Known As / MGA:</strong> {record.OtherNames}
              </p>
            )}
            <div className="pt-0.5">{renderLobBadges(record)}</div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1 bg-white border border-[#cbd5e1] rounded-[3px] px-2 py-1 text-[11px] text-[#555]">
              <Clock className="w-3 h-3 text-[#286090]" />
              <span>Updated: {record.LastUpdated || '2025-05-22'}</span>
            </div>

            {onSuggestCorrection && (
              <button
                type="button"
                onClick={() => onSuggestCorrection(record)}
                className="qq-btn-secondary py-1 px-2.5 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <MessageSquarePlus className="w-3.5 h-3.5 text-[#286090]" />
                <span>{isSpanish ? 'Sugerir Cambio' : 'Suggest Update'}</span>
              </button>
            )}

            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => onEdit(record)}
                  className="qq-btn-secondary py-1 px-2.5 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3 text-[#286090]" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDuplicate(record)}
                  className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 py-1 px-2.5 text-[11px] font-semibold flex items-center gap-1 cursor-pointer rounded-[3px]"
                >
                  <Copy className="w-3 h-3 text-emerald-700" />
                  <span>Duplicate & Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete carrier "${record.Carrier}"?`
                      )
                    ) {
                      onDelete(record.id);
                    }
                  }}
                  className="bg-white hover:bg-rose-50 border border-rose-300 text-rose-700 py-1 px-2 text-[11px] font-semibold flex items-center gap-1 cursor-pointer rounded-[3px]"
                >
                  <Trash2 className="w-3 h-3 text-rose-600" />
                  <span>Delete</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleCopySummary}
              className="qq-btn-green py-1 px-3 text-[11.5px] font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {copiedKey === 'all_summary' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section 1: Quick Links (Agent Portal Login, Insured Online Payments, Public Website) */}
        <div className="bg-white border border-[#d2d9e2] rounded-[4px] overflow-hidden shadow-2xs">
          <div className="qq-card-header px-3.5 py-2 flex items-center justify-between">
            <h3 className="text-[12px] font-bold text-[#2d3748] uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#286090]" />
              <span>1. Quick Links & Portals</span>
            </h3>
          </div>
          <div className="p-3.5 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Insured Online Payments */}
            <div className="border border-[#e2e8f0] rounded-[3px] p-3 bg-[#f8fafc] flex flex-col justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-[#555555] uppercase block">
                  Insured Online Payments
                </span>
                <p className="text-[11.5px] text-[#666666] truncate mt-0.5 font-mono">
                  {record.Payments || 'Not specified'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {paymentUrl ? (
                  <>
                    <a
                      href={paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="qq-btn-green py-1.5 px-3 text-[12px] font-bold inline-flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Make Payment</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(paymentUrl, 'payment_url', 'Payment URL')
                      }
                      className="qq-btn-secondary py-1.5 px-2.5 text-[11.5px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                      title="Copy Payment URL"
                    >
                      {copiedKey === 'payment_url' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#286090]" />
                      )}
                      <span>Copy</span>
                    </button>
                  </>
                ) : (
                  <span className="text-[11.5px] text-[#888888] italic">
                    No direct online payment link
                  </span>
                )}
              </div>
            </div>

            {/* Agent Portal Login */}
            <div className="border border-[#e2e8f0] rounded-[3px] p-3 bg-[#f8fafc] flex flex-col justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-[#555555] uppercase block">
                  Agent Portal Login
                </span>
                <p className="text-[11.5px] text-[#666666] truncate mt-0.5 font-mono">
                  {record.AgentPortalLogin || 'Not specified'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {agentPortalUrl ? (
                  <>
                    <a
                      href={agentPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="qq-btn-secondary py-1.5 px-3 text-[12px] font-bold text-[#286090] inline-flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#286090]" />
                      <span>Agent Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          agentPortalUrl,
                          'agent_portal_url',
                          'Agent Portal URL'
                        )
                      }
                      className="qq-btn-secondary py-1.5 px-2.5 text-[11.5px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'agent_portal_url' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#286090]" />
                      )}
                      <span>Copy</span>
                    </button>
                  </>
                ) : (
                  <span className="text-[11.5px] text-[#666666]">
                    {record.AgentPortalLogin || 'No portal URL on file'}
                  </span>
                )}
              </div>
            </div>

            {/* Public Website */}
            <div className="border border-[#e2e8f0] rounded-[3px] p-3 bg-[#f8fafc] flex flex-col justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-[#555555] uppercase block">
                  Public Website
                </span>
                <p className="text-[11.5px] text-[#666666] truncate mt-0.5 font-mono">
                  {record.PublicWebsite || 'Not specified'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {publicWebUrl ? (
                  <>
                    <a
                      href={publicWebUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="qq-btn-secondary py-1.5 px-3 text-[12px] font-bold text-[#286090] inline-flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#286090]" />
                      <span>Open Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(publicWebUrl, 'public_web_url', 'Public Website')
                      }
                      className="qq-btn-secondary py-1.5 px-2.5 text-[11.5px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'public_web_url' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#286090]" />
                      )}
                      <span>Copy</span>
                    </button>
                  </>
                ) : (
                  <span className="text-[11.5px] text-[#888888] italic">
                    No public website listed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Policyholder & Agent Support */}
        <div className="bg-white border border-[#d2d9e2] rounded-[4px] overflow-hidden shadow-2xs">
          <div className="qq-card-header px-3.5 py-2">
            <h3 className="text-[12px] font-bold text-[#2d3748] uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[#286090]" />
              <span>2. Policyholder, Claims & Agent Support</span>
            </h3>
          </div>
          <div className="p-3.5 grid grid-cols-1 md:grid-cols-3 gap-3 text-[12.5px]">
            {/* Customer Service */}
            <div className="border border-[#e2e8f0] rounded-[3px] p-3 space-y-2">
              <div className="text-[11px] font-bold text-[#286090] uppercase tracking-wider">
                Customer Service
              </div>
              <div>
                <span className="text-[11px] text-[#666666] block">Phone:</span>
                {record.CustomerServicePhone ? (
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    {csTel ? (
                      <a
                        href={csTel}
                        className="font-bold text-[13.5px] text-[#222222] hover:text-[#286090] hover:underline inline-flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#286090]" />
                        <span>{record.CustomerServicePhone}</span>
                      </a>
                    ) : (
                      <span className="font-bold">{record.CustomerServicePhone}</span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          record.CustomerServicePhone,
                          'cs_phone',
                          'Customer Service Phone'
                        )
                      }
                      className="qq-btn-secondary px-2 py-0.5 text-[11px] inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'cs_phone' ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-[#999999]">Not listed</span>
                )}
              </div>

              <div>
                <span className="text-[11px] text-[#666666] block">Email:</span>
                {record.CustomerServiceEmail ? (
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    {csMail ? (
                      <a
                        href={csMail}
                        className="text-[#286090] font-semibold hover:underline inline-flex items-center gap-1 truncate"
                      >
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{record.CustomerServiceEmail}</span>
                      </a>
                    ) : (
                      <span>{record.CustomerServiceEmail}</span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          record.CustomerServiceEmail,
                          'cs_email',
                          'Customer Service Email'
                        )
                      }
                      className="qq-btn-secondary px-2 py-0.5 text-[11px] inline-flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      {copiedKey === 'cs_email' ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-[#999999]">Not listed</span>
                )}
              </div>
            </div>

            {/* Claims Support */}
            <div className="border border-[#e2e8f0] rounded-[3px] p-3 space-y-2">
              <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                Claims Department
              </div>
              <div>
                <span className="text-[11px] text-[#666666] block">Claims Phone:</span>
                {record.ClaimsPhone ? (
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    {claimsTel ? (
                      <a
                        href={claimsTel}
                        className="font-bold text-[13.5px] text-[#222222] hover:text-[#286090] hover:underline inline-flex items-center gap-1"
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>{record.ClaimsPhone}</span>
                      </a>
                    ) : (
                      <span className="font-bold">{record.ClaimsPhone}</span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(record.ClaimsPhone, 'claims_phone', 'Claims Phone')
                      }
                      className="qq-btn-secondary px-2 py-0.5 text-[11px] inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'claims_phone' ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-[#999999]">Not listed</span>
                )}
              </div>

              <div>
                <span className="text-[11px] text-[#666666] block">Claims Email:</span>
                {record.ClaimsEmail ? (
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    {claimsMail ? (
                      <a
                        href={claimsMail}
                        className="text-[#286090] font-semibold hover:underline inline-flex items-center gap-1 truncate"
                      >
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{record.ClaimsEmail}</span>
                      </a>
                    ) : (
                      <span>{record.ClaimsEmail}</span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(record.ClaimsEmail, 'claims_email', 'Claims Email')
                      }
                      className="qq-btn-secondary px-2 py-0.5 text-[11px] inline-flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      {copiedKey === 'claims_email' ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-[#999999]">Not listed</span>
                )}
              </div>
            </div>

            {/* Agent Dedicated Line */}
            <div className="border border-[#e2e8f0] rounded-[3px] p-3 space-y-2">
              <div className="text-[11px] font-bold text-[#2d3748] uppercase tracking-wider">
                For Agents / Underwriting
              </div>
              <div>
                <span className="text-[11px] text-[#666666] block">
                  Agent Support Line:
                </span>
                {record.ForAgents ? (
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    {agentTel ? (
                      <a
                        href={agentTel}
                        className="font-bold text-[13.5px] text-[#286090] hover:underline inline-flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{record.ForAgents}</span>
                      </a>
                    ) : (
                      <span className="font-bold">{record.ForAgents}</span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(record.ForAgents, 'agent_phone', 'Agent Phone')
                      }
                      className="qq-btn-secondary px-2 py-0.5 text-[11px] inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'agent_phone' ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-[#999999]">Use Customer Service line</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 & 4: Underwriting & Carrier Notes + Surcharge & Payment Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section 3: Underwriting & Carrier Notes */}
          <div className="bg-white border border-[#d2d9e2] rounded-[4px] overflow-hidden shadow-2xs flex flex-col">
            <div className="qq-card-header px-3.5 py-2 flex items-center justify-between">
              <h3 className="text-[12px] font-bold text-[#2d3748] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#286090]" />
                <span>3. Underwriting & Carrier Notes</span>
              </h3>
              {noteLines.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(noteLines.join('\n'), 'carrier_notes', 'Carrier Notes')
                  }
                  className="text-[11px] text-[#286090] hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'carrier_notes' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>Copy Notes</span>
                </button>
              )}
            </div>
            <div className="p-3.5 flex-1">
              {noteLines.length > 0 ? (
                <div className="space-y-1.5 text-[12.5px] text-[#222222] bg-amber-50/50 border border-amber-200 rounded-[3px] p-3">
                  {noteLines.map((line, i) => (
                    <p key={i} className="leading-relaxed break-words">
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-[#888888] italic">
                  No special underwriting or agency notes recorded for this carrier.
                </p>
              )}
            </div>
          </div>

          {/* Section 4: Surcharge & Payment Rules */}
          <div className="bg-white border border-[#d2d9e2] rounded-[4px] overflow-hidden shadow-2xs flex flex-col">
            <div className="qq-card-header px-3.5 py-2">
              <h3 className="text-[12px] font-bold text-[#2d3748] uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#286090]" />
                <span>4. Surcharge & Payment Rules</span>
              </h3>
            </div>
            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
              <div
                className={`p-3 rounded-[3px] border ${
                  feeCategory === 'no_fee'
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : feeCategory === 'surcharge'
                    ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                    : 'bg-[#f8fafc] border-[#cbd5e1] text-[#333333]'
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                  Credit Card / EFT Surcharge Policy
                </div>
                <div className="text-[15px] font-bold mt-1">
                  {record.CC_Fee || 'Contact carrier for payment fee details'}
                </div>
                <p className="text-[11.5px] mt-1.5 opacity-90">
                  {feeCategory === 'no_fee'
                    ? 'Zero credit card processing surcharge reported for standard payments.'
                    : feeCategory === 'surcharge'
                    ? 'Processing fee or payment method restriction applies. Advise insured prior to card entry (ACH/EFT is often $0 or lower).'
                    : 'Verify fee terms on carrier payment portal screen before submitting payment.'}
                </p>
              </div>

              {paymentUrl && (
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11.5px] text-[#555555]">
                    Direct Insured Payment Portal:
                  </span>
                  <a
                    href={paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="qq-btn-green py-1 px-3 text-[11.5px] font-bold inline-flex items-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Launch Payment Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </QuickViewModal>
  );
}
