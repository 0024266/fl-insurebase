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
  cleanPhoneUri,
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
      <div className="bg-white border border-[#d5d5d5] rounded-[3px] p-8 text-center text-[#555555] shadow-xs">
        <Building2 className="w-10 h-10 text-[#999999] mx-auto mb-2.5" />
        <p className="text-[14px] font-bold text-[#222222]">
          {isSpanish ? 'No se encontraron registros de prestamistas' : 'No Mortgagee Records Found'}
        </p>
        <p className="text-[12px] text-[#666666] mt-1 max-w-md mx-auto">
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
      <div className="text-[13px] font-normal text-[#555555] mb-2 flex items-center justify-between px-0.5 select-none">
        <h2 className="flex items-center gap-1.5 text-[13.5px] font-normal text-[#555555] m-0">
          <Search className="w-4 h-4 text-[#777777]" />
          <span>
            {isSpanish
              ? `Mostrando Directorio de Hipotecas (${records.length.toLocaleString()} cuentas)`
              : `Showing Mortgagee Accounts (${records.length.toLocaleString()} records)`}
          </span>
        </h2>

        {/* Export CSV & View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportMortgageesCsv(records)}
            className="qq-btn-secondary text-[11.5px] py-1 px-2.5 flex items-center gap-1 font-bold text-[#0066c0] border-[#0066c0]/30 hover:bg-[#0066c0]/10 cursor-pointer shadow-2xs"
            title="Download complete mortgagee directory CSV for offline reference"
          >
            <Download className="w-3.5 h-3.5 text-[#0066c0]" />
            <span className="hidden sm:inline">Export Full Lender Directory (CSV)</span>
            <span className="sm:hidden">Export CSV</span>
          </button>

          <div className="flex items-center bg-white border border-[#b0b0b0] rounded-[2px] p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1 rounded-[2px] transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#286090] text-white'
                  : 'text-[#666666] hover:text-[#222222]'
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1 rounded-[2px] transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[#286090] text-white'
                  : 'text-[#666666] hover:text-[#222222]'
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
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
                className={`bg-white border rounded-[3px] p-3.5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 relative ${
                  isSelected
                    ? 'border-[#286090] ring-1 ring-[#286090] bg-[#eaf2fa]'
                    : 'border-[#d5d5d5] hover:border-[#999999]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-normal text-[14px] text-[#286090] hover:underline leading-tight">
                        <HighlightedText text={record.Name || 'Unnamed Entity'} query={searchQuery} />
                      </h3>
                      {record.Name2 && (
                        <p className="text-[12px] text-[#444444] mt-0.5 leading-snug">
                          <HighlightedText text={record.Name2} query={searchQuery} />
                        </p>
                      )}
                    </div>
                    {/* Clause Badge */}
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-[2px] text-[10px] font-bold tracking-wide uppercase border ${
                        isAuto
                          ? 'bg-[#fff8e6] text-[#b45309] border-[#fde68a]'
                          : 'bg-[#edf4ff] text-[#0052cc] border-[#b0d0ff]'
                      }`}
                    >
                      {isAuto ? 'Auto / Loss Payee' : 'Mortgagee / ISAOA'}
                    </span>
                  </div>

                  {/* Address */}
                  {fullAddress && (
                    <div className="flex items-center gap-1.5 text-[12px] text-[#666666] mt-2">
                      <MapPin className="w-3.5 h-3.5 text-[#888888] shrink-0" />
                      <span className="truncate">
                        <HighlightedText text={fullAddress} query={searchQuery} />
                      </span>
                    </div>
                  )}

                  {/* Phone & FAX with CopyableContact */}
                  <div className="mt-2.5 pt-2 border-t border-[#f0f0f0] grid grid-cols-2 gap-2 text-[12px]">
                    <div>
                      <span className="text-[10.5px] text-[#777777] block font-semibold mb-0.5">Primary Phone</span>
                      <CopyableContact value={primaryPhone} type="phone" />
                    </div>

                    <div>
                      <span className="text-[10.5px] text-[#777777] block font-semibold mb-0.5">FAX</span>
                      <CopyableContact value={record.FAX} type="fax" />
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons: Online Portal first, then Email, vCard, Suggest Edit, View */}
                <div
                  className="mt-1 pt-2 border-t border-[#e5e5e5] flex flex-wrap items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* 1. Online Portal Button First */}
                  {hasPortal ? (
                    <a
                      href={sanitizeUrl(record.Online)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="qq-btn-secondary text-[11.5px] py-1 px-2.5 flex items-center gap-1 text-[#286090] font-bold cursor-pointer shadow-2xs"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#286090]" />
                      <span>Online Portal</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-[#aaa] py-1 px-2 border border-[#e5e5e5] rounded-[2px] bg-[#fcfcfc] inline-flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-[#ccc]" />
                      <span>No Portal</span>
                    </span>
                  )}

                  {/* 2. Email Button Second */}
                  {hasEmail ? (
                    <button
                      type="button"
                      onClick={() => onEmailDocs && onEmailDocs(record)}
                      className="qq-btn-secondary text-[11.5px] py-1 px-2.5 flex items-center gap-1 cursor-pointer font-bold text-[#286090] shadow-2xs"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#286090]" />
                      <span>Email</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-[#aaa] py-1 px-2 border border-[#e5e5e5] rounded-[2px] bg-[#fcfcfc] inline-flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#ccc]" />
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
                    className="qq-btn-secondary text-[11.5px] py-1 px-2 flex items-center gap-1 font-bold text-[#0066c0] cursor-pointer"
                    title="Download vCard contact file (.vcf)"
                  >
                    <Download className="w-3.5 h-3.5 text-[#0066c0]" />
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
                      className="qq-btn-secondary text-[11.5px] py-1 px-2 flex items-center gap-1 font-bold text-[#286090] cursor-pointer"
                      title="Suggest edit or report data correction for this lender"
                    >
                      <MessageSquarePlus className="w-3.5 h-3.5 text-[#286090]" />
                      <span>Suggest Edit</span>
                    </button>
                  )}

                  {/* 5. View Details */}
                  <button
                    type="button"
                    onClick={() => onSelect(id)}
                    className="qq-btn-secondary text-[11.5px] py-1 px-2 flex items-center gap-1 font-bold cursor-pointer ml-auto"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#286090]" />
                    <span>View</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleShareRecord(e, record)}
                    className="p-1 rounded text-[#666666] hover:text-[#286090] hover:bg-[#f0f0f0] cursor-pointer"
                    title="Copy direct share link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  {isAdmin && (
                    <>
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(record)}
                          className="p-1 rounded text-amber-700 hover:bg-amber-50 cursor-pointer"
                          title="Edit Record"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDuplicate && (
                        <button
                          type="button"
                          onClick={() => onDuplicate(record)}
                          className="p-1 rounded text-emerald-700 hover:bg-emerald-50 cursor-pointer"
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
                          className="p-1 rounded text-rose-700 hover:bg-rose-50 cursor-pointer"
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
        <div className="bg-white border border-[#d5d5d5] rounded-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px] font-sans">
              <caption className="sr-only">
                Mortgagee Clause Directory and Insurance Tracking Loss Payee Lookup
              </caption>

              <thead>
                <tr className="qq-table-head select-none border-b border-[#d5d5d5]">
                  <th scope="col" className={`${compactView ? 'px-3 py-1.5' : 'px-4 py-2.5'} w-[42%] text-[#222222] font-bold text-[12.5px]`}>
                    {isSpanish ? 'Contacto / Dirección' : 'Contact / Address'}
                  </th>
                  <th scope="col" className={`${compactView ? 'px-2.5 py-1.5' : 'px-3 py-2.5'} w-[28%] text-[#222222] font-bold text-[12.5px]`}>
                    {isSpanish ? 'Teléfono Principal & FAX' : 'Primary Phone & FAX'}
                  </th>
                  <th scope="col" className={`${compactView ? 'px-2.5 py-1.5' : 'px-3 py-2.5'} w-[30%] text-[#222222] font-bold text-[12.5px]`}>
                    {isSpanish ? 'Portal en Línea & Correo' : 'Online Portal & Email'}
                  </th>
                </tr>
              </thead>

              <tbody className={`divide-y divide-[#e8e8e8] ${compactView ? 'text-[12px]' : 'text-[12.5px]'}`}>
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
                          ? 'qq-row-selected'
                          : 'qq-row-zebra bg-white'
                      }`}
                    >
                      {/* Column 1: Contact Name & Address */}
                      <td className={`${compactView ? 'px-3 py-1.5' : 'px-4 py-3'} align-top`}>
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[#286090] group-hover:underline font-normal text-[13.5px] leading-snug">
                              <HighlightedText text={record.Name || 'Unnamed Entity'} query={searchQuery} />
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded-[2px] text-[9.5px] font-bold tracking-wide uppercase border ${
                                isAuto
                                  ? 'bg-[#fff8e6] text-[#b45309] border-[#fde68a]'
                                  : 'bg-[#edf4ff] text-[#0052cc] border-[#b0d0ff]'
                              }`}
                            >
                              {isAuto ? 'Auto / Loss Payee' : 'Mortgagee'}
                            </span>
                          </div>

                          {record.Name2 && (
                            <div className="text-[12px] text-[#444444] truncate max-w-sm mt-0.5">
                              <HighlightedText text={record.Name2} query={searchQuery} />
                            </div>
                          )}

                          {fullAddress ? (
                            <div className="text-[12px] text-[#666666] truncate max-w-sm mt-0.5">
                              <HighlightedText text={fullAddress} query={searchQuery} />
                            </div>
                          ) : (
                            <div className="text-[11px] text-[#999999] italic mt-0.5">
                              No address on file
                            </div>
                          )}

                          {/* Quick Actions toolbar */}
                          <div className="mt-1 flex items-center gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => onSelect(id)}
                              className="text-[#286090] hover:underline text-[11.5px] font-bold cursor-pointer"
                            >
                              Quick View
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadVCard(record);
                              }}
                              className="text-[#0066c0] hover:underline text-[11px] font-bold cursor-pointer inline-flex items-center gap-0.5"
                              title="Download vCard (.vcf) contact file for Outlook"
                            >
                              <Download className="w-3 h-3 text-[#0066c0]" />
                              <span>vCard</span>
                            </button>
                            {onSuggestCorrection && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSuggestCorrection(record);
                                }}
                                className="text-[#286090] hover:underline text-[11px] font-bold cursor-pointer inline-flex items-center gap-0.5"
                                title="Suggest edit or report correction"
                              >
                                <MessageSquarePlus className="w-3 h-3 text-[#286090]" />
                                <span>Suggest Edit</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => handleShareRecord(e, record)}
                              className="text-[#666666] hover:text-[#286090] text-[11px] cursor-pointer inline-flex items-center gap-0.5"
                              title="Copy direct share link"
                            >
                              <Share2 className="w-3 h-3" />
                              <span>Share</span>
                            </button>
                            {isAdmin && (
                              <>
                                {onEdit && (
                                  <button
                                    type="button"
                                    onClick={() => onEdit(record)}
                                    className="text-[#286090] hover:underline text-[11px] font-bold cursor-pointer inline-flex items-center gap-0.5"
                                    title="Edit Record"
                                  >
                                    <Edit className="w-3 h-3 text-[#286090]" />
                                    <span>Edit</span>
                                  </button>
                                )}
                                {onDuplicate && (
                                  <button
                                    type="button"
                                    onClick={() => onDuplicate(record)}
                                    className="text-[#1e7e34] hover:underline text-[11px] font-bold cursor-pointer inline-flex items-center gap-0.5"
                                    title="Duplicate & Edit Record"
                                  >
                                    <Copy className="w-3 h-3 text-[#1e7e34]" />
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
                                    className="text-rose-600 hover:underline text-[11px] font-bold cursor-pointer inline-flex items-center gap-0.5"
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
                      <td className={`${compactView ? 'px-2.5 py-1.5' : 'px-3 py-3'} align-top`}>
                        <div className="space-y-1 min-w-0 pr-1">
                          <div>
                            <span className="text-[10px] text-[#777777] block font-semibold mb-0.5">Primary Phone</span>
                            <CopyableContact value={primaryPhone} type="phone" />
                          </div>
                          <div className="pt-0.5">
                            <span className="text-[10px] text-[#777777] block font-semibold mb-0.5">FAX</span>
                            <CopyableContact value={record.FAX} type="fax" />
                          </div>
                        </div>
                      </td>

                      {/* Column 3: Online Portal Button First, then Email Button */}
                      <td className={`${compactView ? 'px-2.5 py-1.5' : 'px-3 py-3'} align-top`}>
                        <div className="flex flex-wrap items-center gap-2">
                          {/* 1. Online Portal Button First */}
                          {hasPortal ? (
                            <a
                              href={sanitizeUrl(record.Online)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="qq-btn-secondary text-[11.5px] py-1 px-2.5 inline-flex items-center gap-1 text-[#286090] font-bold shadow-2xs"
                            >
                              <Globe className="w-3.5 h-3.5 text-[#286090]" />
                              <span>Online Portal</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-[#aaa] py-1 px-2 border border-[#e5e5e5] rounded-[2px] bg-[#fafafa] inline-flex items-center gap-1">
                              <Globe className="w-3.5 h-3.5 text-[#ccc]" />
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
                              className="qq-btn-secondary text-[11.5px] py-1 px-2.5 inline-flex items-center gap-1 text-[#286090] font-bold cursor-pointer shadow-2xs"
                            >
                              <Mail className="w-3.5 h-3.5 text-[#286090]" />
                              <span>Email</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-[#aaa] py-1 px-2 border border-[#e5e5e5] rounded-[2px] bg-[#fafafa] inline-flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5 text-[#ccc]" />
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
          <div className="bg-[#f8f9fa] border border-[#d5d5d5] rounded-[3px] px-3.5 py-2 mt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#555555] shadow-xs">
            <div className="flex items-center gap-2">
              <div>
                Showing <strong className="text-[#222222] font-bold">{startIdx.toLocaleString()}</strong>–
                <strong className="text-[#222222] font-bold">{endIdx.toLocaleString()}</strong> of{' '}
                <strong className="text-[#222222] font-bold">{records.length.toLocaleString()}</strong> accounts
              </div>

              {/* Page Size Selector */}
              <div className="flex items-center gap-1 ml-2 text-[11px] text-[#666]">
                <label htmlFor="mortgage-page-size" className="hidden md:inline">Per page:</label>
                <select
                  id="mortgage-page-size"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-[#b0b0b0] rounded-[2px] px-1 py-0.5 text-[11px] text-[#333] cursor-pointer"
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
              <div className="flex items-center gap-1 select-none">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="px-2 py-0.5 bg-white border border-[#b0b0b0] rounded-[2px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f0f0f0] cursor-pointer font-bold text-[11px] text-[#333333]"
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
                  className="p-1 bg-white border border-[#b0b0b0] rounded-[2px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f0f0f0] cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <span className="px-2 py-0.5 text-[11.5px] font-bold text-[#222222]">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage >= totalPages}
                  className="p-1 bg-white border border-[#b0b0b0] rounded-[2px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f0f0f0] cursor-pointer"
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
                  className="px-2 py-0.5 bg-white border border-[#b0b0b0] rounded-[2px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f0f0f0] cursor-pointer font-bold text-[11px] text-[#333333]"
                >
                  Last »
                </button>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-3">
              <button
                type="button"
                className="text-[#286090] hover:underline cursor-pointer bg-transparent border-0 p-0 font-bold"
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
        <div className="bg-[#f8f9fa] border border-[#d5d5d5] rounded-[3px] px-3.5 py-2 mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#555555] shadow-xs">
          <div>
            Showing <strong className="text-[#222222] font-bold">{startIdx.toLocaleString()}</strong>–
            <strong className="text-[#222222] font-bold">{endIdx.toLocaleString()}</strong> of{' '}
            <strong className="text-[#222222] font-bold">{records.length.toLocaleString()}</strong> accounts
          </div>

          <div className="flex items-center gap-1 select-none">
            <button
              type="button"
              onClick={() => {
                setCurrentPage(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="px-2 py-0.5 bg-white border border-[#b0b0b0] rounded-[2px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f0f0f0] cursor-pointer font-bold text-[11px] text-[#333333]"
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
              className="p-1 bg-white border border-[#b0b0b0] rounded-[2px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f0f0f0] cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 py-0.5 text-[11.5px] font-bold text-[#222222]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => {
                setCurrentPage(prev => Math.min(totalPages, prev + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage >= totalPages}
              className="p-1 bg-white border border-[#b0b0b0] rounded-[2px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f0f0f0] cursor-pointer"
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
              className="px-2 py-0.5 bg-white border border-[#b0b0b0] rounded-[2px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f0f0f0] cursor-pointer font-bold text-[11px] text-[#333333]"
            >
              Last »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
