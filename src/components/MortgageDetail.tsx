import React, { useState } from 'react';
import {
  Copy,
  Check,
  Phone,
  Printer,
  Mail,
  ExternalLink,
  Edit,
  Trash2,
  FileText,
  Clock,
  Building2,
  SlidersHorizontal,
  Info,
  Globe,
  Send,
  MessageSquarePlus,
  ShieldCheck,
  MapPin,
  Download
} from 'lucide-react';
import { MortgageRecord, ClauseCustomization } from '../types/mortgage';
import {
  getRecordId,
  buildMortgageeClause,
  cleanPhoneUri,
  sanitizeUrl,
  isLossPayee,
  buildPolicyDocEmail
} from '../utils/formatters';
import { downloadVCard } from '../utils/vcard';
import { openMailClient } from '../utils/obfuscation';
import { useLanguage } from '../context/LanguageContext';
import { copyToClipboard as copyToClipboardHelper } from '../utils/clipboard';
import { CopyableContact } from './CopyableContact';

interface MortgageDetailProps {
  record: MortgageRecord | null;
  isAdmin?: boolean;
  onEdit: (record: MortgageRecord) => void;
  onDuplicate?: (record: MortgageRecord) => void;
  onDelete: (id: string) => void;
  onBack?: () => void;
  onEmailDocs?: (record: MortgageRecord) => void;
  onSuggestCorrection?: (record: MortgageRecord) => void;
  onToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export function MortgageDetail({
  record,
  isAdmin = false,
  onEdit,
  onDuplicate,
  onDelete,
  onSuggestCorrection,
  onToast
}: MortgageDetailProps) {
  const { t, isSpanish } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showCustomizer, setShowCustomizer] = useState(true);
  const [customization, setCustomization] = useState<ClauseCustomization>({
    loanNumber: '',
    borrowerName: '',
    policyNumber: ''
  });

