import {
  Search,
  X,
  RotateCcw,
  Info,
  ArrowUpDown,
  Plus
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
    <div className="bg-white border border-[#d5d5d5] rounded-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-3 sm:p-4 mb-3 text-[#222222]">
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-2.5">
        {/* Main Controls Row: Search Box + County Filter + City Filter + Sort Selector in ONE LINE */}
        <div className="flex flex-col md:flex-row items-stretch md:items-end gap-2.5 w-full">
          {/* 1. Search Box with GO button */}
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="permit-search-input"
              className="block text-[#333333] text-[12px] font-bold mb-1 select-none"
            >
              {isSpanish ? 'Ingrese Criterios de Búsqueda' : 'Enter Search Criteria'}
            </label>
            <div className="flex items-stretch shadow-2xs">
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-[#777777] absolute left-2.5 pointer-events-none z-10" />
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
                  className="w-full bg-white text-[#222222] text-[13px] border border-[#b0b0b0] border-r-0 pl-9 pr-14 py-1 rounded-l-[2px] focus:outline-hidden focus:border-[#286090] focus:ring-1 focus:ring-[#286090]/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] h-[32px] font-sans placeholder-[#888888]"
                />
                <div className="absolute right-2 flex items-center gap-1 z-10">
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => onSearchChange('')}
                      className="text-[#888888] hover:text-[#222222] cursor-pointer p-1"
                      title={isSpanish ? 'Limpiar búsqueda (Esc)' : 'Clear search (Esc)'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : showTooltips ? (
                    <span className="text-[9.5px] font-mono text-[#888888] bg-[#f0f0f0] border border-[#d0d0d0] px-1 py-0.5 rounded pointer-events-none hidden sm:inline">
                      Ctrl K
                    </span>
                  ) : null}
                </div>
              </div>
              <button
                type="submit"
                className="qq-btn-go px-3.5 py-1 uppercase rounded-r-[2px] rounded-l-none -ml-[1px] cursor-pointer flex items-center justify-center shrink-0 h-[32px] font-bold text-[11px] tracking-wide"
              >
                GO
              </button>
            </div>
          </div>

          {/* 2. County Dropdown Filter */}
          <div className="w-full md:w-[150px] shrink-0">
            <label htmlFor="county-filter" className="block text-[#333333] text-[12px] font-bold mb-1 select-none truncate">
              {isSpanish ? 'Condado:' : 'County:'}
            </label>
            <div className="bg-white px-2 py-1 border border-[#b0b0b0] rounded-[2px] shadow-2xs h-[32px] flex items-center">
              <select
                id="county-filter"
                value={countyFilter}
                onChange={(e) => onCountyChange(e.target.value)}
                className="bg-transparent border-none text-[#222222] font-semibold text-[12px] focus:outline-hidden cursor-pointer w-full"
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
          <div className="w-full md:w-[150px] shrink-0">
            <label htmlFor="city-filter" className="block text-[#333333] text-[12px] font-bold mb-1 select-none truncate">
              {isSpanish ? 'Ciudad:' : 'City:'}
            </label>
            <div className="bg-white px-2 py-1 border border-[#b0b0b0] rounded-[2px] shadow-2xs h-[32px] flex items-center">
              <select
                id="city-filter"
                value={cityFilter}
                onChange={(e) => onCityChange(e.target.value)}
                className="bg-transparent border-none text-[#222222] font-semibold text-[12px] focus:outline-hidden cursor-pointer w-full"
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

          {/* 4. Sort By: Label outside the box with ArrowUpDown icon */}
          <div className="w-full md:w-[160px] shrink-0">
            <label
              htmlFor="permit-sort"
              className="block text-[#333333] text-[12px] font-bold mb-1 select-none truncate"
            >
              {t('sortBy')}:
            </label>
            <div className="flex items-center gap-1.5 bg-white border border-[#b0b0b0] rounded-[2px] px-2 py-1 h-[32px] shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#286090] shrink-0" />
              <select
                id="permit-sort"
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as PermitSortOption)}
                className="bg-transparent border-none text-[12px] text-[#222222] font-semibold focus:outline-hidden cursor-pointer w-full"
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

        {/* Popular Preset Searches Chips + Clear Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#ebebeb] text-[11.5px]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#555555] font-bold text-[11px] select-none">
              {isSpanish ? 'Condados Populares:' : 'Top Counties:'}
            </span>
            {PRESET_PERMIT_SEARCHES.map((preset) => {
              const isMatch = countyFilter === preset || searchQuery.toLowerCase() === preset.toLowerCase();
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    if (countyFilter === preset) {
                      onCountyChange('ALL');
                    } else {
                      onCountyChange(preset);
                    }
                  }}
                  className={`px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer text-[11.5px] font-medium ${
                    isMatch
                      ? 'bg-[#286090] text-white font-bold'
                      : 'bg-[#f4f6f8] text-[#333333] hover:bg-[#e8ecf0] border border-[#d0d7de]'
                  }`}
                >
                  {preset}
                </button>
              );
            })}

            {/* Interactive Florida Map View Quick Toggle */}
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'map' ? 'table' : 'map')}
              className={`px-2.5 py-0.5 rounded-[2px] transition-all cursor-pointer text-[11px] font-bold flex items-center gap-1 border ${
                viewMode === 'map'
                  ? 'bg-[#004b91] text-white border-[#003870] shadow-xs'
                  : 'bg-[#eaf4fd] text-[#004b91] hover:bg-[#d5eafd] border-[#b0d4f5]'
              }`}
              title={isSpanish ? 'Alternar Mapa Interactivo de Florida' : 'Toggle Interactive Florida Map'}
            >
              <span>🗺️</span>
              <span>{viewMode === 'map' ? (isSpanish ? 'Ocultar Mapa' : 'Hide Map') : (isSpanish ? 'Mapa de Florida' : 'Florida Map')}</span>
            </button>

            {/* Admin Add New Jurisdiction Quick Button */}
            {onAddNewJurisdiction && (
              <button
                type="button"
                onClick={onAddNewJurisdiction}
                className="px-2.5 py-0.5 rounded-[2px] transition-all cursor-pointer text-[11px] font-bold flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 shadow-2xs"
                title={isSpanish ? 'Agregar nueva jurisdicción de Florida' : 'Add a new Florida jurisdiction record'}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isSpanish ? 'Nueva Jurisdicción' : '+ Add Jurisdiction'}</span>
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-rose-700 hover:text-rose-900 text-[11.5px] font-bold cursor-pointer inline-flex items-center gap-1 hover:underline ml-auto"
              title="Reset filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('clearFilters')}</span>
            </button>
          )}
        </div>

        {/* Guidance Banner */}
        {showHelpBanners && (
          <div className="flex items-center justify-between text-[11.5px] text-[#444444] bg-[#f2f7fc] border border-[#d0e0f0] px-2.5 py-1.5 rounded-[2px] transition-all">
            <div className="flex items-center gap-1.5 truncate">
              <Info className="w-3.5 h-3.5 text-[#286090] shrink-0" />
              <span className="truncate">{t('searchHintPermit')}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <button
                type="button"
                onClick={toggleHelpBanners}
                className="text-[#888888] hover:text-[#444444] p-0.5 cursor-pointer text-[10px]"
                title="Hide guidance"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
