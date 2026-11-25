import React from 'react';
import {
  ExternalLink,
  Edit2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  Eye,
  Share2,
  Copy,
  Trash2,
  LayoutGrid,
  Table as TableIcon,
  Map as MapIcon
} from 'lucide-react';
import { FloridaZipRecord } from '../types/permits';
import { resolveRatings } from '../data/flRatingData';
import {
  getPermitRecordId,
  formatZipCode
} from '../utils/permitFormatters';
import { useLanguage } from '../context/LanguageContext';
import { usePreferences } from '../context/PreferencesContext';
import { getShareableUrl } from '../utils/urlState';
import { FloridaCountyMap } from './FloridaCountyMap';

interface PermitListProps {
  records: FloridaZipRecord[];
  allFilteredCount: number;
  selectedId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  isAdmin: boolean;
  onEdit: (record: FloridaZipRecord) => void;
  onDuplicate?: (record: FloridaZipRecord) => void;
  onDelete: (id: string) => void;
  onQuickCopy?: (formattedText: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  countyFilter?: string;
  onCountyChange?: (val: string) => void;
}

export function PermitList({
  records,
  allFilteredCount,
  selectedId,
  onSelect,
  searchQuery,
  isAdmin,
  onEdit,
  onDuplicate,
  onDelete,
  onQuickCopy,
  pageSize,
  onPageSizeChange,
  currentPage,
  onPageChange,
  totalPages,
  countyFilter,
  onCountyChange
}: PermitListProps) {
  const { isSpanish } = useLanguage();
  const { viewMode, setViewMode, compactView } = usePreferences();

  const handleShareRecord = (e: React.MouseEvent, record: FloridaZipRecord) => {
    e.stopPropagation();
    const id = getPermitRecordId(record);
    const shareUrl = getShareableUrl({
      tab: 'property',
      id: id,
      view: 'detail',
      q: searchQuery || undefined
    });
    navigator.clipboard.writeText(shareUrl).then(() => {
      if (onQuickCopy) {
        onQuickCopy(isSpanish ? 'Enlace copiado al portapapeles' : 'Jurisdiction link copied to clipboard');
      }
    });
  };

  const startIdx = allFilteredCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, allFilteredCount);