  if (!record) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#777] bg-white border border-[#d0d0d0] rounded-[3px]">
        <div className="w-14 h-14 rounded-full bg-[#f4f4f4] border border-[#ddd] flex items-center justify-center text-[#888] mb-3">
          <Building2 className="w-7 h-7 text-[#777]" />
        </div>
        <h3 className="text-[15px] font-semibold text-[#333]">
          {isSpanish ? 'Ninguna Cuenta Seleccionada' : 'No Account Selected'}
        </h3>
        <p className="text-[12px] text-[#666] max-w-sm mt-1">
          {isSpanish
            ? 'Seleccione cualquier acreedor o beneficiario de la tabla para ver cláusulas, canales directos y portales.'
            : 'Select any mortgage or loss payee record from the table to view complete mortgagee clauses, direct servicing channels, and verification portals.'}
        </p>
      </div>
    );
  }

  const recordId = getRecordId(record);
  // Standard Mortgagee Clause without loan number as requested
  const standardClauseText = buildMortgageeClause(record);
  const lossPayee = isLossPayee(record);

  // Policy email with customization options
  const policyEmail = buildPolicyDocEmail(record, {
    loanNumber: customization.loanNumber,
    borrowerName: customization.borrowerName,
    policyNumber: customization.policyNumber
  });

  const targetEmail = record.email?.trim() || '';

  const copyToClipboard = async (text: string, key: string, label: string) => {
    if (!text || !text.trim()) return;
    const success = await copyToClipboardHelper(text.trim());
    if (success) {
      setCopiedKey(key);
      onToast(isSpanish ? 'Copiado al Portapapeles' : 'Copied to Clipboard', label, 'success');
      setTimeout(() => {
        setCopiedKey(null);
      }, 2000);
    } else {
      onToast(isSpanish ? 'Error al Copiar' : 'Copy Failed', isSpanish ? 'No se pudo copiar' : 'Unable to copy to clipboard', 'error');
    }
  };

  const primaryPhone = record.Telephone || record.Telephone2;
  const hasFax = Boolean(record.FAX && record.FAX.trim());
  const fullAddress = [
    record.Address,
    [record.City, record.State, record.ZIP].filter(Boolean).join(' ')
  ].filter(Boolean).join(', ');

  const handleSendEmailApp = () => {
    onToast(
      isSpanish ? 'Abriendo Aplicación de Correo' : 'Opening Email App',
      isSpanish ? 'Abriendo correo con la plantilla prellenada de documentos de póliza' : 'Opening your email app with pre-filled policy documents template',
      'success'
    );
    openMailClient(targetEmail, policyEmail.subject, policyEmail.body);
  };

  return (
    <div className="bg-white border border-[#c5ced8] rounded-[4px] p-4 sm:p-5 shadow-xs flex flex-col gap-4 text-[#222] font-sans">
      {/* 1. Entity Title Header Card with Last Updated at Top */}
      <div className="bg-[#f8fafd] border border-[#cbd5e1] rounded-[4px] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-[4px] bg-[#e8f4fd] border border-[#bde0fe] text-[#286090] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[16px] sm:text-[17px] font-bold text-[#286090] leading-snug truncate">
                {record.Name || 'Unnamed Entity'}
              </h2>

              {/* Copy Entity Name Button */}
              {record.Name && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(record.Name!, 'entity_name', 'Entity Name')}
                  className="p-1 rounded hover:bg-[#e2e8f0] text-[#666] hover:text-[#286090] cursor-pointer"
                  title="Copy entity name"
                >
                  {copiedKey === 'entity_name' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}

              {lossPayee ? (
                <span className="inline-flex items-center gap-1 text-[10.5px] bg-[#fff5f5] text-[#c53030] border border-[#feb2b2] px-2 py-0.5 rounded-[3px] font-bold tracking-wide">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{isSpanish ? 'Beneficiario de Pérdida / Ambos' : 'Loss Payee / Both'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10.5px] bg-[#ebf8ff] text-[#286090] border border-[#bee3f8] px-2 py-0.5 rounded-[3px] font-semibold">
                  <span>{isSpanish ? 'Acreedor Hipotecario' : 'Mortgagee'}</span>
                </span>
              )}
            </div>

            {/* Alternate Names / Servicing Aliases text with copy button */}
            {record.Name2 && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] uppercase font-bold text-[#64748b] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                  Alternate Names / Servicing Aliases:
                </span>
                <p className="text-[12px] text-[#2d3748] font-semibold truncate max-w-xl">
                  {record.Name2}
                </p>
                <button
                  type="button"
                  onClick={() => copyToClipboard(record.Name2!, 'isaoa_text', 'ISAOA / Alternate Names')}
                  className="p-0.5 rounded hover:bg-[#e2e8f0] text-[#777] hover:text-[#286090] cursor-pointer shrink-0"
                  title="Copy Alternate Names / ISAOA text"
                >
                  {copiedKey === 'isaoa_text' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            )}

            {/* Street Address with copy button */}
            {fullAddress && (
              <div className="flex items-center gap-1.5 text-[12px] text-[#666666] mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#888888] shrink-0" />
                <span className="truncate">{fullAddress}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(fullAddress, 'address_text', 'Mailing Address')}
                  className="p-0.5 rounded hover:bg-[#e2e8f0] text-[#777] hover:text-[#286090] cursor-pointer"
                  title="Copy address"
                >
                  {copiedKey === 'address_text' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons: Download vCard, Last Updated & Suggest Correction */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap">
          {/* Download vCard (.vcf) button */}
          <button
            type="button"
            onClick={() => {
              downloadVCard(record);
              onToast('vCard Exported', `Exported contact file for ${record.Name || 'Lender'}`, 'success');
            }}
            className="qq-btn-secondary py-1 px-2.5 text-[11.5px] flex items-center gap-1 font-bold text-[#0066c0] border-[#0066c0]/30 hover:bg-[#0066c0]/10 cursor-pointer shadow-2xs"
            title="Download vCard contact file (.vcf) for Outlook / Contacts"
          >
            <Download className="w-3.5 h-3.5 text-[#0066c0]" />
            <span>Download vCard (.vcf)</span>
          </button>

          {/* Last Updated Badge */}
          <div className="flex items-center gap-1.5 bg-white border border-[#cbd5e1] rounded-[3px] px-2.5 py-1 text-[11.5px] text-[#555] shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-[#286090]" />
            <span>
              Last Updated: <strong className="font-mono text-[#222]">{record.LastUpdated || '2025-01-01'}</strong>
            </span>
          </div>

          {onSuggestCorrection && (
            <button
              type="button"
              onClick={() => onSuggestCorrection(record)}
              className="qq-btn-secondary py-1 px-2.5 text-[11.5px] flex items-center gap-1 font-semibold cursor-pointer"
              title={isSpanish ? 'Sugerir corrección o actualización' : 'Suggest an update or correction for this mortgagee'}
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-[#286090]" />
              <span>{t('suggestCorrection')}</span>
            </button>
          )}

          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => onEdit(record)}
                className="qq-btn-secondary py-1 px-2.5 text-[11.5px] flex items-center gap-1 font-semibold cursor-pointer"
                title="Edit record"
              >
                <Edit className="w-3.5 h-3.5 text-[#286090]" />
                <span>{t('editRecord')}</span>
              </button>
              {onDuplicate && (
                <button
                  type="button"
                  onClick={() => onDuplicate(record)}
                  className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 py-1 px-2.5 text-[11.5px] flex items-center gap-1 font-semibold cursor-pointer rounded-[3px]"
                  title="Duplicate & Edit this mortgagee clause"
                >
                  <Copy className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Duplicate & Edit</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onDelete(recordId)}
                className="qq-btn-secondary py-1 px-2.5 text-[11.5px] flex items-center gap-1 text-rose-700 hover:bg-rose-50 border-rose-300 font-semibold cursor-pointer"
                title="Delete record"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>{t('deleteRecord')}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. Standard Mortgagee Clause Box (Clean, without loan number) */}
      <div className="bg-[#fcfcfc] border border-[#d2d9e2] rounded-[4px] overflow-hidden shadow-2xs">
        <div className="px-3.5 py-2.5 qq-card-header flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#286090]" />
            <h3 className="text-[12px] font-bold text-[#2d3748] uppercase tracking-wider">
              {t('clauseCardTitle')}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(standardClauseText, 'standard_clause', 'Standard Mortgagee Clause')}
            className={`text-[11.5px] py-1 px-3 flex items-center gap-1.5 font-bold cursor-pointer transition-all ${
              copiedKey === 'standard_clause'
                ? 'bg-emerald-600 text-white border border-emerald-700 rounded-[3px]'
                : 'qq-btn-green'
            }`}
          >
            {copiedKey === 'standard_clause' ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>{t('clauseCopied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t('copyFullClause')}</span>
              </>
            )}
          </button>
        </div>

        {/* Clean Standard Clause Display */}
        <div className="p-3.5 bg-white font-mono text-[12.5px] text-[#111] whitespace-pre-wrap leading-relaxed select-all selection:bg-[#cce2ff]">
          {standardClauseText}
        </div>
      </div>

      {/* 3. Servicing & Contact Channels: ONLINE PORTAL FIRST, THEN PHONE & FAX (ABOVE EMAIL TEMPLATE) */}
      <div className="bg-[#fcfcfc] border border-[#d2d9e2] rounded-[4px] overflow-hidden shadow-2xs">
        <div className="px-3.5 py-2 qq-card-header flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#286090]" />
            <h3 className="text-[12px] font-bold text-[#2d3748] uppercase tracking-wider">
              {t('contactChannelsTitle')}
            </h3>
          </div>
          <span className="text-[11px] text-[#718096] font-medium">Lender & Servicing Department</span>
        </div>

        <div className="p-3.5 flex flex-col gap-3 text-[12px]">
          {/* A. ONLINE PORTAL FIRST */}
          <div className="p-3 bg-[#f8fafd] border border-[#c8d8ec] rounded-[3px] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded bg-[#e8f4fd] border border-[#bde0fe] text-[#286090] flex items-center justify-center shrink-0 shadow-2xs">
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-[#444] font-bold uppercase tracking-wider">{t('onlinePortal')}</p>
                {record.Online && record.Online.trim() ? (
                  <a
                    href={sanitizeUrl(record.Online)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12.5px] font-semibold text-[#286090] hover:underline truncate block select-all"
                  >
                    {record.Online}
                  </a>
                ) : (
                  <span className="text-[11.5px] text-[#999] italic">{t('noPortal')}</span>
                )}
              </div>
            </div>

            {record.Online && record.Online.trim() && (
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={sanitizeUrl(record.Online)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="qq-btn-secondary text-[11.5px] py-1 px-3 flex items-center gap-1 font-bold text-[#286090] shadow-2xs cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-[#286090]" />
                  <span>{t('visitPortal')}</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <button
                  type="button"
                  onClick={() => copyToClipboard(record.Online!, 'online_url', 'Online Portal URL')}
                  className="qq-btn-secondary text-[11.5px] py-1 px-2.5 flex items-center gap-1 font-semibold cursor-pointer"
                  title="Copy Portal URL"
                >
                  {copiedKey === 'online_url' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#555]" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* B. PHONE & FAX (WITH COPYABLE CONTACT INTERACTION) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Phone */}
            <div className="p-2.5 bg-[#fafafa] border border-[#d8d8d8] rounded-[3px] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-7 h-7 rounded bg-[#e8f4fd] border border-[#bde0fe] text-[#286090] flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] text-[#666] font-medium">{t('phone')}</p>
                  <CopyableContact value={primaryPhone} type="phone" />
                </div>
              </div>
            </div>

            {/* FAX */}
            <div className="p-2.5 bg-[#fafafa] border border-[#d8d8d8] rounded-[3px] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-7 h-7 rounded bg-[#e8f4fd] border border-[#bde0fe] text-[#286090] flex items-center justify-center shrink-0">
                  <Printer className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] text-[#666] font-medium">{t('fax')}</p>
                  <CopyableContact value={record.FAX} type="fax" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TEMPLATE TO EMAIL LENDER (With Loan #, Named Insured, Policy # fields moved here!) */}
      <div className="bg-white border border-[#cbd5e1] rounded-[4px] overflow-hidden shadow-2xs">
        {/* Email Section Header with Actions */}
        <div className="px-3.5 py-2.5 bg-[#f4f7fa] border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="w-4 h-4 text-[#286090]" />
            <span className="font-bold text-[#222] text-[12.5px] uppercase tracking-wider">
              Template to email Lender
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Toggle Customize Fields Button */}
            <button
              type="button"
              onClick={() => setShowCustomizer(!showCustomizer)}
              className="qq-btn-secondary text-[11.5px] py-1 px-2.5 flex items-center gap-1 cursor-pointer font-semibold"
              title="Add Loan #, Named Insured, Policy #"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#555]" />
              <span>{showCustomizer ? 'Hide Fields' : 'Customize Email'}</span>
            </button>

            {/* Copy Template Button */}
            <button
              type="button"
              onClick={() =>
                copyToClipboard(
                  `Subject: ${policyEmail.subject}\n\n${policyEmail.body}`,
                  'email_full_template',
                  'Full Email Template'
                )
              }
              className="qq-btn-secondary text-[11.5px] py-1 px-2.5 flex items-center gap-1 font-semibold cursor-pointer"
              title="Copy entire email subject and body template"
            >
              {copiedKey === 'email_full_template' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Template Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#555]" />
                  <span>Copy Template</span>
                </>
              )}
            </button>

            {/* Send via your email app Button */}
            <button
              type="button"
              onClick={handleSendEmailApp}
              className="qq-btn-green text-[11.5px] py-1 px-3 flex items-center gap-1.5 font-bold cursor-pointer shadow-2xs"
              title="Open in your default email application (Outlook, Mail, Gmail)"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send via your email app</span>
            </button>
          </div>
        </div>

        {/* Fields to add Loan #, Named Insured / Borrower, and Policy # (MOVED HERE AS REQUESTED) */}
        {showCustomizer && (
          <div className="p-3 bg-[#f8f9fa] border-b border-[#e2e8f0] grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
            <div>
              <label className="block text-[#444] mb-1 font-bold">
                Loan # / Account Number
              </label>
              <input
                type="text"
                value={customization.loanNumber}
                onChange={(e) =>
                  setCustomization((prev) => ({ ...prev, loanNumber: e.target.value }))
                }
                placeholder="e.g. 1092837482"
                className="app-input w-full font-mono text-[12px]"
              />
            </div>
            <div>
              <label className="block text-[#444] mb-1 font-bold">
                Named Insured / Borrower
              </label>
              <input
                type="text"
                value={customization.borrowerName}
                onChange={(e) =>
                  setCustomization((prev) => ({ ...prev, borrowerName: e.target.value }))
                }
                placeholder="e.g. John & Jane Doe"
                className="app-input w-full font-sans text-[12px]"
              />
            </div>
            <div>
              <label className="block text-[#444] mb-1 font-bold">
                Policy # (Optional)
              </label>
              <input
                type="text"
                value={customization.policyNumber}
                onChange={(e) =>
                  setCustomization((prev) => ({ ...prev, policyNumber: e.target.value }))
                }
                placeholder="e.g. HO-2026-9938"
                className="app-input w-full font-mono text-[12px]"
              />
            </div>
          </div>
        )}

        {/* Registered Email Display with Copy button (Send To override removed as requested) */}
        <div className="p-3 bg-[#fafbfc] border-b border-[#edf2f7] text-[12px]">
          <div className="flex items-center justify-between p-2 bg-white border border-[#e2e8f0] rounded-[2px]">
            <div className="min-w-0">
              <span className="text-[10.5px] text-[#718096] font-medium block">Registered Email</span>
              {record.email && record.email.trim() ? (
                <span className="font-mono text-[#286090] font-semibold truncate block select-all">
                  {record.email}
                </span>
              ) : (
                <span className="text-[11.5px] text-[#999] italic">No direct email on file</span>
              )}
            </div>
            {record.email && record.email.trim() && (
              <button
                type="button"
                onClick={() => copyToClipboard(record.email!, 'registered_email', 'Email Address')}
                className="p-1 rounded hover:bg-[#e2e8f0] text-[#666] hover:text-[#286090] cursor-pointer inline-flex items-center gap-1 font-semibold text-[11px]"
                title="Copy email address"
              >
                {copiedKey === 'registered_email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#555]" />}
                <span>{copiedKey === 'registered_email' ? 'Copied' : 'Copy Email'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Subject Line Bar with Copy Button */}
        <div className="px-3.5 py-1.5 bg-[#f4f7fa] border-b border-[#e2e8f0] text-[11.5px] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[#64748b] font-bold shrink-0">{t('emailSubject')}:</span>
            <span className="font-semibold text-[#286090] truncate select-all">{policyEmail.subject}</span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(policyEmail.subject, 'email_subject', 'Subject Line')}
            className="text-[11px] text-[#286090] hover:underline font-bold cursor-pointer shrink-0 inline-flex items-center gap-1"
          >
            {copiedKey === 'email_subject' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copiedKey === 'email_subject' ? 'Copied' : t('copySubject')}</span>
          </button>
        </div>

        {/* Email Body Preview with Copy Button */}
        <div className="p-3.5 bg-white font-sans text-[12.5px] text-[#1e293b] whitespace-pre-wrap leading-relaxed select-all selection:bg-[#cce2ff]">
          {policyEmail.body}
        </div>

        <div className="px-3.5 py-1.5 bg-[#f8fafc] border-t border-[#e2e8f0] text-[11px] text-[#64748b] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span>Attach declarations page PDF and invoice in your email app.</span>
          <button
            type="button"
            onClick={() => copyToClipboard(policyEmail.body, 'email_body_only', 'Email Body Text')}
            className="text-[11px] text-[#286090] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
          >
            {copiedKey === 'email_body_only' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copiedKey === 'email_body_only' ? 'Copied Body' : 'Copy Body Text'}</span>
          </button>
        </div>
      </div>

      {/* 5. Internal Notes & Loan Instructions (With Copy Button) */}
      {record.Notes && record.Notes.trim() && (
        <div className="bg-[#fffdfa] border border-[#fbd38d] rounded-[4px] p-3 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#b7791f]" />
              <h4 className="text-[11px] font-bold text-[#744210] uppercase tracking-wider">
                {t('internalNotes')}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(record.Notes!, 'internal_notes', 'Internal Notes')}
              className="p-1 rounded hover:bg-[#fef3c7] text-[#92400e] cursor-pointer text-[11px] font-bold inline-flex items-center gap-1"
            >
              {copiedKey === 'internal_notes' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'internal_notes' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="text-[12px] text-[#744210] whitespace-pre-wrap font-sans leading-relaxed select-all">
            {record.Notes}
          </div>
        </div>
      )}
    </div>
  );
}
