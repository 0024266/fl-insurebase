import React, { useState } from 'react';
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
  const { viewMode, setViewMode } = usePreferences();

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
      <div className="bg-white border border-[#d5d5d5] rounded-[3px] p-8 text-center text-[#555555] shadow-xs">
        <MapPin className="w-9 h-9 text-[#999999] mx-auto mb-2" />
        <p className="text-[13.5px] font-bold text-[#222222]">
          {isSpanish ? 'No se encontraron registros de Florida' : 'No Florida ZIP / Permit Records Found'}
        </p>
        <p className="text-[12px] text-[#666666] mt-1">
          {isSpanish ? 'Intente ajustar sus criterios de búsqueda.' : 'Try adjusting your search criteria.'}
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
              ? `Jurisdicciones de Florida (${allFilteredCount.toLocaleString()} encontradas)`
              : `Showing Florida Jurisdictions (${allFilteredCount.toLocaleString()} total found)`}
          </span>
        </h2>

        <div className="flex items-center gap-2">
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
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-1.5 py-1 rounded-[2px] transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === 'map'
                  ? 'bg-[#286090] text-white'
                  : 'text-[#666666] hover:text-[#222222]'
              }`}
              title="Interactive Florida Map View"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">Map</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
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
                className={`bg-white border rounded-[3px] p-3.5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'border-[#286090] ring-1 ring-[#286090] bg-[#eaf2fa]'
                    : 'border-[#d5d5d5] hover:border-[#999999]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-normal text-[14px] text-[#286090] hover:underline uppercase leading-tight">
                        {record.City || '—'}, FL
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-mono font-bold text-[12px] text-[#222222] bg-[#f0f0f0] px-1.5 py-0.5 rounded-[2px]">
                          ZIP {zipStr}
                        </span>
                        <span className="text-[11.5px] text-[#666666] uppercase">
                          {record.County} County
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ratings */}
                  <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                    <span className="text-[10px] px-1.5 py-0.5 bg-[#f0f6fc] text-[#286090] font-bold border border-[#c0d0e0] rounded-[2px]">
                      PPC {ratings.ppc || '10'}
                    </span>
                    {ratings.windZone !== null && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#f0f9ff] text-[#0284c7] font-bold rounded-[2px] border border-[#bae6fd]">
                        Zone {ratings.windZone}
                      </span>
                    )}
                    {terrain && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#fdf8e6] text-[#8a6d3b] font-bold rounded-[2px] border border-[#f0e4c3]">
                        Terrain {terrain}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="mt-3 pt-2.5 border-t border-[#f0f0f0] space-y-1.5 text-[12px]" onClick={(e) => e.stopPropagation()}>
                    {record.PAlink && record.PAlink.trim() && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#666666]">Appraiser:</span>
                        <a
                          href={record.PAlink.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="qq-btn-secondary text-[11px] py-0.5 px-2 text-[#286090] font-semibold inline-flex items-center gap-1"
                        >
                          <span>Appraiser Portal</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      </div>
                    )}
                    {record.PermitByCounty && record.PermitByCounty.trim() && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#666666]">County Permit:</span>
                        <a
                          href={record.PermitByCounty.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="qq-btn-secondary text-[11px] py-0.5 px-2 text-[#286090] font-semibold inline-flex items-center gap-1"
                        >
                          <span>County Portal</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      </div>
                    )}
                    {record.PermitByCity && record.PermitByCity.trim() && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#666666]">City Permit:</span>
                        <a
                          href={record.PermitByCity.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="qq-btn-secondary text-[11px] py-0.5 px-2 text-[#286090] font-semibold inline-flex items-center gap-1"
                        >
                          <span>City Portal</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Buttons */}
                <div className="mt-1 pt-2 border-t border-[#e5e5e5] flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onSelect(id)}
                    className="qq-btn-secondary text-[11.5px] py-1 px-2.5 flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#286090]" />
                    <span>View Details</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleShareRecord(e, record)}
                      className="p-1 rounded text-[#666666] hover:text-[#286090] hover:bg-[#f0f0f0] cursor-pointer"
                      title="Copy share link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit(record)}
                          className="p-1 rounded text-amber-700 hover:bg-amber-50 cursor-pointer"
                          title="Edit Record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {onDuplicate && (
                          <button
                            type="button"
                            onClick={() => onDuplicate(record)}
                            className="p-1 rounded text-sky-700 hover:bg-sky-50 cursor-pointer"
                            title="Duplicate & Edit Record"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onDelete(id)}
                          className="p-1 rounded text-rose-700 hover:bg-rose-50 cursor-pointer"
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
        <div className="bg-white border border-[#d5d5d5] rounded-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px] font-sans">
              <caption className="sr-only">
                Florida Property Appraiser and Municipal Building Permit Directory
              </caption>
              <thead>
                <tr className="qq-table-head select-none border-b border-[#d5d5d5]">
                  <th scope="col" className="px-4 py-2.5 w-[42%] text-[#222222] font-bold text-[12.5px]">
                    {isSpanish ? 'Jurisdicción y Terreno' : 'Jurisdiction & Location'}
                  </th>
                  <th scope="col" className="px-3 py-2.5 w-[42%] text-[#222222] font-bold text-[12.5px]">
                    {isSpanish ? 'Tasador y Portales de Permisos' : 'Appraiser & Permit Portals'}
                  </th>
                  <th scope="col" className="px-3 py-2.5 w-[16%] text-[#222222] font-bold text-[12.5px]">
                    {isSpanish ? 'Acciones' : 'Actions'}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e8e8e8] text-[12.5px]">
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
                          ? 'qq-row-selected'
                          : 'qq-row-zebra bg-white'
                      }`}
                    >
                      {/* Column 1: Jurisdiction & Location */}
                      <td className="px-4 py-3 align-top">
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[#286090] group-hover:underline font-normal text-[13.5px] uppercase">
                              {record.City || '—'}, FL
                            </span>
                            <span className="font-mono text-[12px] text-[#222222] bg-[#f0f0f0] px-1.5 py-0.2 rounded-[2px]">
                              {zipStr}
                            </span>
                            <span className="text-[11.5px] text-[#666666] uppercase">
                              {record.County} County
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-1 flex-wrap text-[10.5px]">
                            {terrain && (
                              <span className="px-1.5 py-0.2 rounded-[2px] border bg-[#fdf8e6] text-[#8a6d3b] border-[#f0e4c3] font-semibold">
                                Terrain {terrain}
                              </span>
                            )}
                            <span className="px-1.5 py-0.2 bg-[#f0f6fc] text-[#286090] font-bold border border-[#c0d0e0] rounded-[2px]">
                              PPC {ratings.ppc || '10'}
                            </span>
                            {ratings.windZone !== null && (
                              <span className="px-1.5 py-0.2 bg-[#f0f9ff] text-[#0284c7] font-bold rounded-[2px] border border-[#bae6fd]">
                                Zone {ratings.windZone}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Direct Portals as Clean Buttons */}
                      <td className="px-3 py-3 align-top">
                        <div className="flex flex-wrap items-center gap-2 text-[12px]">
                          {record.PAlink && record.PAlink.trim() ? (
                            <a
                              href={record.PAlink.trim()}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="qq-btn-secondary px-2 py-1 text-[#286090] font-bold inline-flex items-center gap-1 shadow-2xs"
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
                              className="qq-btn-secondary px-2 py-1 text-[#286090] font-bold inline-flex items-center gap-1 shadow-2xs"
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
                              className="qq-btn-secondary px-2 py-1 text-[#286090] font-bold inline-flex items-center gap-1 shadow-2xs"
                            >
                              <span>City Permit</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                            </a>
                          ) : null}
                        </div>
                      </td>

                      {/* Column 3: Quick Actions */}
                      <td className="px-3 py-3 align-top">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => onSelect(id)}
                            className="text-[#286090] hover:underline font-bold text-[12px] cursor-pointer"
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShareRecord(e, record);
                            }}
                            className="p-1 rounded text-[#666666] hover:text-[#286090] hover:bg-[#f0f0f0] cursor-pointer"
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
                                  className="p-1 rounded text-[#286090] hover:bg-[#e8f1f8] cursor-pointer inline-flex items-center gap-0.5 text-[11px] font-semibold border border-[#bce8f1]"
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
                                  className="p-1 rounded text-[#1e7e34] hover:bg-[#e9f7ec] cursor-pointer inline-flex items-center gap-0.5 text-[11px] font-semibold border border-[#c3e6cb]"
                                  title="Duplicate & Edit Jurisdiction"
                                >
                                  <Copy className="w-3 h-3" />
                                  <span>Duplicate & Edit</span>
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
                                  className="p-1 rounded text-[#a94442] hover:bg-[#f2dede] cursor-pointer inline-flex items-center gap-0.5 text-[11px] font-semibold border border-[#ebccd1]"
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
      <div className="bg-[#f8f9fa] border border-[#d5d5d5] rounded-[3px] px-3.5 py-2 mt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#555555] shadow-xs">
        <div>
          Showing <strong className="text-[#222222] font-bold">{startIdx.toLocaleString()}</strong>–
          <strong className="text-[#222222] font-bold">{endIdx.toLocaleString()}</strong> of{' '}
          <strong className="text-[#222222] font-bold">{allFilteredCount.toLocaleString()}</strong> jurisdictions
        </div>

        <div className="flex items-center gap-1 select-none">
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="px-2 py-0.5 bg-white border border-[#b0b0b0] rounded-[2px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f0f0f0] cursor-pointer font-bold text-[11px] text-[#333333]"
          >
            « First
          </button>
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
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
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1 bg-white border border-[#b0b0b0] rounded-[2px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f0f0f0] cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            className="px-2 py-0.5 bg-white border border-[#b0b0b0] rounded-[2px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f0f0f0] cursor-pointer font-bold text-[11px] text-[#333333]"
          >
            Last »
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <label htmlFor="permit-page-size" className="text-[11px] text-[#666666]">
            Rows:
          </label>
          <select
            id="permit-page-size"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-white border border-[#b0b0b0] rounded-[2px] px-1.5 py-0.5 text-[11.5px] font-bold text-[#222222] cursor-pointer"
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
