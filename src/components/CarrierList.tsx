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
  Building2
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
  const { viewMode } = usePreferences();
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
      <div className="bg-white border border-[#d5d5d5] rounded-[3px] p-10 text-center shadow-2xs">
        <Building2 className="w-10 h-10 text-[#999999] mx-auto mb-2" />
        <h3 className="text-[15px] font-bold text-[#333333]">
          {isSpanish
            ? 'No se encontraron aseguradoras con estos filtros'
            : 'No matching insurance carriers found'}
        </h3>
        <p className="text-[12.5px] text-[#666666] mt-1">
          {isSpanish
            ? 'Intente buscar por otro nombre, línea de negocio o desactive los filtros activos.'
            : 'Try searching a different carrier name, alias, phone number, or clearing active LOB filters.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Mobile always renders cards; Desktop respects viewMode ('cards' vs 'table') */}
      <div className={viewMode === 'cards' ? 'block' : 'block md:hidden'}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
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
      </div>

      {/* Desktop Table View when viewMode === 'table' */}
      {viewMode === 'table' && (
        <div className="hidden md:block bg-white border border-[#d5d5d5] rounded-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px] font-sans">
              <caption className="sr-only">
                Insurance Carriers Directory — Payments, Agent Portals, Claims & Customer Service
              </caption>
              <thead>
                <tr className="qq-table-head select-none border-b border-[#d5d5d5]">
                  <th
                    scope="col"
                    className="px-4 py-2.5 w-[36%] text-[#222222] font-bold text-[12.5px]"
                  >
                    {isSpanish
                      ? 'Aseguradora / Líneas y Notas'
                      : 'Carrier / Lines of Business & Notes'}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 w-[30%] text-[#222222] font-bold text-[12.5px]"
                  >
                    {isSpanish
                      ? 'Servicio al Cliente, Reclamos y Agentes'
                      : 'Customer Service, Claims & Agent Support'}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 w-[34%] text-[#222222] font-bold text-[12.5px]"
                  >
                    {isSpanish
                      ? 'Pagos Directos, Portal y Cargo de Tarjeta'
                      : 'Direct Payment, Portals & CC Fee'}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e8e8e8] text-[12.5px]">
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
                        isSelected ? 'qq-row-selected' : 'qq-row-zebra bg-white'
                      }`}
                    >
                      {/* Column 1: Carrier Name, Aliases, LOB Badges, Notes, Quick Actions */}
                      <td className="px-4 py-3 align-top">
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[#286090] group-hover:underline font-bold text-[14px] leading-snug">
                              <HighlightedText
                                text={record.Carrier}
                                query={searchQuery}
                              />
                            </span>
                          </div>

                          {record.OtherNames &&
                            record.OtherNames !== record.Carrier && (
                              <div className="text-[11.5px] text-[#555555] mt-0.5">
                                <HighlightedText
                                  text={record.OtherNames}
                                  query={searchQuery}
                                />
                              </div>
                            )}

                          <div className="mt-1.5">{renderLobBadges(record)}</div>

                          {noteLines.length > 0 && (
                            <div className="mt-2 text-[11.5px] text-[#444444] bg-amber-50/60 border-l-2 border-amber-400 pl-2 py-1 space-y-0.5 max-w-xl">
                              {noteLines.slice(0, 2).map((line, idx) => (
                                <div key={idx} className="leading-snug truncate">
                                  <HighlightedText
                                    text={line}
                                    query={searchQuery}
                                  />
                                </div>
                              ))}
                              {noteLines.length > 2 && (
                                <div className="text-[10.5px] text-[#286090] font-semibold">
                                  +{noteLines.length - 2} more note line(s)
                                </div>
                              )}
                            </div>
                          )}

                          {/* Row Action Links */}
                          <div
                            className="mt-2 flex items-center gap-2.5 flex-wrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => onSelect(record.id)}
                              className="text-[#286090] hover:underline text-[11.5px] font-bold cursor-pointer"
                            >
                              Quick View
                            </button>
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
                                    className="text-[#1e7e34] hover:underline text-[11px] font-bold cursor-pointer inline-flex items-center gap-0.5"
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
                                    className="text-rose-600 hover:underline text-[11px] font-bold cursor-pointer inline-flex items-center gap-0.5"
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
                        className="px-3 py-3 align-top"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="space-y-1.5 text-[12px]">
                          {/* Customer Service */}
                          <div>
                            <span className="text-[10.5px] font-bold text-[#666666] uppercase tracking-wider block">
                              Customer Service
                            </span>
                            {record.CustomerServicePhone ? (
                              <div className="flex items-center gap-1.5">
                                {csTel ? (
                                  <a
                                    href={csTel}
                                    className="text-[#222222] hover:text-[#286090] hover:underline font-bold inline-flex items-center gap-1"
                                  >
                                    <Phone className="w-3 h-3 text-[#286090]" />
                                    <HighlightedText
                                      text={record.CustomerServicePhone}
                                      query={searchQuery}
                                    />
                                  </a>
                                ) : (
                                  <span className="text-[#222222] font-bold">
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
                                  className="p-0.5 text-[#777] hover:text-[#286090] cursor-pointer"
                                  title="Copy Customer Service Phone"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[#999999]">—</span>
                            )}
                            {record.CustomerServiceEmail && (
                              <div className="flex items-center gap-1 mt-0.5">
                                {csMail ? (
                                  <a
                                    href={csMail}
                                    className="text-[#286090] hover:underline text-[11.5px] inline-flex items-center gap-1 truncate max-w-[230px]"
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
                                  <span className="text-[11.5px] text-[#444]">
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
                                  className="p-0.5 text-[#777] hover:text-[#286090] cursor-pointer"
                                  title="Copy Customer Service Email"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Claims Support */}
                          {record.ClaimsPhone || record.ClaimsEmail ? (
                            <div className="pt-1 border-t border-[#f0f0f0]">
                              <span className="text-[10.5px] font-bold text-rose-800 uppercase tracking-wider block">
                                Claims Support
                              </span>
                              {record.ClaimsPhone && (
                                <div className="flex items-center gap-1.5">
                                  {claimsTel ? (
                                    <a
                                      href={claimsTel}
                                      className="text-[#222222] hover:text-[#286090] hover:underline font-semibold inline-flex items-center gap-1"
                                    >
                                      <AlertCircle className="w-3 h-3 text-rose-600" />
                                      <HighlightedText
                                        text={record.ClaimsPhone}
                                        query={searchQuery}
                                      />
                                    </a>
                                  ) : (
                                    <span>{record.ClaimsPhone}</span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleQuickCopy(
                                        'Claims Phone',
                                        record.ClaimsPhone
                                      )
                                    }
                                    className="p-0.5 text-[#777] hover:text-[#286090] cursor-pointer"
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
                                    className="text-[#286090] hover:underline text-[11px] inline-flex items-center gap-1 truncate max-w-[230px]"
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
                              <div className="pt-1 border-t border-[#f0f0f0]">
                                <span className="text-[10.5px] font-semibold text-[#666666] block">
                                  Agent Line:{' '}
                                  {agentTel ? (
                                    <a
                                      href={agentTel}
                                      className="text-[#286090] font-bold hover:underline"
                                    >
                                      {record.ForAgents}
                                    </a>
                                  ) : (
                                    <span className="text-[#222222] font-bold">
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
                        className="px-3 py-3 align-top"
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
                                className="qq-btn-green py-1 px-2.5 text-[11.5px] font-bold inline-flex items-center gap-1 shadow-2xs"
                                title={`Make Insured Payment for ${record.Carrier}`}
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Make Payment</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-85" />
                              </a>
                            ) : (
                              <span className="text-[11px] text-[#999999] py-1 px-2 border border-[#e5e5e5] rounded-[2px] bg-[#fafafa]">
                                No Payment Link
                              </span>
                            )}

                            {agentPortalUrl ? (
                              <a
                                href={agentPortalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="qq-btn-secondary py-1 px-2.5 text-[11.5px] font-bold text-[#286090] inline-flex items-center gap-1 shadow-2xs"
                                title={`Agent Portal Login for ${record.Carrier}`}
                              >
                                <KeyRound className="w-3 h-3 text-[#286090]" />
                                <span>Agent Portal</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                              </a>
                            ) : null}

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
                                className="text-[11px] text-[#286090] hover:underline inline-flex items-center gap-1 cursor-pointer font-semibold"
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
      <div className="bg-white border border-[#d5d5d5] rounded-[3px] px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11.5px] text-[#555555] shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div>
            Showing{' '}
            <strong className="text-[#222222] font-bold">{startIdx}</strong> to{' '}
            <strong className="text-[#222222] font-bold">{endIdx}</strong> of{' '}
            <strong className="text-[#222222] font-bold">
              {records.length}
            </strong>{' '}
            carriers
          </div>

          <div className="flex items-center gap-1 ml-2 text-[11px] text-[#666]">
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
              className="bg-white border border-[#b0b0b0] rounded-[2px] px-1 py-0.5 text-[11px] text-[#333] cursor-pointer"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
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
                setCurrentPage((prev) => Math.max(1, prev - 1));
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
                setCurrentPage((prev) => Math.min(totalPages, prev + 1));
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
      </div>
    </div>
  );
}
