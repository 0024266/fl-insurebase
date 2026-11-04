import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Link,
  Globe,
  Building,
  Landmark,
  MapPin,
  Check,
  AlertCircle,
  ExternalLink,
  Filter,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  FloridaZipRecord,
  BulkScopeMode,
  BulkUpdateLinksOptions
} from '../types/permits';
import { formatZipCode, getPermitRecordId } from '../utils/permitFormatters';
import { validatePermitUrl } from '../utils/validation';

interface BulkLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  allRecords: FloridaZipRecord[];
  filteredRecords: FloridaZipRecord[];
  uniqueCounties: string[];
  allCities: string[];
  initialScope?: BulkScopeMode;
  initialCity?: string;
  initialCounty?: string;
  onApplyBulkUpdate: (options: BulkUpdateLinksOptions) => void;
}

export function BulkLinkModal({
  isOpen,
  onClose,
  allRecords,
  filteredRecords,
  uniqueCounties,
  allCities,
  initialScope = 'city',
  initialCity = '',
  initialCounty = '',
  onApplyBulkUpdate
}: BulkLinkModalProps) {
  // Target Scope Selection
  const [scope, setScope] = useState<BulkScopeMode>(initialScope);
  const [targetCity, setTargetCity] = useState<string>(initialCity);
  const [targetCounty, setTargetCounty] = useState<string>(initialCounty);
  const [customZipsText, setCustomZipsText] = useState<string>('');

  // Link Fields to Update
  const [updatePaLink, setUpdatePaLink] = useState<boolean>(true);
  const [newPaLink, setNewPaLink] = useState<string>('');

  const [updateCountyPermitLink, setUpdateCountyPermitLink] = useState<boolean>(false);
  const [newCountyPermitLink, setNewCountyPermitLink] = useState<string>('');

  const [updateCityPermitLink, setUpdateCityPermitLink] = useState<boolean>(false);
  const [newCityPermitLink, setNewCityPermitLink] = useState<string>('');

  // Overwrite Option
  const [onlyIfEmpty, setOnlyIfEmpty] = useState<boolean>(false);

  // Cherry-pick selected record IDs in preview
  const [deselectedIds, setDeselectedIds] = useState<Set<string>>(new Set());

  // Search filter inside the preview table
  const [previewSearch, setPreviewSearch] = useState<string>('');
  const [urlErrors, setUrlErrors] = useState<Record<string, string>>({});

  // Synchronize initial values when modal opens
  useEffect(() => {
    if (isOpen) {
      setScope(initialScope || 'city');
      setTargetCity(initialCity || (allCities.length > 0 ? allCities[0] : ''));
      setTargetCounty(initialCounty || (uniqueCounties.length > 0 ? uniqueCounties[0] : ''));
      setCustomZipsText('');
      setDeselectedIds(new Set());
      setPreviewSearch('');
      setUrlErrors({});

      // Auto-populate links from first matching record if available
      const matching = allRecords.filter(r => {
        if (initialScope === 'city' && initialCity) {
          return (r.City || '').trim().toUpperCase() === initialCity.trim().toUpperCase();
        }
        if (initialScope === 'county' && initialCounty) {
          return (r.County || '').trim().toUpperCase() === initialCounty.trim().toUpperCase();
        }
        return false;
      });

      if (matching.length > 0) {
        setNewPaLink(matching[0].PAlink || '');
        setNewCountyPermitLink(matching[0].PermitByCounty || '');
        setNewCityPermitLink(matching[0].PermitByCity || '');
      }
    }
  }, [isOpen, initialScope, initialCity, initialCounty, allCities, uniqueCounties, allRecords]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Parse custom ZIPs input
  const parsedCustomZips = useMemo(() => {
    return customZipsText
      .split(/[\s,;\n]+/)
      .map(z => z.trim())
      .filter(z => /^\d{1,5}$/.test(z))
      .map(z => formatZipCode(z));
  }, [customZipsText]);

  // Compute matching records based on scope
  const matchedRecords = useMemo(() => {
    if (!isOpen) return [];

    const normCity = targetCity.trim().toUpperCase();
    const normCounty = targetCounty.trim().toUpperCase();
    const zipsSet = new Set(parsedCustomZips);

    if (scope === 'filtered') {
      return filteredRecords;
    }

    return allRecords.filter(rec => {
      const recCity = (rec.City || '').trim().toUpperCase();
      const recCounty = (rec.County || '').trim().toUpperCase();
      const recZip = formatZipCode(rec.zip);

      if (scope === 'city') {
        return normCity ? recCity === normCity : false;
      }
      if (scope === 'county') {
        return normCounty ? recCounty === normCounty : false;
      }
      if (scope === 'city_and_county') {
        return (
          (normCity ? recCity === normCity : true) &&
          (normCounty ? recCounty === normCounty : true)
        );
      }
      if (scope === 'zips') {
        return zipsSet.has(recZip);
      }
      return false;
    });
  }, [isOpen, scope, targetCity, targetCounty, parsedCustomZips, filteredRecords, allRecords]);

  // Filtered preview records by preview search query
  const displayedPreviewRecords = useMemo(() => {
    if (!previewSearch.trim()) return matchedRecords;
    const q = previewSearch.toLowerCase().trim();
    return matchedRecords.filter(r => {
      const zip = formatZipCode(r.zip);
      const city = (r.City || '').toLowerCase();
      const county = (r.County || '').toLowerCase();
      return zip.includes(q) || city.includes(q) || county.includes(q);
    });
  }, [matchedRecords, previewSearch]);

  // Selected records (excluding deselected IDs)
  const selectedRecordsCount = useMemo(() => {
    return matchedRecords.filter(r => !deselectedIds.has(getPermitRecordId(r))).length;
  }, [matchedRecords, deselectedIds]);

  const allPreviewSelected =
    matchedRecords.length > 0 &&
    matchedRecords.every(r => !deselectedIds.has(getPermitRecordId(r)));

  const handleToggleSelectAll = () => {
    if (allPreviewSelected) {
      const allIds = new Set(matchedRecords.map(r => getPermitRecordId(r)));
      setDeselectedIds(allIds);
    } else {
      setDeselectedIds(new Set());
    }
  };

  const handleToggleRecord = (id: string) => {
    setDeselectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Check if at least one link is selected to update
  const hasAtLeastOneLinkSelected =
    updatePaLink || updateCountyPermitLink || updateCityPermitLink;

  // Validation
  const canApply = selectedRecordsCount > 0 && hasAtLeastOneLinkSelected;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canApply) return;

    const errs: Record<string, string> = {};
    if (updatePaLink && newPaLink.trim()) {
      const err = validatePermitUrl(newPaLink, 'Property Appraiser portal URL');
      if (err) errs.newPaLink = err;
    }
    if (updateCountyPermitLink && newCountyPermitLink.trim()) {
      const err = validatePermitUrl(newCountyPermitLink, 'County Permit portal URL');
      if (err) errs.newCountyPermitLink = err;
    }
    if (updateCityPermitLink && newCityPermitLink.trim()) {
      const err = validatePermitUrl(newCityPermitLink, 'City Permit portal URL');
      if (err) errs.newCityPermitLink = err;
    }

    if (Object.keys(errs).length > 0) {
      setUrlErrors(errs);
      return;
    }

    setUrlErrors({});

    const selectedIds = matchedRecords
      .map(r => getPermitRecordId(r))
      .filter(id => !deselectedIds.has(id));

    onApplyBulkUpdate({
      scope,
      targetCity: targetCity.trim(),
      targetCounty: targetCounty.trim(),
      customZips: parsedCustomZips,
      selectedRecordIds: selectedIds,
      updatePaLink,
      newPaLink: newPaLink.trim(),
      updateCountyPermitLink,
      newCountyPermitLink: newCountyPermitLink.trim(),
      updateCityPermitLink,
      newCityPermitLink: newCityPermitLink.trim(),
      onlyIfEmpty
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-link-title"
    >
      <div
        className="relative bg-white rounded-[8px] border border-[#a8b3c0] shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col text-[#222] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar with Fully Visible Nested Close Button */}
        <div className="qq-modal-header px-4 py-2.5 text-white flex items-center justify-between gap-3 shrink-0 select-none shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-[3px] bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 id="bulk-link-title" className="text-sm font-bold text-white tracking-wide truncate">
                Bulk Update Links across Multiple Records
              </h2>
              <p className="text-[11px] text-white/85 truncate hidden sm:block">
                Update Property Appraiser and Building Permit URLs for an entire County, Municipality, or custom selection.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="qq-modal-close-btn shrink-0 cursor-pointer shadow-md"
            aria-label="Close bulk update dialog (Esc)"
            title="Close (Esc)"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* STEP 1: Select Records Target */}
          <div className="border border-[#e2e8f0] rounded-[3px] bg-[#f8fafc] p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-neutral-800 text-[13px]">
                <MapPin className="w-4 h-4 text-[#004b91]" />
                <span>Step 1: Choose Records to Target</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                <span>{matchedRecords.length} records match</span>
              </span>
            </div>

            {/* Scope Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-neutral-200/70 rounded-[3px]">
              <button
                type="button"
                onClick={() => setScope('city')}
                className={`py-1.5 px-2.5 rounded-[2px] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  scope === 'city'
                    ? 'bg-white text-[#004b91] shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-900'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>By Municipality / City</span>
              </button>

              <button
                type="button"
                onClick={() => setScope('county')}
                className={`py-1.5 px-2.5 rounded-[2px] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  scope === 'county'
                    ? 'bg-white text-[#004b91] shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-900'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>By County</span>
              </button>

              <button
                type="button"
                onClick={() => setScope('city_and_county')}
                className={`py-1.5 px-2.5 rounded-[2px] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  scope === 'city_and_county'
                    ? 'bg-white text-[#004b91] shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>City & County</span>
              </button>

              <button
                type="button"
                onClick={() => setScope('filtered')}
                className={`py-1.5 px-2.5 rounded-[2px] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  scope === 'filtered'
                    ? 'bg-white text-[#004b91] shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-900'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filtered Results ({filteredRecords.length})</span>
              </button>
            </div>

            {/* Scope Inputs */}
            {scope === 'city' && (
              <div className="space-y-1.5">
                <label className="block font-semibold text-neutral-700">
                  Select Municipality / City:
                </label>
                <div className="flex gap-2">
                  <select
                    value={targetCity}
                    onChange={e => setTargetCity(e.target.value)}
                    className="flex-1 bg-white border border-[#cbd5e0] rounded-[2px] py-1.5 px-2.5 font-medium text-xs focus:outline-hidden focus:border-[#004b91] focus:ring-1 focus:ring-[#004b91]"
                  >
                    <option value="">-- Choose Florida City --</option>
                    {allCities.map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Or type city name (e.g. DUNNELLON)..."
                    value={targetCity}
                    onChange={e => setTargetCity(e.target.value.toUpperCase())}
                    className="w-1/2 bg-white border border-[#cbd5e0] rounded-[2px] py-1.5 px-2.5 font-mono text-xs focus:outline-hidden focus:border-[#004b91] focus:ring-1 focus:ring-[#004b91]"
                  />
                </div>
                <p className="text-[11px] text-neutral-500">
                  Updates every record matching this municipality (e.g., all ZIPs for Dunnellon, Ocala, Tampa, etc.).
                </p>
              </div>
            )}

            {scope === 'county' && (
              <div className="space-y-1.5">
                <label className="block font-semibold text-neutral-700">
                  Select Florida County:
                </label>
                <select
                  value={targetCounty}
                  onChange={e => setTargetCounty(e.target.value)}
                  className="w-full bg-white border border-[#cbd5e0] rounded-[2px] py-1.5 px-2.5 font-medium text-xs focus:outline-hidden focus:border-[#004b91] focus:ring-1 focus:ring-[#004b91]"
                >
                  <option value="">-- Choose Florida County --</option>
                  {uniqueCounties.map(county => (
                    <option key={county} value={county}>
                      {county} COUNTY
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-neutral-500">
                  Updates all records in this county (e.g. all 31 records in MARION County).
                </p>
              </div>
            )}

            {scope === 'city_and_county' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-semibold text-neutral-700">
                    City / Municipality:
                  </label>
                  <select
                    value={targetCity}
                    onChange={e => setTargetCity(e.target.value)}
                    className="w-full bg-white border border-[#cbd5e0] rounded-[2px] py-1.5 px-2.5 font-medium text-xs focus:outline-hidden focus:border-[#004b91] focus:ring-1 focus:ring-[#004b91]"
                  >
                    <option value="">-- Choose City --</option>
                    {allCities.map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block font-semibold text-neutral-700">
                    Specific County:
                  </label>
                  <select
                    value={targetCounty}
                    onChange={e => setTargetCounty(e.target.value)}
                    className="w-full bg-white border border-[#cbd5e0] rounded-[2px] py-1.5 px-2.5 font-medium text-xs focus:outline-hidden focus:border-[#004b91] focus:ring-1 focus:ring-[#004b91]"
                  >
                    <option value="">-- Choose County --</option>
                    {uniqueCounties.map(county => (
                      <option key={county} value={county}>
                        {county} COUNTY
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {scope === 'filtered' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-[2px] text-blue-900 text-xs">
                <strong>Current Active Search / Filters:</strong> This will target all{' '}
                <span className="font-bold underline">{filteredRecords.length}</span> records currently
                visible in your search view.
              </div>
            )}
          </div>

          {/* STEP 2: Configure Links to Update */}
          <div className="border border-[#e2e8f0] rounded-[3px] bg-white p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-neutral-800 text-[13px]">
                <Globe className="w-4 h-4 text-[#004b91]" />
                <span>Step 2: Enter Portal URLs to Apply</span>
              </div>
              <span className="text-[11px] text-neutral-500">
                Check the links you wish to update
              </span>
            </div>

            {/* 1. Property Appraiser Link */}
            <div
              className={`p-3 rounded-[3px] border transition-colors ${
                updatePaLink
                  ? 'border-blue-300 bg-blue-50/40'
                  : 'border-neutral-200 bg-neutral-50/60 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-900 text-xs select-none">
                  <input
                    type="checkbox"
                    checked={updatePaLink}
                    onChange={e => setUpdatePaLink(e.target.checked)}
                    className="w-4 h-4 text-[#004b91] rounded-[2px] border-neutral-300 focus:ring-[#004b91]"
                  />
                  <span>1. Property Appraiser Portal URL (PAlink)</span>
                </label>
                {updatePaLink && newPaLink && (
                  <a
                    href={newPaLink.startsWith('http') ? newPaLink : `https://${newPaLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#004b91] hover:underline font-semibold"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {updatePaLink && (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPaLink}
                      onChange={e => {
                        setNewPaLink(e.target.value);
                        if (urlErrors.newPaLink) setUrlErrors({ ...urlErrors, newPaLink: '' });
                      }}
                      placeholder="https://www.pa.marion.fl.us/PropertySearch.aspx"
                      className={`flex-1 bg-white border rounded-[2px] py-1.5 px-2.5 font-mono text-xs focus:outline-hidden ${
                        urlErrors.newPaLink ? 'border-rose-500 bg-rose-50/50' : 'border-[#cbd5e0] focus:border-[#004b91]'
                      }`}
                    />
                    {newPaLink && (
                      <button
                        type="button"
                        onClick={() => setNewPaLink('')}
                        className="px-2 py-1 bg-neutral-200 hover:bg-neutral-300 rounded-[2px] text-neutral-700 text-[11px] font-semibold cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {urlErrors.newPaLink && (
                    <p className="text-rose-600 text-[11px] mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {urlErrors.newPaLink}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 2. County Building Permits Link */}
            <div
              className={`p-3 rounded-[3px] border transition-colors ${
                updateCountyPermitLink
                  ? 'border-blue-300 bg-blue-50/40'
                  : 'border-neutral-200 bg-neutral-50/60 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-900 text-xs select-none">
                  <input
                    type="checkbox"
                    checked={updateCountyPermitLink}
                    onChange={e => setUpdateCountyPermitLink(e.target.checked)}
                    className="w-4 h-4 text-[#004b91] rounded-[2px] border-neutral-300 focus:ring-[#004b91]"
                  />
                  <span>2. County Building Permits Portal URL (PermitByCounty)</span>
                </label>
                {updateCountyPermitLink && newCountyPermitLink && (
                  <a
                    href={
                      newCountyPermitLink.startsWith('http')
                        ? newCountyPermitLink
                        : `https://${newCountyPermitLink}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#004b91] hover:underline font-semibold"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {updateCountyPermitLink && (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCountyPermitLink}
                      onChange={e => {
                        setNewCountyPermitLink(e.target.value);
                        if (urlErrors.newCountyPermitLink) setUrlErrors({ ...urlErrors, newCountyPermitLink: '' });
                      }}
                      placeholder="https://www.marionfl.org/departments-agencies/departments-a-n/building-safety"
                      className={`flex-1 bg-white border rounded-[2px] py-1.5 px-2.5 font-mono text-xs focus:outline-hidden ${
                        urlErrors.newCountyPermitLink ? 'border-rose-500 bg-rose-50/50' : 'border-[#cbd5e0] focus:border-[#004b91]'
                      }`}
                    />
                    {newCountyPermitLink && (
                      <button
                        type="button"
                        onClick={() => setNewCountyPermitLink('')}
                        className="px-2 py-1 bg-neutral-200 hover:bg-neutral-300 rounded-[2px] text-neutral-700 text-[11px] font-semibold cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {urlErrors.newCountyPermitLink && (
                    <p className="text-rose-600 text-[11px] mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {urlErrors.newCountyPermitLink}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 3. Municipal / City Building Permits Link */}
            <div
              className={`p-3 rounded-[3px] border transition-colors ${
                updateCityPermitLink
                  ? 'border-blue-300 bg-blue-50/40'
                  : 'border-neutral-200 bg-neutral-50/60 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-900 text-xs select-none">
                  <input
                    type="checkbox"
                    checked={updateCityPermitLink}
                    onChange={e => setUpdateCityPermitLink(e.target.checked)}
                    className="w-4 h-4 text-[#004b91] rounded-[2px] border-neutral-300 focus:ring-[#004b91]"
                  />
                  <span>3. Municipal / City Building Permits Portal URL (PermitByCity)</span>
                </label>
                {updateCityPermitLink && newCityPermitLink && (
                  <a
                    href={
                      newCityPermitLink.startsWith('http')
                        ? newCityPermitLink
                        : `https://${newCityPermitLink}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#004b91] hover:underline font-semibold"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {updateCityPermitLink && (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCityPermitLink}
                      onChange={e => {
                        setNewCityPermitLink(e.target.value);
                        if (urlErrors.newCityPermitLink) setUrlErrors({ ...urlErrors, newCityPermitLink: '' });
                      }}
                      placeholder="https://www.dunnellon.org/departments/community-development"
                      className={`flex-1 bg-white border rounded-[2px] py-1.5 px-2.5 font-mono text-xs focus:outline-hidden ${
                        urlErrors.newCityPermitLink ? 'border-rose-500 bg-rose-50/50' : 'border-[#cbd5e0] focus:border-[#004b91]'
                      }`}
                    />
                    {newCityPermitLink && (
                      <button
                        type="button"
                        onClick={() => setNewCityPermitLink('')}
                        className="px-2 py-1 bg-neutral-200 hover:bg-neutral-300 rounded-[2px] text-neutral-700 text-[11px] font-semibold cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {urlErrors.newCityPermitLink && (
                    <p className="text-rose-600 text-[11px] mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {urlErrors.newCityPermitLink}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Overwrite mode option */}
            <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-700 select-none">
                <input
                  type="checkbox"
                  checked={onlyIfEmpty}
                  onChange={e => setOnlyIfEmpty(e.target.checked)}
                  className="w-3.5 h-3.5 text-[#004b91] rounded-[2px]"
                />
                <span>Only update records where the field is currently blank / null</span>
              </label>
              <span className="text-[11px] text-neutral-500">
                {onlyIfEmpty ? 'Preserves existing custom links' : 'Replaces existing links for all targeted records'}
              </span>
            </div>
          </div>

          {/* STEP 3: Live Preview of Target Records */}
          <div className="border border-[#e2e8f0] rounded-[3px] bg-white overflow-hidden">
            <div className="px-4 py-2.5 bg-neutral-100 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-800 text-[12.5px]">
                  Step 3: Preview Matched Records ({selectedRecordsCount} selected of {matchedRecords.length})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter preview list..."
                  value={previewSearch}
                  onChange={e => setPreviewSearch(e.target.value)}
                  className="bg-white border border-neutral-300 rounded-[2px] px-2 py-1 text-xs w-44 focus:outline-hidden focus:border-[#004b91]"
                />
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="px-2 py-1 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-[2px] text-[11px] font-semibold text-neutral-700 cursor-pointer"
                >
                  {allPreviewSelected ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>

            {matchedRecords.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">
                <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="font-semibold">No records match the current target scope.</p>
                <p className="text-[11px]">Choose a different municipality, county, or search filter.</p>
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto divide-y divide-neutral-200 text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-neutral-50 text-neutral-600 font-bold text-[10.5px] uppercase sticky top-0 border-b border-neutral-200">
                    <tr>
                      <th className="py-1.5 px-3 w-8">
                        <input
                          type="checkbox"
                          checked={allPreviewSelected}
                          onChange={handleToggleSelectAll}
                          className="w-3.5 h-3.5 rounded-[2px]"
                        />
                      </th>
                      <th className="py-1.5 px-2">ZIP</th>
                      <th className="py-1.5 px-2">Municipality</th>
                      <th className="py-1.5 px-2">County</th>
                      <th className="py-1.5 px-2">Current PA Link</th>
                      <th className="py-1.5 px-2">Current Permits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {displayedPreviewRecords.map(rec => {
                      const id = getPermitRecordId(rec);
                      const isSelected = !deselectedIds.has(id);
                      return (
                        <tr
                          key={id}
                          onClick={() => handleToggleRecord(id)}
                          className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                            !isSelected ? 'opacity-40 bg-neutral-50' : ''
                          }`}
                        >
                          <td className="py-1.5 px-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleRecord(id)}
                              onClick={e => e.stopPropagation()}
                              className="w-3.5 h-3.5 rounded-[2px]"
                            />
                          </td>
                          <td className="py-1.5 px-2 font-mono font-bold text-[#004b91]">
                            {formatZipCode(rec.zip)}
                          </td>
                          <td className="py-1.5 px-2 font-semibold text-neutral-800">
                            {rec.City || '—'}
                          </td>
                          <td className="py-1.5 px-2 text-neutral-600 font-medium">
                            {rec.County || '—'} CO.
                          </td>
                          <td className="py-1.5 px-2 font-mono text-[10.5px] text-neutral-600 truncate max-w-[180px]">
                            {rec.PAlink || <span className="text-neutral-400">None</span>}
                          </td>
                          <td className="py-1.5 px-2 font-mono text-[10.5px] text-neutral-600 truncate max-w-[180px]">
                            {rec.PermitByCity || rec.PermitByCounty || (
                              <span className="text-neutral-400">None</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="text-[11.5px] text-neutral-600">
              {canApply ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Ready to update {selectedRecordsCount} record{selectedRecordsCount === 1 ? '' : 's'}.
                </span>
              ) : (
                <span className="text-amber-700 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Select at least one record and check at least one link to update.
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-neutral-300 rounded-[2px] text-neutral-700 hover:bg-neutral-100 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!canApply}
                className={`py-2 px-6 rounded-[3px] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                  canApply
                    ? 'qq-btn-green'
                    : 'bg-neutral-300 text-neutral-500 border border-neutral-300 cursor-not-allowed'
                }`}
              >
                <span>Apply Bulk Update ({selectedRecordsCount}) ✎</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
