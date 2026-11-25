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
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/90">
        <CreditCard className="w-3 h-3 text-emerald-700 shrink-0" />
        <span>CC Fee: {label}</span>
      </span>
    );
  }

  if (category === 'surcharge') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/90">
        <CreditCard className="w-3 h-3 text-amber-700 shrink-0" />
        <span>CC Fee: {label}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/90">
      <CreditCard className="w-3 h-3 text-slate-500 shrink-0" />
      <span>CC Fee: {label}</span>
    </span>
  );
}

export function renderLobBadges(record: CarrierRecord) {
  const badges: { label: string; className: string }[] = [];

  if (record.Home) {
    badges.push({
      label: 'Home',
      className: 'bg-sky-50 text-sky-800 border-sky-200/90'
    });
  }
  if (record.Auto) {
    badges.push({
      label: 'Auto',
      className: 'bg-indigo-50 text-indigo-800 border-indigo-200/90'
    });
  }
  if (record.Flood) {
    badges.push({
      label: 'Flood',
      className: 'bg-cyan-50 text-cyan-900 border-cyan-200/90'
    });
  }
  if (record.Commercial) {
    badges.push({
      label: 'Commercial',
      className: 'bg-slate-100 text-slate-800 border-slate-200/90'
    });
  }
  if (record.Liability) {
    badges.push({
      label: 'Liability',
      className: 'bg-purple-50 text-purple-800 border-purple-200/90'
    });
  }
  if (record.Personal) {
    badges.push({
      label: 'Personal',
      className: 'bg-stone-100 text-stone-700 border-stone-200/90'
    });
  }
  if (record.Health) {
    badges.push({
      label: 'Health',
      className: 'bg-rose-50 text-rose-800 border-rose-200/90'
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {badges.map((b) => (
        <span
          key={b.label}
          className={`px-2 py-0.5 text-[10.5px] font-semibold rounded-md border ${b.className}`}
        >
          {b.label}
        </span>
      ))}
      {record.CitizensTakeout && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] font-semibold rounded-md border bg-amber-50 text-amber-900 border-amber-300/90">
          <ShieldCheck className="w-3 h-3 text-amber-700 shrink-0" />
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
      className={`bg-white border rounded-xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-3.5 cursor-pointer ${
        isSelected
          ? 'border-sky-600 ring-2 ring-sky-500/20 bg-sky-50/30'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Card Header: Carrier Name + CC Fee Badge */}
        <div className="flex items-start justify-between gap-2.5 mb-2">
          <div className="min-w-0">
            <h3 className="text-[14.5px] font-bold text-slate-900 hover:text-sky-700 transition-colors leading-snug">
              <HighlightedText text={record.Carrier} query={searchQuery} />
            </h3>
            {record.OtherNames && record.OtherNames !== record.Carrier && (
              <p className="text-xs text-slate-500 truncate mt-0.5">
                <HighlightedText text={record.OtherNames} query={searchQuery} />
              </p>
            )}
          </div>
          <div className="shrink-0">{renderCcFeeBadge(record.CC_Fee)}</div>
        </div>

        {/* LOB & Takeout Badges */}
        <div className="mb-3">{renderLobBadges(record)}</div>

        {/* Phone & Email Quick Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50/80 border border-slate-200/70 rounded-lg p-2.5 mb-3">
          <div>
            <span className="text-[10.5px] text-slate-400 uppercase tracking-wider font-semibold block mb-0.5">
              Customer Service
            </span>
            {record.CustomerServicePhone ? (
              <div className="flex items-center gap-1">
                {csTel ? (
                  <a
                    href={csTel}
                    onClick={(e) => e.stopPropagation()}
                    className="font-mono font-semibold text-slate-800 hover:text-sky-700 hover:underline inline-flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-sky-700" />
                    <HighlightedText
                      text={record.CustomerServicePhone}
                      query={searchQuery}
                    />
                  </a>
                ) : (
                  <span className="font-mono font-semibold text-slate-800">
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
                    className="p-0.5 text-slate-400 hover:text-sky-700 cursor-pointer transition-colors"
                    title="Copy phone"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : (
              <span className="text-slate-400">—</span>
            )}
          </div>

          <div>
            <span className="text-[10.5px] text-slate-400 uppercase tracking-wider font-semibold block mb-0.5">
              Claims Support
            </span>
            {record.ClaimsPhone ? (
              <div className="flex items-center gap-1">
                {claimsTel ? (
                  <a
                    href={claimsTel}
                    onClick={(e) => e.stopPropagation()}
                    className="font-mono font-semibold text-slate-800 hover:text-sky-700 hover:underline inline-flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3 text-rose-600" />
                    <HighlightedText text={record.ClaimsPhone} query={searchQuery} />
                  </a>
                ) : (
                  <span className="font-mono font-semibold text-slate-800">{record.ClaimsPhone}</span>
                )}
                {onQuickCopy && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickCopy('Claims Phone', record.ClaimsPhone);
                    }}
                    className="p-0.5 text-slate-400 hover:text-sky-700 cursor-pointer transition-colors"
                    title="Copy claims phone"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : (
              <span className="text-slate-400">—</span>
            )}
          </div>

          {record.ForAgents && (
            <div>
              <span className="text-[10.5px] text-slate-400 uppercase tracking-wider font-semibold block mb-0.5">
                Agent Support Line
              </span>
              {agentTel ? (
                <a
                  href={agentTel}
                  onClick={(e) => e.stopPropagation()}
                  className="text-sky-700 font-mono font-semibold hover:underline"
                >
                  <HighlightedText text={record.ForAgents} query={searchQuery} />
                </a>
              ) : (
                <span className="text-slate-700 font-mono">{record.ForAgents}</span>
              )}
            </div>
          )}

          {record.CustomerServiceEmail && (
            <div className="truncate">
              <span className="text-[10.5px] text-slate-400 uppercase tracking-wider font-semibold block mb-0.5">
                Service Email
              </span>
              {csMail ? (
                <a
                  href={csMail}
                  onClick={(e) => e.stopPropagation()}
                  className="text-sky-700 hover:underline inline-flex items-center gap-1 truncate max-w-full font-medium"
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
                <span className="text-slate-600 truncate">{record.CustomerServiceEmail}</span>
              )}
            </div>
          )}
        </div>

        {/* Notes Preview */}
        {noteLines.length > 0 && (
          <div className="text-xs text-slate-700 bg-amber-50/60 border border-amber-200/70 rounded-lg px-3 py-2 space-y-0.5 max-h-20 overflow-y-auto">
            {noteLines.slice(0, 3).map((line, i) => (
              <div key={i} className="leading-snug">
                <HighlightedText text={line} query={searchQuery} />
              </div>
            ))}
            {noteLines.length > 3 && (
              <div className="text-[10.5px] text-sky-700 font-semibold">
                +{noteLines.length - 3} more line(s)...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desk-Priority Action Buttons Footer */}
      <div
        className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Prominent Primary Make Payment Button */}
        {paymentUrl ? (
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1 px-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white border border-sky-700/80 text-xs font-semibold inline-flex items-center gap-1 shadow-2xs transition-colors"
            title={`Make a payment for ${record.Carrier}`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Make Payment</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-80" />
          </a>
        ) : (
          <span className="text-[11px] text-slate-400 py-1 px-2 border border-slate-200/70 rounded-lg bg-slate-50/70">
            No Payment Link
          </span>
        )}

        {/* 2. Secondary Agent Portal Button */}
        {agentPortalUrl ? (
          <a
            href={agentPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1 px-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-xs font-semibold inline-flex items-center gap-1 shadow-2xs transition-colors"
            title={`Open Agent Portal for ${record.Carrier}`}
          >
            <KeyRound className="w-3 h-3 text-sky-700" />
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
            className="py-1 px-2 rounded-lg bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/90 text-xs font-medium inline-flex items-center gap-1 transition-colors"
            title={`Public Website: ${publicWebUrl}`}
          >
            <Globe className="w-3 h-3 text-slate-500" />
            <span>Website</span>
          </a>
        ) : null}

        {/* 4. Quick View & Admin Actions */}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSelect(record.id)}
            className="py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
            <span>Quick View</span>
          </button>

          {isAdmin && (
            <>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(record)}
                  className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 cursor-pointer transition-colors"
                  title="Edit Carrier"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDuplicate && (
                <button
                  type="button"
                  onClick={() => onDuplicate(record)}
                  className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 cursor-pointer transition-colors"
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
                  className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 cursor-pointer transition-colors"
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
