import React, { useState } from 'react';
import {
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Building,
  Landmark,
  Wind,
  Navigation,
  Globe,
  Edit2,
  Trash2,
  ArrowLeft,
  Shield,
  Flame,
  Gauge,
  ClipboardList,
  Clock,
  Link as LinkIcon,
  MessageSquarePlus
} from 'lucide-react';
import { FloridaZipRecord } from '../types/permits';
import { resolveRatings } from '../data/flRatingData';
import {
  getPermitRecordId,
  formatZipCode,
  formatPermitLinksForCopy,
  formatLastEditedDateTime
} from '../utils/permitFormatters';
import { useLanguage } from '../context/LanguageContext';
import { JurisdictionMap } from './JurisdictionMap';

interface PermitDetailProps {
  record: FloridaZipRecord | null;
  isAdmin: boolean;
  onEdit: (record: FloridaZipRecord) => void;
  onDuplicate?: (record: FloridaZipRecord) => void;
  onDelete: (id: string) => void;
  onOpenBulkUpdate?: (scope: 'city' | 'county', city?: string, county?: string) => void;
  onSuggestCorrection?: (record: FloridaZipRecord) => void;
  onBack?: () => void;
  onToast: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
}

export function PermitDetail({
  record,
  isAdmin,
  onEdit,
  onDuplicate,
  onDelete,
  onOpenBulkUpdate,
  onSuggestCorrection,
  onBack,
  onToast
}: PermitDetailProps) {
  const { t, isSpanish } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [copiedRating, setCopiedRating] = useState(false);
  const [copiedField, setCopiedField] = useState<'pa' | 'county' | 'city' | null>(null);

  if (!record) {
    return (
      <div className="bg-white border border-[#d0d0d0] rounded-[3px] p-8 text-center text-[#555] shadow-xs">
        <MapPin className="w-10 h-10 text-[#bbb] mx-auto mb-2" />
        <p className="text-[13.5px] font-bold text-[#333]">
          {isSpanish ? 'Ninguna Jurisdicción Seleccionada' : 'No Jurisdiction Selected'}
        </p>
        <p className="text-[11.5px] text-[#777] mt-0.5">
          {isSpanish
            ? 'Seleccione un código postal de la tabla para ver tasadores y oficinas de permisos.'
            : 'Select a ZIP code from the table to view Property Appraiser & Permit portals.'}
        </p>
      </div>
    );
  }

  const id = getPermitRecordId(record);
  const zipStr = formatZipCode(record.zip);
  const city = (record.City || '').trim().toUpperCase();
  const county = (record.County || '').trim().toUpperCase();
  const state = (record.State || 'FL').trim().toUpperCase();
  const terrain = (record.Terrain || '').toUpperCase();
  const isTerrainC = terrain === 'C';

  // Dynamically resolve ISO PPC, EC Wind Zones, BCEGS, and CSP
  const ratings = resolveRatings(county, city);

  const hasCoords = typeof record.lat === 'number' && typeof record.long === 'number';
  const mapsUrl = hasCoords
    ? `https://www.google.com/maps?q=${record.lat},${record.long}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${zipStr} ${city} ${state}`)}`;

  const handleCopySingleLink = (url: string, field: 'pa' | 'county' | 'city', label: string) => {
    if (!url || !url.trim()) return;
    const cleanUrl = url.trim();
    navigator.clipboard.writeText(cleanUrl).then(() => {
      setCopiedField(field);
      onToast(`${label} Copied`, cleanUrl, 'success');
      setTimeout(() => setCopiedField((curr) => (curr === field ? null : curr)), 2000);
    });
  };

  const handleCopyRatingsSlip = () => {
    const slip = [
      `UNDERWRITING RATING PROFILE - ${zipStr}`,
      `Jurisdiction: ${city}, ${county} County, ${state}`,
      `ISO Public Protection Class (PPC): ${ratings.ppc || '10'}`,
      `Commercial Wind Zone (EC Zone): ${ratings.windZone !== null ? `Zone ${ratings.windZone}` : 'N/A'} (Terrain ${terrain || 'B'})`,
      ratings.bcegs
        ? `BCEGS: Personal ${ratings.bcegs.personal} / Commercial ${ratings.bcegs.commercial} (Evaluation Year: ${ratings.bcegs.year})`
        : `BCEGS: N/A`,
      ratings.csp ? `CSP County Code: ${ratings.csp}` : ''
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(slip).then(() => {
      setCopiedRating(true);
      onToast('Rating Profile Copied', `Underwriting ratings for ZIP ${zipStr} copied`, 'success');
      setTimeout(() => setCopiedRating(false), 2200);
    });
  };

  const handleCopyAll = () => {
    const text = formatPermitLinksForCopy(record);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      onToast('Jurisdiction Links Copied', `Links for ZIP ${zipStr} copied to clipboard`, 'success');
      setTimeout(() => setCopied(false), 2200);
    });
  };

  return (
    <div className="space-y-4 text-[#222]">
      {/* 1. Header Toolbar */}
      <div className="bg-[#f8fafd] border border-[#cbd5e1] rounded-[4px] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-[4px] bg-[#e8f4fd] border border-[#bde0fe] text-[#286090] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <MapPin className="w-5 h-5 text-[#286090]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[16px] sm:text-[17px] font-bold text-[#286090] leading-snug truncate">
              {zipStr} — {city}, {county} CO.
            </h2>
            <div className="text-[12px] text-[#4a5568] font-semibold mt-0.5 uppercase tracking-wider font-mono">
              Florida Ratings, Appraiser &amp; Permits
            </div>
          </div>
        </div>

        {/* Header Quick Actions */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {record.LastUpdated && (
            <div className="flex items-center gap-1.5 bg-white border border-[#cbd5e1] rounded-[3px] px-2.5 py-1 text-[11.5px] text-[#555] shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#286090]" />
              <span>
                Last Updated: <strong className="font-mono text-[#222]">{formatLastEditedDateTime(record.LastUpdated)}</strong>
              </span>
            </div>
          )}

          {onSuggestCorrection && (
            <button
              type="button"
              onClick={() => onSuggestCorrection(record)}
              className="qq-btn-secondary py-1 px-2.5 text-[11.5px] flex items-center gap-1 font-semibold cursor-pointer"
              title="Suggest a correction or update for this jurisdiction (Email to admin)"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-[#286090]" />
              <span className="hidden sm:inline">Suggest Correction</span>
            </button>
          )}

          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => onEdit(record)}
                className="qq-btn-secondary py-1 px-2.5 text-[11px] flex items-center gap-1 cursor-pointer"
                title="Edit Record"
              >
                <Edit2 className="w-3 h-3 text-[#1f4e79]" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              {onDuplicate && (
                <button
                  type="button"
                  onClick={() => onDuplicate(record)}
                  className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 py-1 px-2.5 text-[11px] flex items-center gap-1 cursor-pointer rounded-[3px] font-semibold"
                  title="Duplicate & Edit this jurisdiction record"
                >
                  <Copy className="w-3 h-3 text-emerald-700" />
                  <span className="hidden sm:inline">Duplicate & Edit</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onDelete(id)}
                className="bg-white hover:bg-rose-50 border border-rose-300 text-rose-700 py-1 px-2 text-[11px] flex items-center gap-1 cursor-pointer rounded-[3px] font-semibold"
                title="Delete Record"
              >
                <Trash2 className="w-3 h-3 text-rose-600" />
                <span className="hidden sm:inline">Delete</span>
              </button>
              {onOpenBulkUpdate && (
                <button
                  type="button"
                  onClick={() => onOpenBulkUpdate('city', city, county)}
                  className="bg-amber-100 hover:bg-amber-200 border border-amber-400 text-amber-950 py-1 px-2 text-[11px] flex items-center gap-1 cursor-pointer font-bold rounded-[3px] shadow-2xs"
                  title={`Bulk update links for all records in ${city} or ${county} County`}
                >
                  <LinkIcon className="w-3 h-3 text-amber-800" />
                  <span className="hidden sm:inline">Bulk Links</span>
                </button>
              )}
            </>
          )}

          <button
            type="button"
            onClick={handleCopyAll}
            className={`py-1 px-3 text-[11.5px] flex items-center gap-1.5 font-bold cursor-pointer transition-colors ${
              copied
                ? 'bg-emerald-600 text-white border border-emerald-700 rounded-[3px]'
                : 'qq-btn-green'
            }`}
            title="Copy portal URLs and rating information"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All Links</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Detail Body */}
      <div className="p-3.5 space-y-3.5 text-[12px] bg-[#fafafa]">
        {/* Top Summary Card: Location & Wind Terrain & Last Edited */}
        <div className="bg-white border border-[#d8d8d8] rounded-[2px] p-3 shadow-2xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5">
            <div>
              <div className="text-[10.5px] font-bold uppercase text-[#777]">ZIP Code</div>
              <div className="text-[16px] font-bold text-[#004b91] font-mono">{zipStr}</div>
            </div>

            <div>
              <div className="text-[10.5px] font-bold uppercase text-[#777]">Municipality</div>
              <div className="text-[13px] font-bold text-[#222]">{city}, {state}</div>
            </div>

            <div>
              <div className="text-[10.5px] font-bold uppercase text-[#777]">County</div>
              <div className="text-[13px] font-bold text-[#222]">{county}</div>
            </div>

            <div>
              <div className="text-[10.5px] font-bold uppercase text-[#777]">Wind Exposure</div>
              <div className="mt-0.5">
                {terrain ? (
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-[2px] border ${
                      isTerrainC
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-neutral-100 text-neutral-800 border-neutral-300'
                    }`}
                  >
                    <Wind className="w-3 h-3" />
                    <span>Terrain {terrain}</span>
                    {isTerrainC && <span className="text-[9.5px]">(High Wind / Coastal)</span>}
                  </span>
                ) : (
                  <span className="text-[#888]">—</span>
                )}
              </div>
            </div>

            {/* Last Edited Date & Time */}
            <div>
              <div className="text-[10.5px] font-bold uppercase text-[#777] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#004b91]" />
                <span>Last Edited</span>
              </div>
              <div className="mt-0.5">
                <span className="text-[12px] font-semibold text-[#111] block">
                  {formatLastEditedDateTime(record.LastUpdated)}
                </span>
                {record.LastUpdated && (
                  <span className="text-[10px] text-[#666] font-mono">
                    {record.LastUpdated}
                  </span>
                )}
              </div>
            </div>

            {hasCoords && (
              <div>
                <div className="text-[10.5px] font-bold uppercase text-[#777]">Coordinates</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[11px] text-[#555]">
                    {record.lat?.toFixed(4)}, {record.long?.toFixed(4)}
                  </span>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#004b91] hover:underline text-[11px] font-semibold"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>View Map ↗</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Underwriting & Rating Classifications Card (ISO PPC, Wind Zone, BCEGS, CSP) */}
        <div className="bg-white border border-[#b8d4f1] rounded-[2px] p-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#e4effa]">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#004b91]" />
              <h3 className="font-bold text-[#003870] text-[12.5px] uppercase tracking-wider">
                Underwriting & Rating Profile
              </h3>
            </div>

            <button
              type="button"
              onClick={handleCopyRatingsSlip}
              className="text-[#004b91] hover:text-[#003870] text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              title="Copy Underwriting Rating Slip"
            >
              {copiedRating ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied Profile</span>
                </>
              ) : (
                <>
                  <ClipboardList className="w-3 h-3" />
                  <span>Copy Ratings Slip</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {/* 3.1 ISO PPC */}
            <div className="bg-[#f5f9ff] border border-[#d3e4f7] rounded-[2px] p-2.5 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase text-[#555] flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-600" />
                  <span>ISO PPC Class</span>
                </div>
                <div className="text-[16px] font-bold text-[#004b91] font-mono mt-0.5">
                  {ratings.ppc || '10'}
                </div>
              </div>
              <div className="text-[10px] text-[#666] mt-1">
                {ratings.ppc === '10'
                  ? 'Unprotected / Default Class 10'
                  : 'Public Protection Fire Classification'}
              </div>
            </div>

            {/* 3.2 Commercial Wind Zone (EC Zone) */}
            <div className="bg-[#f5f9ff] border border-[#d3e4f7] rounded-[2px] p-2.5 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase text-[#555] flex items-center gap-1">
                  <Wind className="w-3 h-3 text-sky-600" />
                  <span>Commercial Wind Zone</span>
                </div>
                <div className="text-[15px] font-bold text-[#004b91] mt-0.5 flex items-center gap-1.5">
                  {ratings.windZone !== null ? (
                    <span className="inline-flex items-center px-1.5 py-0.2 bg-[#004b91] text-white rounded text-[11.5px] font-mono font-bold">
                      Zone {ratings.windZone}
                    </span>
                  ) : (
                    <span className="text-[#888] font-mono">N/A</span>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-[#666] mt-1">
                {ratings.windZone === 1 && 'High Velocity Hurricane Zone'}
                {ratings.windZone === 2 && 'Coastal High Hazard Exposure'}
                {ratings.windZone === 3 && 'Inland Transition Wind Risk'}
                {ratings.windZone === 4 && 'Standard Inland Florida Zone'}
                {ratings.windZone === 5 && 'Lower Keys Hurricane Zone'}
                {ratings.windZone === 6 && 'Extreme Coastal / Key West'}
                {ratings.windZone === null && 'EC Wind Classification'}
              </div>
            </div>

            {/* 3.3 BCEGS Grade */}
            <div className="bg-[#f5f9ff] border border-[#d3e4f7] rounded-[2px] p-2.5 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase text-[#555] flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-emerald-600" />
                  <span>BCEGS Grading</span>
                </div>
                <div className="text-[13px] font-bold text-[#1e293b] mt-0.5">
                  {ratings.bcegs ? (
                    <span className="font-mono">
                      P: <span className="text-[#004b91] font-bold">{ratings.bcegs.personal}</span> / C:{' '}
                      <span className="text-[#004b91] font-bold">{ratings.bcegs.commercial}</span>
                    </span>
                  ) : (
                    <span className="text-[#888]">N/A</span>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-[#666] mt-1">
                {ratings.bcegs
                  ? `Effective: ${ratings.bcegs.year} ${
                      ratings.bcegs.personal === '98' ? '(Excluded)' : ''
                    }`
                  : 'Building Code Effectiveness Schedule'}
              </div>
            </div>

            {/* 3.4 CSP County Code */}
            <div className="bg-[#f5f9ff] border border-[#d3e4f7] rounded-[2px] p-2.5 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase text-[#555] flex items-center gap-1">
                  <Building className="w-3 h-3 text-neutral-600" />
                  <span>CSP County Code</span>
                </div>
                <div className="text-[13.5px] font-bold text-[#004b91] font-mono mt-0.5">
                  {ratings.csp || '—'}
                </div>
              </div>
              <div className="text-[10px] text-[#666] mt-1">
                Commercial Statistical Plan
              </div>
            </div>
          </div>
        </div>

        {/* 4. Official Portal Action Buttons (Large Direct Launch) */}
        <div className="space-y-2.5">
          <div className="text-[11.5px] font-bold text-[#444] uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#004b91]" />
            <span>Direct Official Portals</span>
          </div>

          {/* Property Appraiser Portal Button */}
          <div className="bg-white border border-[#c8d8ec] rounded-[2px] p-2.5 flex items-center justify-between gap-3 shadow-2xs hover:border-[#a0c0e8] transition-colors">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="p-2 bg-[#eaf3ff] border border-[#c8dcf5] rounded text-[#004b91] shrink-0 mt-0.5">
                <Landmark className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-[#111] text-[12.5px]">
                  Property Appraiser (PA) Portal
                </div>
                <div className="text-[11px] text-[#666] truncate mt-0.5">
                  {record.PAlink || '—'}
                </div>
              </div>
            </div>

            {record.PAlink && record.PAlink.trim() ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    handleCopySingleLink(
                      record.PAlink!,
                      'pa',
                      `${county} Property Appraiser Link`
                    )
                  }
                  className="app-btn bg-white hover:bg-neutral-100 text-[#333] border border-[#ccc] py-1.5 px-2.5 text-[11px] flex items-center gap-1 cursor-pointer"
                  title="Copy Property Appraiser URL"
                >
                  {copiedField === 'pa' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#555]" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
                <a
                  href={record.PAlink.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-btn bg-[#004b91] hover:bg-[#003b73] text-white border border-[#003366] py-1.5 px-3 text-[11.5px] flex items-center gap-1 font-bold"
                >
                  <span>Open Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <span className="text-[#888] font-mono text-[11px] shrink-0">—</span>
            )}
          </div>

          {/* County Building Permit Portal Button */}
          <div className="bg-white border border-[#c8d8ec] rounded-[2px] p-2.5 flex items-center justify-between gap-3 shadow-2xs hover:border-[#a0c0e8] transition-colors">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="p-2 bg-[#eaf3ff] border border-[#c8dcf5] rounded text-[#004b91] shrink-0 mt-0.5">
                <Building className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-[#111] text-[12.5px]">
                  {county} County Building Permits
                </div>
                <div className="text-[11px] text-[#666] truncate mt-0.5">
                  {record.PermitByCounty || '—'}
                </div>
              </div>
            </div>

            {record.PermitByCounty && record.PermitByCounty.trim() ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    handleCopySingleLink(
                      record.PermitByCounty!,
                      'county',
                      `${county} County Permits Link`
                    )
                  }
                  className="app-btn bg-white hover:bg-neutral-100 text-[#333] border border-[#ccc] py-1.5 px-2.5 text-[11px] flex items-center gap-1 cursor-pointer"
                  title="Copy County Permit URL"
                >
                  {copiedField === 'county' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#555]" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
                <a
                  href={record.PermitByCounty.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-btn bg-white hover:bg-neutral-100 text-[#004b91] border border-[#ccc] py-1.5 px-3 text-[11.5px] flex items-center gap-1 font-semibold"
                >
                  <span>Open Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <span className="text-[#888] font-mono text-[11px] shrink-0">—</span>
            )}
          </div>

          {/* City / Municipal Building Permit Portal Button */}
          <div className="bg-white border border-[#d8d8d8] rounded-[2px] p-2.5 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="p-2 bg-[#f4f4f4] border border-[#ddd] rounded text-[#555] shrink-0 mt-0.5">
                <Building className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-[#111] text-[12.5px]">
                  {city} Municipal Permits
                </div>
                <div className="text-[11px] text-[#666] truncate mt-0.5">
                  {record.PermitByCity
                    ? record.PermitByCity
                    : `— (Serviced directly by ${county} County)`}
                </div>
              </div>
            </div>

            {record.PermitByCity && record.PermitByCity.trim() ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    handleCopySingleLink(
                      record.PermitByCity!,
                      'city',
                      `${city} Municipal Permits Link`
                    )
                  }
                  className="app-btn bg-white hover:bg-neutral-100 text-[#333] border border-[#ccc] py-1.5 px-2.5 text-[11px] flex items-center gap-1 cursor-pointer"
                  title="Copy City Permit URL"
                >
                  {copiedField === 'city' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#555]" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
                <a
                  href={record.PermitByCity.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-btn bg-white hover:bg-neutral-100 text-[#004b91] border border-[#ccc] py-1.5 px-3 text-[11.5px] flex items-center gap-1 font-semibold"
                >
                  <span>Open Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <span className="text-[#777] text-[11px] bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 shrink-0">
                — (County Serviced)
              </span>
            )}
          </div>
        </div>

        {/* 5. Geographic & Municipal Map (At the very bottom to avoid disturbing page scrolling) */}
        <div className="pt-2">
          <div className="text-[11.5px] font-bold text-[#444] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#004b91]" />
            <span>Geographic &amp; Municipal Map</span>
          </div>
          <JurisdictionMap record={record} />
        </div>
      </div>
    </div>
  );
}
