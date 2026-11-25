import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  ExternalLink,
  Globe,
  Phone,
  Mail,
  Edit2,
  Copy,
  Trash2,
  Share2,
  KeyRound,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Building2,
  Search,
  Eye,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';
import { CarrierRecord } from '../types/carrier';
import {
  normalizeCarrierUrl,
  formatTelHref,
  formatMailtoHref,
  parseCarrierNotesLines
} from '../utils/carrierFormatters';
import { HighlightedText } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';
import { usePreferences } from '../context/PreferencesContext';
import { getShareableUrl } from '../utils/urlState';
import {
  CarrierCard,
  renderCcFeeBadge,
  renderLobBadges
} from './CarrierCard';

interface CarrierListProps {
  records: CarrierRecord[];
  selectedId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  isAdmin?: boolean;
  onEdit?: (record: CarrierRecord) => void;
  onDuplicate?: (record: CarrierRecord) => void;
  onDelete?: (id: string) => void;
  onToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export function CarrierList({
  records,
  selectedId,
  onSelect,
  searchQuery,
  isAdmin = false,
  onEdit,
  onDuplicate,
  onDelete,
  onToast
}: CarrierListProps) {
  const { isSpanish, language } = useLanguage();
  const { viewMode, setViewMode, compactView } = usePreferences();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, records.length]);

  const totalPages =
    pageSize === -1 ? 1 : Math.max(1, Math.ceil(records.length / pageSize));

  const paginatedRecords =
    pageSize === -1
      ? records
      : records.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const startIdx = records.length === 0 ? 0 : (currentPage - 1) * (pageSize === -1 ? records.length : pageSize) + 1;
  const endIdx =
    pageSize === -1
      ? records.length
      : Math.min(currentPage * pageSize, records.length);

  const handleQuickCopy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    onToast(`Copied ${label}`, value, 'success');
  };

  const handleShareRecord = (e: React.MouseEvent, record: CarrierRecord) => {
    e.stopPropagation();
    const shareUrl = getShareableUrl({
      tab: 'carriers',
      id: record.id,
      view: 'detail',
      lang: language
    });
    navigator.clipboard.writeText(shareUrl);
    onToast(
      isSpanish ? 'Enlace de Aseguradora Copiado' : 'Carrier Link Copied',
      `${record.Carrier} direct link copied to clipboard.`,
      'success'
    );
  };

  if (records.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-xl p-10 text-center text-slate-600 shadow-2xs">
        <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-900">
          {isSpanish
            ? 'No se encontraron aseguradoras con estos filtros'
            : 'No Matching Carrier Shortcuts Found'}
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          {isSpanish
            ? 'Intente buscar por otro nombre, línea de negocio o desactive los filtros activos.'
            : 'Try searching a different carrier name, alias, phone number, or clearing active LOB filters.'}
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
              ? `Mostrando Accesos de Aseguradoras (${records.length.toLocaleString()} registros)`
              : `Showing Carrier Shortcuts (${records.length.toLocaleString()} carriers)`}
          </span>
        </h2>

        <div className="flex flex-wrap items-center gap-2">
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

      {/* Cards View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {paginatedRecords.map((record) => (
            <CarrierCard
              key={record.id}
              record={record}
              isSelected={record.id === selectedId}
              searchQuery={searchQuery}
              isAdmin={isAdmin}
              onSelect={onSelect}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              onQuickCopy={handleQuickCopy}
            />
          ))}
        </div>
      ) : (
        /* Table View (with responsive horizontal scroll container) */
        <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[860px] font-sans">
              <caption className="sr-only">
                Carrier Shortcuts Directory — Payments, Agent Portals, Claims & Customer Service
              </caption>
              <thead>
                <tr className="bg-slate-50/90 select-none border-b border-slate-200/90 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                  <th
                    scope="col"
                    className={`${compactView ? 'px-3.5 py-2.5' : 'px-4 py-3'} w-[36%]`}
                  >
                    {isSpanish
                      ? 'Aseguradora / Líneas y Notas'
                      : 'Carrier / Lines of Business & Notes'}
                  </th>
                  <th
                    scope="col"
                    className={`${compactView ? 'px-3 py-2.5' : 'px-3.5 py-3'} w-[30%]`}
                  >
                    {isSpanish
                      ? 'Servicio al Cliente, Reclamos y Agentes'
                      : 'Customer Service, Claims & Agent Support'}
                  </th>
                  <th
                    scope="col"
                    className={`${compactView ? 'px-3 py-2.5' : 'px-3.5 py-3'} w-[34%]`}
                  >
                    {isSpanish
                      ? 'Pagos Directos, Portal y Cargo de Tarjeta'
                      : 'Direct Payment, Portals & CC Fee'}
                  </th>
                </tr>
              </thead>

              <tbody className={`divide-y divide-slate-200/75 ${compactView ? 'text-xs' : 'text-[13px]'}`}>
                {paginatedRecords.map((record) => {
                  const isSelected = record.id === selectedId;
                  const paymentUrl = normalizeCarrierUrl(record.Payments);
                  const agentPortalUrl = normalizeCarrierUrl(record.AgentPortalLogin);
                  const publicWebUrl = normalizeCarrierUrl(record.PublicWebsite);
                  const noteLines = parseCarrierNotesLines(record.Notes);

                  const csTel = formatTelHref(record.CustomerServicePhone);
                  const claimsTel = formatTelHref(record.ClaimsPhone);
                  const agentTel = formatTelHref(record.ForAgents);
                  const csMail = formatMailtoHref(record.CustomerServiceEmail);
                  const claimsMail = formatMailtoHref(record.ClaimsEmail);

                  return (
                    <tr
                      key={record.id}
                      onClick={() => onSelect(record.id)}
                      className={`cursor-pointer transition-colors group ${
                        isSelected
                          ? 'bg-sky-50/80 shadow-[inset_3px_0_0_0_#0284c7]'
                          : 'bg-white hover:bg-slate-50/90'
                      }`}
                    >
                      {/* Column 1: Carrier Name, Aliases, LOB Badges, Notes, Quick Actions */}
                      <td className={`${compactView ? 'px-3.5 py-2.5' : 'px-4 py-3.5'} align-top`}>
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-slate-900 group-hover:text-sky-700 font-bold text-[14px] leading-snug transition-colors">
                              <HighlightedText
                                text={record.Carrier}
                                query={searchQuery}
                              />
                            </span>
                          </div>

                          {record.OtherNames &&
                            record.OtherNames !== record.Carrier && (
                              <div className="text-xs text-slate-500 mt-0.5">
                                <HighlightedText
                                  text={record.OtherNames}
                                  query={searchQuery}
                                />
                              </div>
                            )}

                          <div className="mt-1.5">{renderLobBadges(record)}</div>

                          {noteLines.length > 0 && (
                            <div className="mt-2 text-xs text-slate-600 bg-amber-50/60 border-l-2 border-amber-400 pl-2.5 py-1 space-y-0.5 max-w-xl rounded-r-md">
                              {noteLines.slice(0, 2).map((line, idx) => (
                                <div key={idx} className="leading-snug truncate">
                                  <HighlightedText
                                    text={line}
                                    query={searchQuery}
                                  />
                                </div>
                              ))}
                              {noteLines.length > 2 && (
                                <div className="text-[10.5px] text-sky-700 font-semibold">
                                  +{noteLines.length - 2} more note line(s)
                                </div>
                              )}
                            </div>
                          )}

                          {/* Row Action Links */}
                          <div
                            className="mt-2 flex items-center gap-3 flex-wrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => onSelect(record.id)}
                              className="text-sky-700 hover:text-sky-900 hover:underline text-[11.5px] font-semibold cursor-pointer inline-flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Quick View</span>
                            </button>
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
                                    title="Edit Carrier"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                    <span>Edit</span>
                                  </button>
                                )}
                                {onDuplicate && (
                                  <button
                                    type="button"
                                    onClick={() => onDuplicate(record)}
                                    className="text-emerald-700 hover:underline text-[11.5px] font-semibold cursor-pointer inline-flex items-center gap-1"
                                    title="Duplicate & Edit Carrier"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>Duplicate & Edit</span>
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
                                    className="text-rose-600 hover:underline text-[11.5px] font-semibold cursor-pointer inline-flex items-center gap-1"
                                    title="Delete Carrier"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Customer Service, Claims & Agent Phone/Email */}
                      <td
                        className={`${compactView ? 'px-3 py-2.5' : 'px-3.5 py-3.5'} align-top`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="space-y-1.5 text-xs">
                          {/* Customer Service */}
                          <div>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                              Customer Service
                            </span>
                            {record.CustomerServicePhone ? (
                              <div className="flex items-center gap-1.5">
                                {csTel ? (
                                  <a
                                    href={csTel}
                                    className="text-slate-800 hover:text-sky-700 hover:underline font-mono font-semibold inline-flex items-center gap-1"
                                  >
                                    <Phone className="w-3 h-3 text-sky-700" />
                                    <HighlightedText
                                      text={record.CustomerServicePhone}
                                      query={searchQuery}
                                    />
                                  </a>
                                ) : (
                                  <span className="text-slate-800 font-mono font-semibold">
                                    {record.CustomerServicePhone}
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQuickCopy(
                                      'Service Phone',
                                      record.CustomerServicePhone
                                    )
                                  }
                                  className="p-0.5 text-slate-400 hover:text-sky-700 cursor-pointer transition-colors"
                                  title="Copy Customer Service Phone"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                            {record.CustomerServiceEmail && (
                              <div className="flex items-center gap-1 mt-0.5">
                                {csMail ? (
                                  <a
                                    href={csMail}
                                    className="text-sky-700 hover:underline text-[11.5px] inline-flex items-center gap-1 truncate max-w-[230px]"
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
                                  <span className="text-[11.5px] text-slate-600">
                                    {record.CustomerServiceEmail}
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQuickCopy(
                                      'Service Email',
                                      record.CustomerServiceEmail
                                    )
                                  }
                                  className="p-0.5 text-slate-400 hover:text-sky-700 cursor-pointer transition-colors"
                                  title="Copy Customer Service Email"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Claims Support */}
                          {record.ClaimsPhone || record.ClaimsEmail ? (
                            <div className="pt-1.5 border-t border-slate-100">
                              <span className="text-[10px] font-semibold text-rose-700 uppercase tracking-wider block mb-0.5">
                                Claims Support
                              </span>
                              {record.ClaimsPhone && (
                                <div className="flex items-center gap-1.5">
                                  {claimsTel ? (
                                    <a
                                      href={claimsTel}
                                      className="text-slate-800 hover:text-sky-700 hover:underline font-mono font-semibold inline-flex items-center gap-1"
                                    >
                                      <AlertCircle className="w-3 h-3 text-rose-600" />
                                      <HighlightedText
                                        text={record.ClaimsPhone}
                                        query={searchQuery}
                                      />
                                    </a>
                                  ) : (
                                    <span className="font-mono">{record.ClaimsPhone}</span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleQuickCopy(
                                        'Claims Phone',
                                        record.ClaimsPhone
                                      )
                                    }
                                    className="p-0.5 text-slate-400 hover:text-sky-700 cursor-pointer transition-colors"
                                    title="Copy Claims Phone"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                              {record.ClaimsEmail && claimsMail && (
                                <div className="flex items-center gap-1 mt-0.5">
                                  <a
                                    href={claimsMail}
                                    className="text-sky-700 hover:underline text-[11px] inline-flex items-center gap-1 truncate max-w-[230px]"
                                  >
                                    <Mail className="w-2.5 h-2.5 shrink-0" />
                                    <span className="truncate">
                                      <HighlightedText
                                        text={record.ClaimsEmail}
                                        query={searchQuery}
                                      />
                                    </span>
                                  </a>
                                </div>
                              )}
                            </div>
                          ) : null}

                          {/* Agent Dedicated Line */}
                          {record.ForAgents &&
                            record.ForAgents !== record.CustomerServicePhone && (
                              <div className="pt-1.5 border-t border-slate-100">
                                <span className="text-[10.5px] font-medium text-slate-500 block">
                                  Agent Line:{' '}
                                  {agentTel ? (
                                    <a
                                      href={agentTel}
                                      className="text-sky-700 font-mono font-semibold hover:underline"
                                    >
                                      {record.ForAgents}
                                    </a>
                                  ) : (
                                    <span className="text-slate-800 font-mono font-semibold">
                                      {record.ForAgents}
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}
                        </div>
                      </td>

                      {/* Column 3: Desk-Priority Payment, Agent Portal, Website & CC Fee Badge */}
                      <td
                        className={`${compactView ? 'px-3 py-2.5' : 'px-3.5 py-3.5'} align-top`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col gap-2">
                          {/* Primary & Secondary Action Buttons */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {paymentUrl ? (
                              <a
                                href={paymentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white border border-sky-700/80 text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
                                title={`Make Insured Payment for ${record.Carrier}`}
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Make Payment</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-85" />
                              </a>
                            ) : (
                              <span className="text-xs text-slate-400 py-1.5 px-2.5 border border-slate-200/70 rounded-lg bg-slate-50/70">
                                No Payment Link
                              </span>
                            )}

                            {agentPortalUrl ? (
                              <a
                                href={agentPortalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-1.5 px-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
                                title={`Agent Portal Login for ${record.Carrier}`}
                              >
                                <KeyRound className="w-3 h-3 text-sky-700" />
                                <span>Agent Portal</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                              </a>
                            ) : null}

                            {publicWebUrl ? (
                              <a
                                href={publicWebUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-1.5 px-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/90 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                                title={`Public Website: ${publicWebUrl}`}
                              >
                                <Globe className="w-3 h-3 text-slate-500" />
                                <span>Website</span>
                              </a>
                            ) : null}
                          </div>

                          {/* Credit Card Fee Badge + Copy Payment Link */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {renderCcFeeBadge(record.CC_Fee)}
                            {paymentUrl && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuickCopy('Payment URL', paymentUrl)
                                }
                                className="text-[11px] text-sky-700 hover:text-sky-900 hover:underline inline-flex items-center gap-1 cursor-pointer font-semibold"
                                title="Copy Payment Link for Insured"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copy Pay Link</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination & Status Footer Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 shadow-2xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="tabular-nums">
            Showing{' '}
            <strong className="text-slate-900 font-semibold">{startIdx}</strong>–
            <strong className="text-slate-900 font-semibold">{endIdx}</strong> of{' '}
            <strong className="text-slate-900 font-semibold">
              {records.length}
            </strong>{' '}
            carrier shortcuts
          </div>

          <div className="flex items-center gap-1.5 ml-2 text-xs text-slate-500">
            <label htmlFor="carrier-page-size" className="hidden md:inline">
              Per page:
            </label>
            <select
              id="carrier-page-size"
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
                setCurrentPage((prev) => Math.max(1, prev - 1));
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
                setCurrentPage((prev) => Math.min(totalPages, prev + 1));
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
      </div>
    </div>
  );
}
