import React from 'react';
import {
  Search,
  X,
  RotateCcw,
  Info,
  ArrowUpDown,
  Plus,
  Map as MapIcon
} from 'lucide-react';
import {
  PermitTerrainFilter,
  PermitSortOption,
  PermitStats
} from '../types/permits';
import { useLanguage } from '../context/LanguageContext';
import { usePreferences } from '../context/PreferencesContext';
import { isLenderQuery } from '../utils/crossTabRouting';

interface PermitFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onDetectLender?: (query: string) => void;
  onAddNewJurisdiction?: () => void;
  countyFilter: string;
  onCountyChange: (val: string) => void;
  cityFilter: string;
  onCityChange: (val: string) => void;
  availableCities: string[];
  uniqueCounties: string[];
  terrainFilter?: PermitTerrainFilter;
  onTerrainChange?: (val: PermitTerrainFilter) => void;
  sortOption: PermitSortOption;
  onSortChange: (val: PermitSortOption) => void;
  hasCityPermitOnly?: boolean;
  onToggleHasCityPermit?: () => void;
  hasCountyPermitOnly?: boolean;
  onToggleHasCountyPermit?: () => void;
  stats?: PermitStats;
  onOpenImport?: () => void;
  onOpenBulkUpdate?: () => void;
}

const PRESET_PERMIT_SEARCHES = [
  'Miami-Dade',
  'Broward',
  'Palm Beach',
  'Orange',
  'Hillsborough',
  'Pinellas',
  'Duval',
  'Lee',
  'Collier'
];

