import React from 'react';
import {
  CreditCard,
  ExternalLink,
  Globe,
  Phone,
  Mail,
  Eye,
  Edit2,
  Copy,
  Trash2,
  ShieldCheck,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { CarrierRecord } from '../types/carrier';
import {
  classifyCcFee,
  normalizeCarrierUrl,
  formatTelHref,
  formatMailtoHref,
  parseCarrierNotesLines
} from '../utils/carrierFormatters';
import { HighlightedText } from '../utils/formatters';

interface CarrierCardProps {
  record: CarrierRecord;
  isSelected: boolean;
  searchQuery: string;
  isAdmin: boolean;
  onSelect: (id: string) => void;
  onEdit?: (record: CarrierRecord) => void;
  onDuplicate?: (record: CarrierRecord) => void;
  onDelete?: (id: string) => void;
  onQuickCopy?: (label: string, value: string) => void;
}

export function renderCcFeeBadge(ccFee?: string | null) {
  const category = classifyCcFee(ccFee);
  const label = (ccFee || '').trim() || 'Contact carrier';

  if (category === 'no_fee') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
        <CreditCard className="w-3 h-3 text-emerald-700 shrink-0" />
        <span>CC Fee: {label}</span>
      </span>
    );
  }

  if (category === 'surcharge') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
        <CreditCard className="w-3 h-3 text-amber-700 shrink-0" />
        <span>CC Fee: {label}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[11px] font-medium bg-[#f4f5f7] text-[#555555] border border-[#d5d5d5]">
      <CreditCard className="w-3 h-3 text-[#777777] shrink-0" />
      <span>CC Fee: {label}</span>
    </span>
  );
}

