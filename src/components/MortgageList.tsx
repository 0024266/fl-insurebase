import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Mail,
  Globe,
  ExternalLink,
  Edit,
  Eye,
  Share2,
  Copy,
  Trash2,
  LayoutGrid,
  Table as TableIcon,
  Building2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Download,
  MessageSquarePlus
} from 'lucide-react';
import { MortgageRecord } from '../types/mortgage';
import {
  getRecordId,
  HighlightedText,
  sanitizeUrl,
  isAutoOrLossPayee
} from '../utils/formatters';
import { downloadVCard, exportMortgageesCsv } from '../utils/vcard';
import { useLanguage } from '../context/LanguageContext';
import { usePreferences } from '../context/PreferencesContext';
import { getShareableUrl } from '../utils/urlState';
import { CopyableContact } from './CopyableContact';

interface MortgageListProps {
  records: MortgageRecord[];
  selectedId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  isAdmin?: boolean;
  onQuickCopy?: (clauseText: string) => void;
  onEdit?: (record: MortgageRecord) => void;
  onDuplicate?: (record: MortgageRecord) => void;
  onDelete?: (id: string) => void;
  onEmailDocs?: (record: MortgageRecord) => void;
  onSuggestCorrection?: (record: MortgageRecord) => void;
}

export function MortgageList({
  records,
  selectedId,
  onSelect,
  searchQuery,
  isAdmin = false,
  onQuickCopy,
  onEdit,
  onDuplicate,
  onDelete,
  onEmailDocs,
  onSuggestCorrection
}: MortgageListProps) {
  const { isSpanish } = useLanguage();
  const { viewMode, setViewMode, compactView } = usePreferences();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Reset to page 1 whenever searchQuery or total records change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, records.length]);

  const totalPages = pageSize === -1 ? 1 : Math.max(1, Math.ceil(records.length / pageSize));
  const paginatedRecords = useMemo(() => {
    if (pageSize === -1) return records;
    const start = (currentPage - 1) * pageSize;
    return records.slice(start, start + pageSize);
  }, [records, currentPage, pageSize]);

  const startIdx = records.length === 0 ? 0 : (currentPage - 1) * (pageSize === -1 ? records.length : pageSize) + 1;
  const endIdx = pageSize === -1 ? records.length : Math.min(currentPage * pageSize, records.length);

  const handleShareRecord = (e: React.MouseEvent, record: MortgageRecord) => {
    e.stopPropagation();
    const id = getRecordId(record);
    const shareUrl = getShareableUrl({
      tab: 'mortgages',
      id: id,
      view: 'detail',
      q: searchQuery || undefined
    });
    navigator.clipboard.writeText(shareUrl).then(() => {
      if (onQuickCopy) {
        onQuickCopy(isSpanish ? 'Enlace copiado al portapapeles' : 'Record link copied to clipboard');
      }
    });
  };

  if (records.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-xl p-10 text-center text-slate-600 shadow-2xs">
        <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-900">
          {isSpanish ? 'No se encontraron registros de prestamistas' : 'No Mortgagee Records Found'}
        </p>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          {isSpanish
            ? 'Intente buscar con otro término o limpie los filtros activos.'
            : 'Try adjusting your search criteria, clearing active filters, or checking spelling.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col font-sans">
      {/* Table & Grid Header Bar */}
      <div className="text-xs font-medium text-slate-600 mb-3 flex flex-wrap items-center justify-between gap-2.5 px-0.5 select-none">
        <h2 className="flex items-center gap-2 text-[13px] font-semibold text-slate-700 m-0">
          <Search className="w-4 h-4 text-sky-700 shrink-0" />
          <span className="tabular-nums">
            {isSpanish
              ? `Mostrando Directorio de Hipotecas (${records.length.toLocaleString()} cuentas)`
              : `Showing Mortgagee Accounts (${records.length.toLocaleString()} records)`}
          </span>
        </h2>

        {/* Export CSV (Admin Only) & View Mode Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <button
              type="button"
              onClick={() => exportMortgageesCsv(records)}
              className="h-8 px-3 rounded-lg bg-white hover:bg-slate-50 text-sky-700 border border-slate-200/90 hover:border-slate-300 text-xs flex items-center gap-1.5 font-semibold cursor-pointer shadow-2xs transition-all"
              title="Download complete mortgagee directory CSV for offline reference"
            >
              <Download className="w-3.5 h-3.5 text-sky-700" />
              <span className="hidden sm:inline">Export Full Lender Directory (CSV)</span>
              <span className="sm:hidden">Export CSV</span>
            </button>
          )}

          <div className="flex items-center bg-slate-100 border border-slate-200/80 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-pressed={viewMode === 'table'}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              aria-pressed={viewMode === 'cards'}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Cards View"
              aria-label="Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* --- RENDER VIEW 1: CARDS GRID VIEW --- */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {paginatedRecords.map((record) => {
            const id = getRecordId(record);
            const isSelected = id === selectedId;
            const primaryPhone = record.Telephone || record.Telephone2;
            const hasPortal = Boolean(record.Online && record.Online.trim());
            const hasEmail = Boolean(record.email && record.email.trim());
            const isAuto = isAutoOrLossPayee(record);
            const fullAddress = [
              record.Address,
              [record.City, record.State, record.ZIP].filter(Boolean).join(' ')
            ].filter(Boolean).join(', ');

            return (
              <div
                key={id}
                onClick={() => onSelect(id)}
                className={`bg-white border rounded-xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3.5 relative ${
                  isSelected
                    ? 'border-sky-600 ring-2 ring-sky-500/20 bg-sky-50/30'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2.5 mb-1.5">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[14px] text-slate-900 hover:text-sky-700 transition-colors leading-snug">
                        <HighlightedText text={record.Name || 'Unnamed Entity'} query={searchQuery} />
                      </h3>
                      {record.Name2 && (
                        <p className="text-xs text-slate-600 mt-0.5 leading-snug line-clamp-2">
                          <HighlightedText text={record.Name2} query={searchQuery} />
                        </p>
                      )}
                    </div>
                    {/* Clause Badge */}
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase border ${
                        isAuto
                          ? 'bg-amber-50 text-amber-800 border-amber-200/90'
                          : 'bg-sky-50 text-sky-800 border-sky-200/90'
                      }`}
                    >
                      {isAuto ? 'Auto / Loss Payee' : 'Mortgagee / ISAOA'}
                    </span>
                  </div>

                  {/* Address */}
                  {fullAddress ? (
                    <div className="flex items-start gap-1.5 text-xs text-slate-500 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        <HighlightedText text={fullAddress} query={searchQuery} />
                      </span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic mt-2">
                      No mailing address on file
                    </div>
                  )}

                  {/* Phone & FAX with CopyableContact */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <span className="text-[10.5px] text-slate-400 uppercase tracking-wider block font-semibold mb-0.5">
                        Primary Phone
                      </span>
                      <CopyableContact value={primaryPhone} type="phone" />
                    </div>

                    <div>
                      <span className="text-[10.5px] text-slate-400 uppercase tracking-wider block font-semibold mb-0.5">
                        FAX
                      </span>
                      <CopyableContact value={record.FAX} type="fax" />
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons: Online Portal, Email, vCard, Suggest Edit, Quick View, Share */}
                <div
                  className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* 1. Online Portal Button */}
                  {hasPortal ? (
                    <a
                      href={sanitizeUrl(record.Online)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1 px-2.5 rounded-lg bg-sky-50 hover:bg-sky-100/80 text-sky-800 border border-sky-200/90 text-xs flex items-center gap-1 font-semibold cursor-pointer transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-sky-700" />
                      <span>Online Portal</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400 py-1 px-2 border border-slate-200/70 rounded-lg bg-slate-50/70 inline-flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-slate-300" />
                      <span>No Portal</span>
                    </span>
                  )}

                  {/* 2. Email Button */}
                  {hasEmail ? (
                    <button
                      type="button"
                      onClick={() => onEmailDocs && onEmailDocs(record)}
                      className="py-1 px-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-xs flex items-center gap-1 cursor-pointer font-semibold shadow-2xs transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-sky-700" />
                      <span>Email</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 py-1 px-2 border border-slate-200/70 rounded-lg bg-slate-50/70 inline-flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-300" />
                      <span>No Email</span>
                    </span>
                  )}

                  {/* 3. Download vCard */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadVCard(record);
                    }}
                    className="py-1 px-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-xs flex items-center gap-1 font-semibold cursor-pointer transition-colors"
                    title="Download vCard contact file (.vcf)"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>vCard</span>
                  </button>

                  {/* 4. Suggest Edit */}
                  {onSuggestCorrection && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSuggestCorrection(record);
                      }}
                      className="py-1 px-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-xs flex items-center gap-1 font-semibold cursor-pointer transition-colors"
                      title="Suggest edit or report data correction for this lender"
                    >
                      <MessageSquarePlus className="w-3.5 h-3.5 text-slate-500" />
                      <span>Suggest Edit</span>
                    </button>
                  )}

                  {/* 5. Quick View Details */}
                  <button
                    type="button"
                    onClick={() => onSelect(id)}
                    className="py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs flex items-center gap-1 font-semibold cursor-pointer ml-auto transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>Quick View</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleShareRecord(e, record)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors"
                    title="Copy direct share link"
                    aria-label="Copy direct share link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  {isAdmin && (
                    <>
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(record)}
                          className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 cursor-pointer transition-colors"
                          title="Edit Record"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDuplicate && (
                        <button
                          type="button"
                          onClick={() => onDuplicate(record)}
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 cursor-pointer transition-colors"
                          title="Duplicate & Edit Record"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete mortgagee record for ${record.Name}?`)) {
                              onDelete(id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 cursor-pointer transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* --- RENDER VIEW 2: TABLE DATA GRID --- */
        <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px] font-sans">
              <caption className="sr-only">
                Mortgagee Clause Directory and Insurance Tracking Loss Payee Lookup
              </caption>

              <thead>
                <tr className="bg-slate-50/90 select-none border-b border-slate-200/90 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                  <th scope="col" className={`${compactView ? 'px-3.5 py-2.5' : 'px-4 py-3'} w-[44%]`}>
                    {isSpanish ? 'Prestamista / Cláusula y Dirección' : 'Lender / Clause & Address'}
                  </th>
                  <th scope="col" className={`${compactView ? 'px-3 py-2.5' : 'px-3.5 py-3'} w-[26%]`}>
                    {isSpanish ? 'Teléfono Principal y FAX' : 'Primary Phone & FAX'}
                  </th>
                  <th scope="col" className={`${compactView ? 'px-3 py-2.5' : 'px-3.5 py-3'} w-[30%]`}>
                    {isSpanish ? 'Portal en Línea y Correo' : 'Online Portal & Email'}
                  </th>
                </tr>
              </thead>

              <tbody className={`divide-y divide-slate-200/75 ${compactView ? 'text-xs' : 'text-[13px]'}`}>
                {paginatedRecords.map((record) => {
                  const id = getRecordId(record);
                  const isSelected = id === selectedId;

                  const primaryPhone = record.Telephone || record.Telephone2;
                  const hasPortal = Boolean(record.Online && record.Online.trim());
                  const hasEmail = Boolean(record.email && record.email.trim());
                  const isAuto = isAutoOrLossPayee(record);
                  const fullAddress = [
                    record.Address,
                    [record.City, record.State, record.ZIP].filter(Boolean).join(' ')
                  ].filter(Boolean).join(', ');

                  return (
                    <tr
                      key={id}
                      onClick={() => onSelect(id)}
                      className={`cursor-pointer transition-colors group ${
                        isSelected
                          ? 'bg-sky-50/80 shadow-[inset_3px_0_0_0_#0284c7]'
                          : 'bg-white hover:bg-slate-50/90'
                      }`}
                    >
                      {/* Column 1: Contact Name & Address */}
                      <td className={`${compactView ? 'px-3.5 py-2.5' : 'px-4 py-3.5'} align-top`}>
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-slate-900 group-hover:text-sky-700 font-bold text-[13.5px] leading-snug transition-colors">
                              <HighlightedText text={record.Name || 'Unnamed Entity'} query={searchQuery} />
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase border ${
                                isAuto
                                  ? 'bg-amber-50 text-amber-800 border-amber-200/90'
                                  : 'bg-sky-50 text-sky-800 border-sky-200/90'
                              }`}
                            >
                              {isAuto ? 'Auto / Loss Payee' : 'Mortgagee'}
                            </span>
                          </div>

                          {record.Name2 && (
                            <div className="text-xs text-slate-600 truncate max-w-xl lg:max-w-2xl xl:max-w-none mt-0.5">
                              <HighlightedText text={record.Name2} query={searchQuery} />
                            </div>
                          )}

                          {fullAddress ? (
                            <div className="text-xs text-slate-500 truncate max-w-xl lg:max-w-2xl xl:max-w-none mt-0.5">
                              <HighlightedText text={fullAddress} query={searchQuery} />
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-400 italic mt-0.5">
                              No address on file
                            </div>
                          )}

                          {/* Quick Actions toolbar */}
                          <div className="mt-2 flex items-center gap-3 flex-wrap" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => onSelect(id)}
                              className="text-sky-700 hover:text-sky-900 hover:underline text-[11.5px] font-semibold cursor-pointer inline-flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Quick View</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadVCard(record);
                              }}
                              className="text-slate-600 hover:text-slate-900 hover:underline text-[11.5px] font-medium cursor-pointer inline-flex items-center gap-1"
                              title="Download vCard (.vcf) contact file for Outlook"
                            >
                              <Download className="w-3 h-3 text-slate-400" />
                              <span>vCard</span>
                            </button>
                            {onSuggestCorrection && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSuggestCorrection(record);
                                }}
                                className="text-slate-600 hover:text-slate-900 hover:underline text-[11.5px] font-medium cursor-pointer inline-flex items-center gap-1"
                                title="Suggest edit or report correction"
                              >
                                <MessageSquarePlus className="w-3 h-3 text-slate-400" />
                                <span>Suggest Edit</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => handleShareRecord(e, record)}
                              className="text-slate-500 hover:text-slate-900 hover:underline text-[11.5px] font-medium cursor-pointer inline-flex items-center gap-1"
                              title="Copy direct share link"
                            >
                              <Share2 className="w-3 h-3 text-slate-400" />
                              <span>Share</span>
                            </button>
                            {isAdmin && (
                              <>
                                {onEdit && (
                                  <button
                                    type="button"
                                    onClick={() => onEdit(record)}
                                    className="text-amber-700 hover:underline text-[11.5px] font-semibold cursor-pointer inline-flex items-center gap-1"
                                    title="Edit Record"
                                  >
                                    <Edit className="w-3 h-3 text-amber-600" />
                                    <span>Edit</span>
                                  </button>
                                )}
                                {onDuplicate && (
                                  <button
                                    type="button"
                                    onClick={() => onDuplicate(record)}
                                    className="text-emerald-700 hover:underline text-[11.5px] font-semibold cursor-pointer inline-flex items-center gap-1"
                                    title="Duplicate & Edit Record"
                                  >
                                    <Copy className="w-3 h-3 text-emerald-600" />
                                    <span>Duplicate & Edit</span>
                                  </button>
                                )}
                                {onDelete && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm(`Are you sure you want to delete mortgagee record for ${record.Name}?`)) {
                                        onDelete(id);
                                      }
                                    }}
                                    className="text-rose-600 hover:underline text-[11.5px] font-semibold cursor-pointer inline-flex items-center gap-1"
                                    title="Delete Record"
                                  >
                                    <Trash2 className="w-3 h-3 text-rose-600" />
                                    <span>Delete</span>
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Primary Phone & FAX with CopyableContact */}
                      <td className={`${compactView ? 'px-3 py-2.5' : 'px-3.5 py-3.5'} align-top`}>
                        <div className="space-y-1.5 min-w-0 pr-1">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-0.5">
                              Primary Phone
                            </span>
                            <CopyableContact value={primaryPhone} type="phone" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-0.5">
                              FAX
                            </span>
                            <CopyableContact value={record.FAX} type="fax" />
                          </div>
                        </div>
                      </td>

                      {/* Column 3: Online Portal Button First, then Email Button */}
                      <td className={`${compactView ? 'px-3 py-2.5' : 'px-3.5 py-3.5'} align-top`}>
                        <div className="flex flex-wrap items-center gap-2">
                          {/* 1. Online Portal Button First */}
                          {hasPortal ? (
                            <a
                              href={sanitizeUrl(record.Online)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="py-1.5 px-3 rounded-lg bg-sky-50 hover:bg-sky-100/80 text-sky-800 border border-sky-200/90 text-xs inline-flex items-center gap-1.5 font-semibold transition-colors"
                            >
                              <Globe className="w-3.5 h-3.5 text-sky-700" />
                              <span>Online Portal</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 py-1.5 px-2.5 border border-slate-200/70 rounded-lg bg-slate-50/70 inline-flex items-center gap-1.5">
                              <Globe className="w-3.5 h-3.5 text-slate-300" />
                              <span>No Portal</span>
                            </span>
                          )}

                          {/* 2. Email Button Second */}
                          {hasEmail ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onEmailDocs) onEmailDocs(record);
                              }}
                              className="py-1.5 px-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-xs inline-flex items-center gap-1.5 font-semibold cursor-pointer shadow-2xs transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5 text-sky-700" />
                              <span>Email</span>
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 py-1.5 px-2.5 border border-slate-200/70 rounded-lg bg-slate-50/70 inline-flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-slate-300" />
                              <span>No Email</span>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination & Status Footer Bar */}
          <div className="bg-slate-50/80 border-t border-slate-200/90 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <div className="tabular-nums">
                Showing <strong className="text-slate-900 font-semibold">{startIdx.toLocaleString()}</strong>–
                <strong className="text-slate-900 font-semibold">{endIdx.toLocaleString()}</strong> of{' '}
                <strong className="text-slate-900 font-semibold">{records.length.toLocaleString()}</strong> accounts
              </div>

              {/* Page Size Selector */}
              <div className="flex items-center gap-1.5 ml-2 text-xs text-slate-500">
                <label htmlFor="mortgage-page-size" className="hidden md:inline">Per page:</label>
                <select
                  id="mortgage-page-size"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800 font-medium cursor-pointer focus:outline-hidden focus:border-sky-600"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={250}>250</option>
                  <option value={-1}>All ({records.length})</option>
                </select>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5 select-none">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer font-semibold text-xs text-slate-700 transition-colors"
                >
                  « First
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="p-1 bg-white border border-slate-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <span className="px-2 py-0.5 text-xs font-semibold text-slate-800 tabular-nums">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage >= totalPages}
                  className="p-1 bg-white border border-slate-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer transition-colors"
                  title="Next Page"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage(totalPages);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage >= totalPages}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer font-semibold text-xs text-slate-700 transition-colors"
                >
                  Last »
                </button>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-3">
              <button
                type="button"
                className="text-sky-700 hover:text-sky-900 hover:underline cursor-pointer bg-transparent border-0 p-0 font-semibold"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Back to top ↑
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination for Card View */}
      {viewMode === 'cards' && totalPages > 1 && (
        <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 shadow-2xs">
          <div className="tabular-nums">
            Showing <strong className="text-slate-900 font-semibold">{startIdx.toLocaleString()}</strong>–
            <strong className="text-slate-900 font-semibold">{endIdx.toLocaleString()}</strong> of{' '}
            <strong className="text-slate-900 font-semibold">{records.length.toLocaleString()}</strong> accounts
          </div>

          <div className="flex items-center gap-1.5 select-none">
            <button
              type="button"
              onClick={() => {
                setCurrentPage(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer font-semibold text-xs text-slate-700 transition-colors"
            >
              « First
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentPage(prev => Math.max(1, prev - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="p-1 bg-white border border-slate-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 py-0.5 text-xs font-semibold text-slate-800 tabular-nums">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => {
                setCurrentPage(prev => Math.min(totalPages, prev + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage >= totalPages}
              className="p-1 bg-white border border-slate-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentPage(totalPages);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer font-semibold text-xs text-slate-700 transition-colors"
            >
              Last »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