export function PermitFilterBar({
  searchQuery,
  onSearchChange,
  onDetectLender,
  onAddNewJurisdiction,
  countyFilter,
  onCountyChange,
  cityFilter,
  onCityChange,
  availableCities,
  uniqueCounties,
  sortOption,
  onSortChange
}: PermitFilterBarProps) {
  const { t, isSpanish } = useLanguage();
  const { showHelpBanners, showTooltips, toggleHelpBanners, viewMode, setViewMode } = usePreferences();

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    countyFilter !== 'ALL' ||
    cityFilter !== 'ALL';

  const handleClearFilters = () => {
    onSearchChange('');
    onCountyChange('ALL');
    onCityChange('ALL');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (isLenderQuery(trimmed) && onDetectLender) {
      onDetectLender(trimmed);
      return;
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-3.5 sm:p-4 mb-4 text-slate-900">
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
        {/* Main Controls Row: Search Box + County Filter + City Filter + Sort Selector */}
        <div className="flex flex-wrap items-end gap-3 w-full">
          {/* 1. Search Box with GO button */}
          <div className="flex-1 min-w-[240px]">
            <label
              htmlFor="permit-search-input"
              className="block text-slate-700 text-xs font-semibold mb-1.5 select-none"
            >
              {isSpanish ? 'Ingrese Criterios de Búsqueda' : 'Enter Search Criteria'}
            </label>
            <div className="flex items-stretch">
              <div className="relative flex-1 flex items-center min-w-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none z-10" />
                <input
                  id="permit-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    onSearchChange(val);
                    const trimmed = val.trim();
                    if (isLenderQuery(trimmed) && onDetectLender) {
                      onDetectLender(trimmed);
                    }
                  }}
                  placeholder={t('searchPermitPlaceholder')}
                  className="w-full bg-white text-slate-900 text-[13px] border border-slate-300 border-r-0 pl-9 pr-16 py-1.5 rounded-l-lg focus:outline-hidden focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 h-9 font-sans placeholder-slate-400 transition-all"
                />
                <div className="absolute right-2.5 flex items-center gap-1 z-10">
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => onSearchChange('')}
                      className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer p-1 transition-colors"
                      title={isSpanish ? 'Limpiar búsqueda (Esc)' : 'Clear search (Esc)'}
                      aria-label={isSpanish ? 'Limpiar búsqueda' : 'Clear search'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : showTooltips ? (
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md pointer-events-none hidden sm:inline">
                      Ctrl K
                    </span>
                  ) : null}
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-1.5 uppercase rounded-r-lg bg-slate-900 hover:bg-slate-800 text-white border border-slate-900 cursor-pointer flex items-center justify-center shrink-0 h-9 font-semibold text-xs tracking-wide transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500/40"
              >
                GO
              </button>
            </div>
          </div>

          {/* 2. County Dropdown Filter */}
          <div className="w-full sm:w-auto sm:min-w-[160px] flex-1 sm:flex-initial">
            <label htmlFor="county-filter" className="block text-slate-700 text-xs font-semibold mb-1.5 select-none truncate">
              {isSpanish ? 'Condado' : 'County'}
            </label>
            <div className="bg-white px-3 py-1.5 border border-slate-300 hover:border-slate-400 focus-within:border-sky-600 focus-within:ring-2 focus-within:ring-sky-500/20 rounded-lg shadow-2xs h-9 flex items-center transition-all">
              <select
                id="county-filter"
                value={countyFilter}
                onChange={(e) => onCountyChange(e.target.value)}
                className="bg-transparent border-none text-slate-800 font-semibold text-xs focus:outline-hidden cursor-pointer w-full"
              >
                <option value="ALL">{isSpanish ? '(Todos)' : '(All Counties)'}</option>
                {uniqueCounties.map((county) => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. City Dropdown Filter */}
          <div className="w-full sm:w-auto sm:min-w-[160px] flex-1 sm:flex-initial">
            <label htmlFor="city-filter" className="block text-slate-700 text-xs font-semibold mb-1.5 select-none truncate">
              {isSpanish ? 'Ciudad' : 'City'}
            </label>
            <div className="bg-white px-3 py-1.5 border border-slate-300 hover:border-slate-400 focus-within:border-sky-600 focus-within:ring-2 focus-within:ring-sky-500/20 rounded-lg shadow-2xs h-9 flex items-center transition-all">
              <select
                id="city-filter"
                value={cityFilter}
                onChange={(e) => onCityChange(e.target.value)}
                className="bg-transparent border-none text-slate-800 font-semibold text-xs focus:outline-hidden cursor-pointer w-full"
              >
                <option value="ALL">
                  {countyFilter === 'ALL'
                    ? (isSpanish ? '(Todas)' : '(All Cities)')
                    : (isSpanish ? `(En ${countyFilter})` : `(All in ${countyFilter})`)}
                </option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Sort By */}
          <div className="w-full sm:w-auto sm:min-w-[165px] flex-1 sm:flex-initial">
            <label
              htmlFor="permit-sort"
              className="block text-slate-700 text-xs font-semibold mb-1.5 select-none truncate"
            >
              {t('sortBy')}
            </label>
            <div className="flex items-center gap-2 bg-white border border-slate-300 hover:border-slate-400 focus-within:border-sky-600 focus-within:ring-2 focus-within:ring-sky-500/20 rounded-lg px-3 py-1.5 h-9 shadow-2xs transition-all">
              <ArrowUpDown className="w-3.5 h-3.5 text-sky-700 shrink-0" />
              <select
                id="permit-sort"
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as PermitSortOption)}
                className="bg-transparent border-none text-xs text-slate-800 font-semibold focus:outline-hidden cursor-pointer w-full"
              >
                <option value="zip_asc">{isSpanish ? 'ZIP (0–9)' : 'ZIP (0–9)'}</option>
                <option value="zip_desc">{isSpanish ? 'ZIP (9–0)' : 'ZIP (9–0)'}</option>
                <option value="city_asc">{isSpanish ? 'Ciudad (A–Z)' : 'City (A–Z)'}</option>
                <option value="city_desc">{isSpanish ? 'Ciudad (Z–A)' : 'City (Z–A)'}</option>
                <option value="county_asc">{isSpanish ? 'Condado (A–Z)' : 'County (A–Z)'}</option>
                <option value="county_desc">{isSpanish ? 'Condado (Z–A)' : 'County (Z–A)'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Popular Preset Searches Chips + Clear Filters — Single Horizontal Row with Hidden Overflow */}
        <div className="flex flex-nowrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100 text-xs overflow-hidden">
          <div
            className="flex flex-nowrap items-center gap-1.5 overflow-hidden min-w-0 flex-1"
            role="group"
            aria-label={isSpanish ? 'Condados populares' : 'Top Counties quick filters'}
          >
            <span className="text-slate-500 font-semibold text-[11.5px] mr-0.5 select-none shrink-0 whitespace-nowrap">
              {isSpanish ? 'Condados Populares:' : 'Top Counties:'}
            </span>
            {PRESET_PERMIT_SEARCHES.map((preset) => {
              const isMatch = countyFilter === preset || searchQuery.toLowerCase() === preset.toLowerCase();
              return (
                <button
                  key={preset}
                  type="button"
                  aria-pressed={isMatch}
                  onClick={() => {
                    if (countyFilter === preset) {
                      onCountyChange('ALL');
                    } else {
                      onCountyChange(preset);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer text-xs font-medium border shrink-0 whitespace-nowrap focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500/40 ${
                    isMatch
                      ? 'bg-sky-600 text-white border-sky-600 font-semibold shadow-2xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-slate-200/90'
                  }`}
                >
                  {preset}
                </button>
              );
            })}
          </div>

          <div className="flex flex-nowrap items-center gap-1.5 shrink-0">
            {/* Interactive Florida Map View Quick Toggle */}
            <button
              type="button"
              aria-pressed={viewMode === 'map'}
              onClick={() => setViewMode(viewMode === 'map' ? 'table' : 'map')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer text-xs font-semibold flex items-center gap-1.5 border shrink-0 whitespace-nowrap focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500/40 ${
                viewMode === 'map'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-sky-50 text-sky-800 hover:bg-sky-100/80 border-sky-200/90'
              }`}
              title={isSpanish ? 'Alternar Mapa Interactivo de Florida' : 'Toggle Interactive Florida Map'}
            >
              <MapIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{viewMode === 'map' ? (isSpanish ? 'Ocultar Mapa' : 'Hide Map') : (isSpanish ? 'Mapa de Florida' : 'Florida Map')}</span>
            </button>

            {/* Admin Add New Jurisdiction Quick Button */}
            {onAddNewJurisdiction && (
              <button
                type="button"
                onClick={onAddNewJurisdiction}
                className="px-3 py-1 rounded-full transition-all cursor-pointer text-xs font-semibold flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 shadow-2xs shrink-0 whitespace-nowrap"
                title={isSpanish ? 'Agregar nueva jurisdicción de Florida' : 'Add a new Florida jurisdiction record'}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                <span>{isSpanish ? 'Nueva Jurisdicción' : '+ Add Jurisdiction'}</span>
              </button>
            )}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-rose-600 hover:text-rose-800 text-xs font-semibold cursor-pointer inline-flex items-center gap-1 hover:underline shrink-0 whitespace-nowrap ml-1"
                title="Reset filters"
              >
                <RotateCcw className="w-3 h-3 shrink-0" />
                <span>{t('clearFilters')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Guidance Banner */}
        {showHelpBanners && (
          <div className="flex items-center justify-between text-xs text-slate-600 bg-sky-50/70 border border-sky-200/70 px-3 py-2 rounded-lg transition-all">
            <div className="flex items-center gap-2 truncate">
              <Info className="w-3.5 h-3.5 text-sky-700 shrink-0" />
              <span className="truncate">{t('searchHintPermit')}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <button
                type="button"
                onClick={toggleHelpBanners}
                className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer transition-colors"
                title="Hide guidance"
                aria-label="Hide guidance"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