export function renderLobBadges(record: CarrierRecord) {
  const badges: { label: string; className: string }[] = [];

  if (record.Home) {
    badges.push({
      label: 'Home',
      className: 'bg-[#e8f4fd] text-[#1f4e79] border-[#b6d4fe]'
    });
  }
  if (record.Auto) {
    badges.push({
      label: 'Auto',
      className: 'bg-indigo-50 text-indigo-800 border-indigo-200'
    });
  }
  if (record.Flood) {
    badges.push({
      label: 'Flood',
      className: 'bg-cyan-50 text-cyan-900 border-cyan-300'
    });
  }
  if (record.Commercial) {
    badges.push({
      label: 'Commercial',
      className: 'bg-slate-100 text-slate-800 border-slate-300'
    });
  }
  if (record.Liability) {
    badges.push({
      label: 'Liability',
      className: 'bg-purple-50 text-purple-800 border-purple-200'
    });
  }
  if (record.Personal) {
    badges.push({
      label: 'Personal',
      className: 'bg-stone-100 text-stone-700 border-stone-300'
    });
  }
  if (record.Health) {
    badges.push({
      label: 'Health',
      className: 'bg-rose-50 text-rose-800 border-rose-200'
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {badges.map((b) => (
        <span
          key={b.label}
          className={`px-1.5 py-0.5 text-[10.5px] font-bold rounded-[2px] border ${b.className}`}
        >
          {b.label}
        </span>
      ))}
      {record.CitizensTakeout && (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10.5px] font-bold rounded-[2px] border bg-amber-100/80 text-amber-950 border-amber-400">
          <ShieldCheck className="w-2.5 h-2.5 text-amber-800 shrink-0" />
          <span>Citizens Takeout</span>
        </span>
      )}
    </div>
  );
}

export function CarrierCard({
  record,
  isSelected,
  searchQuery,
  isAdmin,
  onSelect,
  onEdit,
  onDuplicate,
  onDelete,
  onQuickCopy
}: CarrierCardProps) {
  const paymentUrl = normalizeCarrierUrl(record.Payments);
  const agentPortalUrl = normalizeCarrierUrl(record.AgentPortalLogin);
  const publicWebUrl = normalizeCarrierUrl(record.PublicWebsite);
  const noteLines = parseCarrierNotesLines(record.Notes);

  const csTel = formatTelHref(record.CustomerServicePhone);
  const claimsTel = formatTelHref(record.ClaimsPhone);
  const agentTel = formatTelHref(record.ForAgents);
  const csMail = formatMailtoHref(record.CustomerServiceEmail);

  return (
    <div
      onClick={() => onSelect(record.id)}
      className={`bg-white border rounded-[3px] p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-between cursor-pointer ${
        isSelected
          ? 'border-[#286090] ring-1 ring-[#286090]/30 bg-[#f5f9fd]'
          : 'border-[#d5d5d5] hover:border-[#99b3cc]'
      }`}
    >
      <div>
        {/* Card Header: Carrier Name + CC Fee Badge */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="min-w-0">
            <h3 className="text-[14.5px] font-bold text-[#286090] hover:underline leading-snug">
              <HighlightedText text={record.Carrier} query={searchQuery} />
            </h3>
            {record.OtherNames && record.OtherNames !== record.Carrier && (
              <p className="text-[11.5px] text-[#666666] truncate mt-0.5">
                <HighlightedText text={record.OtherNames} query={searchQuery} />
              </p>
            )}
          </div>
          <div className="shrink-0">{renderCcFeeBadge(record.CC_Fee)}</div>
        </div>

        {/* LOB & Takeout Badges */}
        <div className="mb-2.5">{renderLobBadges(record)}</div>

        {/* Phone & Email Quick Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[12px] bg-[#f8f9fa] border border-[#e5e7eb] rounded-[2px] p-2 mb-2.5">
          <div>
            <span className="text-[10.5px] text-[#666666] font-semibold block">
              Customer Service:
            </span>
            {record.CustomerServicePhone ? (
              <div className="flex items-center gap-1">
                {csTel ? (
                  <a
                    href={csTel}
                    onClick={(e) => e.stopPropagation()}
                    className="font-bold text-[#222222] hover:text-[#286090] hover:underline inline-flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-[#286090]" />
                    <HighlightedText
                      text={record.CustomerServicePhone}
                      query={searchQuery}
                    />
                  </a>
                ) : (
                  <span className="font-bold text-[#222222]">
                    {record.CustomerServicePhone}
                  </span>
                )}
                {onQuickCopy && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickCopy('Customer Service Phone', record.CustomerServicePhone);
                    }}
                    className="p-0.5 text-[#777] hover:text-[#286090] cursor-pointer"
                    title="Copy phone"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : (
              <span className="text-[#999999]">—</span>
            )}
          </div>

          <div>
            <span className="text-[10.5px] text-[#666666] font-semibold block">
              Claims Support:
            </span>
            {record.ClaimsPhone ? (
              <div className="flex items-center gap-1">
                {claimsTel ? (
                  <a
                    href={claimsTel}
                    onClick={(e) => e.stopPropagation()}
                    className="font-bold text-[#222222] hover:text-[#286090] hover:underline inline-flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3 text-rose-700" />
                    <HighlightedText text={record.ClaimsPhone} query={searchQuery} />
                  </a>
                ) : (
                  <span className="font-bold text-[#222222]">{record.ClaimsPhone}</span>
                )}
                {onQuickCopy && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickCopy('Claims Phone', record.ClaimsPhone);
                    }}
                    className="p-0.5 text-[#777] hover:text-[#286090] cursor-pointer"
                    title="Copy claims phone"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : (
              <span className="text-[#999999]">—</span>
            )}
          </div>

          {record.ForAgents && (
            <div>
              <span className="text-[10.5px] text-[#666666] font-semibold block">
                Agent Support Line:
              </span>
              {agentTel ? (
                <a
                  href={agentTel}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#286090] font-semibold hover:underline"
                >
                  <HighlightedText text={record.ForAgents} query={searchQuery} />
                </a>
              ) : (
                <span className="text-[#333333]">{record.ForAgents}</span>
              )}
            </div>
          )}

          {record.CustomerServiceEmail && (
            <div className="truncate">
              <span className="text-[10.5px] text-[#666666] font-semibold block">
                Service Email:
              </span>
              {csMail ? (
                <a
                  href={csMail}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#286090] hover:underline inline-flex items-center gap-1 truncate max-w-full"
                >
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    <HighlightedText
                      text={record.CustomerServiceEmail}
                      query={searchQuery}
                    />
                  </span>
                </a>
              ) : (
                <span className="text-[#444] truncate">{record.CustomerServiceEmail}</span>
              )}
            </div>
          )}
        </div>

        {/* Notes Preview with Safe <br> Line Breaks */}
        {noteLines.length > 0 && (
          <div className="text-[11.5px] text-[#444444] bg-amber-50/50 border border-amber-200/70 rounded-[2px] px-2.5 py-1.5 mb-2.5 space-y-0.5 max-h-20 overflow-y-auto">
            {noteLines.slice(0, 3).map((line, i) => (
              <div key={i} className="leading-snug">
                <HighlightedText text={line} query={searchQuery} />
              </div>
            ))}
            {noteLines.length > 3 && (
              <div className="text-[10.5px] text-[#286090] font-semibold">
                +{noteLines.length - 3} more line(s)...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desk-Priority Action Buttons Footer */}
      <div
        className="pt-2.5 border-t border-[#e8e8e8] flex flex-wrap items-center gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Prominent Primary Make Payment Button */}
        {paymentUrl ? (
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="qq-btn-green py-1 px-2.5 text-[11.5px] font-bold inline-flex items-center gap-1 shadow-2xs"
            title={`Make a payment for ${record.Carrier}`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Make Payment</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-80" />
          </a>
        ) : (
          <span className="text-[11px] text-[#999999] py-1 px-2 border border-[#e5e5e5] rounded-[2px] bg-[#fafafa]">
            No Payment Link
          </span>
        )}

        {/* 2. Secondary Agent Portal Button */}
        {agentPortalUrl ? (
          <a
            href={agentPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="qq-btn-secondary py-1 px-2.5 text-[11.5px] font-bold text-[#286090] inline-flex items-center gap-1 shadow-2xs"
            title={`Open Agent Portal for ${record.Carrier}`}
          >
            <KeyRound className="w-3 h-3 text-[#286090]" />
            <span>Agent Portal</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </a>
        ) : null}

        {/* 3. Public Website Link */}
        {publicWebUrl ? (
          <a
            href={publicWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="qq-btn-secondary py-1 px-2 text-[11px] font-semibold text-[#444444] inline-flex items-center gap-1"
            title={`Public Website: ${publicWebUrl}`}
          >
            <Globe className="w-3 h-3 text-[#286090]" />
            <span>Website</span>
          </a>
        ) : null}

        {/* 4. Quick View & Admin Actions */}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSelect(record.id)}
            className="qq-btn-secondary py-1 px-2 text-[11.5px] font-bold text-[#286090] inline-flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          {isAdmin && (
            <>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(record)}
                  className="p-1 rounded text-[#286090] hover:bg-[#e8f1f8] cursor-pointer"
                  title="Edit Carrier"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDuplicate && (
                <button
                  type="button"
                  onClick={() => onDuplicate(record)}
                  className="p-1 rounded text-[#1e7e34] hover:bg-[#e9f7ec] cursor-pointer"
                  title="Duplicate & Edit Carrier"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
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
                  className="p-1 rounded text-rose-700 hover:bg-rose-50 cursor-pointer"
                  title="Delete Carrier"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