  if (allFilteredCount === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-xl p-10 text-center text-slate-600 shadow-2xs">
        <MapPin className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-900">
          {isSpanish ? 'No se encontraron registros de Florida' : 'No Florida ZIP / Permit Records Found'}
        </p>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          {isSpanish ? 'Intente ajustar sus criterios de búsqueda.' : 'Try adjusting your search criteria.'}
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
              ? `Jurisdicciones de Florida (${allFilteredCount.toLocaleString()} encontradas)`
              : `Showing Florida Jurisdictions (${allFilteredCount.toLocaleString()} total found)`}
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
            <button
              type="button"
              onClick={() => setViewMode('map')}
              aria-pressed={viewMode === 'map'}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'map'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Interactive Florida Map View"
              aria-label="Interactive Florida Map View"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- MAP VIEW: INTERACTIVE FLORIDA MAP --- */}
      {viewMode === 'map' && (
        <div className="mb-4">
          <FloridaCountyMap
            selectedCounty={countyFilter || 'ALL'}
            onSelectCounty={(c) => {
              if (onCountyChange) onCountyChange(c);
            }}
          />
        </div>
      )}

      {/* --- VIEW 1: CARDS VIEW --- */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {records.map((record) => {
            const id = getPermitRecordId(record);
            const isSelected = id === selectedId;
            const zipStr = formatZipCode(record.zip);
            const terrain = (record.Terrain || '').trim().toUpperCase();
            const ratings = resolveRatings(record.County, record.City);

            return (
              <div
                key={id}
                onClick={() => onSelect(id)}
                className={`bg-white border rounded-xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3.5 ${
                  isSelected
                    ? 'border-sky-600 ring-2 ring-sky-500/20 bg-sky-50/30'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-[14px] text-slate-900 hover:text-sky-700 transition-colors uppercase leading-snug">
                        {record.City || '—'}, FL
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono font-semibold text-xs text-slate-800 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md tabular-nums">
                          ZIP {zipStr}
                        </span>
                        <span className="text-xs text-slate-500 font-medium uppercase">
                          {record.County} County
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ratings */}
                  <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                    <span className="text-[10.5px] px-2 py-0.5 bg-sky-50 text-sky-800 font-semibold border border-sky-200/90 rounded-md">
                      PPC {ratings.ppc || '10'}
                    </span>
                    {ratings.windZone !== null && (
                      <span className="text-[10.5px] px-2 py-0.5 bg-indigo-50 text-indigo-800 font-semibold rounded-md border border-indigo-200/90">
                        Zone {ratings.windZone}
                      </span>
                    )}
                    {terrain && (
                      <span className="text-[10.5px] px-2 py-0.5 bg-amber-50 text-amber-800 font-semibold rounded-md border border-amber-200/90">
                        Terrain {terrain}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2 text-xs" onClick={(e) => e.stopPropagation()}>
                    {record.PAlink && record.PAlink.trim() && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500 font-medium">Appraiser:</span>
                        <a
                          href={record.PAlink.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1 px-2.5 rounded-lg bg-sky-50 hover:bg-sky-100/80 text-sky-800 border border-sky-200/90 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Appraiser Portal</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      </div>
                    )}
                    {record.PermitByCounty && record.PermitByCounty.trim() && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500 font-medium">County Permit:</span>
                        <a
                          href={record.PermitByCounty.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1 px-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-xs font-semibold inline-flex items-center gap-1 shadow-2xs transition-colors"
                        >
                          <span>County Portal</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      </div>
                    )}
                    {record.PermitByCity && record.PermitByCity.trim() && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500 font-medium">City Permit:</span>
                        <a
                          href={record.PermitByCity.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1 px-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-xs font-semibold inline-flex items-center gap-1 shadow-2xs transition-colors"
                        >
                          <span>City Portal</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Buttons */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onSelect(id)}
                    className="py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs flex items-center gap-1 font-semibold cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>View Details</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleShareRecord(e, record)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors"
                      title="Copy share link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit(record)}
                          className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 cursor-pointer transition-colors"
                          title="Edit Record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
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
                        <button
                          type="button"
                          onClick={() => onDelete(id)}
                          className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 cursor-pointer transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* --- VIEW 2: TABLE DATA GRID --- */
        <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px] font-sans">
              <caption className="sr-only">
                Florida Property Appraiser and Municipal Building Permit Directory
              </caption>
              <thead>
                <tr className="bg-slate-50/90 select-none border-b border-slate-200/90 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                  <th scope="col" className={`${compactView ? 'px-3.5 py-2.5' : 'px-4 py-3'} w-[42%]`}>
                    {isSpanish ? 'Jurisdicción y Terreno' : 'Jurisdiction & Location'}
                  </th>
                  <th scope="col" className={`${compactView ? 'px-3 py-2.5' : 'px-3.5 py-3'} w-[42%]`}>
                    {isSpanish ? 'Tasador y Portales de Permisos' : 'Appraiser & Permit Portals'}
                  </th>
                  <th scope="col" className={`${compactView ? 'px-3 py-2.5' : 'px-3.5 py-3'} w-[16%]`}>
                    {isSpanish ? 'Acciones' : 'Actions'}
                  </th>
                </tr>
              </thead>

              <tbody className={`divide-y divide-slate-200/75 ${compactView ? 'text-xs' : 'text-[13px]'}`}>
                {records.map((record) => {
                  const id = getPermitRecordId(record);
                  const isSelected = id === selectedId;
                  const zipStr = formatZipCode(record.zip);
                  const terrain = (record.Terrain || '').trim().toUpperCase();
                  const ratings = resolveRatings(record.County, record.City);

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
                      {/* Column 1: Jurisdiction & Location */}
                      <td className={`${compactView ? 'px-3.5 py-2.5' : 'px-4 py-3.5'} align-top`}>
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-slate-900 group-hover:text-sky-700 font-bold text-[13.5px] uppercase transition-colors">
                              {record.City || '—'}, FL
                            </span>
                            <span className="font-mono font-semibold text-xs text-slate-800 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md tabular-nums">
                              {zipStr}
                            </span>
                            <span className="text-xs text-slate-500 font-medium uppercase">
                              {record.County} County
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap text-[10.5px]">
                            {terrain && (
                              <span className="px-2 py-0.5 rounded-md border bg-amber-50 text-amber-800 border-amber-200/90 font-semibold">
                                Terrain {terrain}
                              </span>
                            )}
                            <span className="px-2 py-0.5 bg-sky-50 text-sky-800 font-semibold border border-sky-200/90 rounded-md">
                              PPC {ratings.ppc || '10'}
                            </span>
                            {ratings.windZone !== null && (
                              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 font-semibold rounded-md border border-indigo-200/90">
                                Zone {ratings.windZone}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Direct Portals as Clean Buttons */}
                      <td className={`${compactView ? 'px-3 py-2.5' : 'px-3.5 py-3.5'} align-top`}>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {record.PAlink && record.PAlink.trim() ? (
                            <a
                              href={record.PAlink.trim()}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="py-1.5 px-3 rounded-lg bg-sky-50 hover:bg-sky-100/80 text-sky-800 border border-sky-200/90 font-semibold inline-flex items-center gap-1.5 transition-colors"
                            >
                              <span>Appraiser</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                            </a>
                          ) : null}

                          {record.PermitByCounty && record.PermitByCounty.trim() ? (
                            <a
                              href={record.PermitByCounty.trim()}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="py-1.5 px-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
                            >
                              <span>County Permit</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                            </a>
                          ) : null}

                          {record.PermitByCity && record.PermitByCity.trim() ? (
                            <a
                              href={record.PermitByCity.trim()}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="py-1.5 px-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
                            >
                              <span>City Permit</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                            </a>
                          ) : null}
                        </div>
                      </td>

                      {/* Column 3: Quick Actions */}
                      <td className={`${compactView ? 'px-3 py-2.5' : 'px-3.5 py-3.5'} align-top`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => onSelect(id)}
                            className="text-sky-700 hover:text-sky-900 hover:underline font-semibold text-xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShareRecord(e, record);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors"
                            title="Share"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          {isAdmin && (
                            <>
                              {onEdit && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(record);
                                  }}
                                  className="text-amber-700 hover:underline text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
                                  title="Edit Jurisdiction"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                              )}
                              {onDuplicate && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDuplicate(record);
                                  }}
                                  className="text-emerald-700 hover:underline text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
                                  title="Duplicate & Edit Jurisdiction"
                                >
                                  <Copy className="w-3 h-3" />
                                  <span>Duplicate</span>
                                </button>
                              )}
                              {onDelete && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Are you sure you want to delete jurisdiction record ${record.City || record.zip}?`)) {
                                      onDelete(id);
                                    }
                                  }}
                                  className="text-rose-600 hover:underline text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </>
                          )}
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

      {/* Pagination Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 shadow-2xs">
        <div className="tabular-nums">
          Showing <strong className="text-slate-900 font-semibold">{startIdx.toLocaleString()}</strong>–
          <strong className="text-slate-900 font-semibold">{endIdx.toLocaleString()}</strong> of{' '}
          <strong className="text-slate-900 font-semibold">{allFilteredCount.toLocaleString()}</strong> jurisdictions
        </div>

        <div className="flex items-center gap-1.5 select-none">
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer font-semibold text-xs text-slate-700 transition-colors"
          >
            « First
          </button>
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
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
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1 bg-white border border-slate-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer font-semibold text-xs text-slate-700 transition-colors"
          >
            Last »
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <label htmlFor="permit-page-size" className="text-xs text-slate-500">
            Rows:
          </label>
          <select
            id="permit-page-size"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs font-medium text-slate-800 cursor-pointer focus:outline-hidden focus:border-sky-600"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>
      </div>
    </div>
  );
}
