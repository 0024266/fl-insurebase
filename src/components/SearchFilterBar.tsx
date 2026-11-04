import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  ArrowUpDown,
  RotateCcw,
  Info
} from 'lucide-react';
import { SortOption } from '../types/mortgage';
import { useLanguage } from '../context/LanguageContext';
import { usePreferences } from '../context/PreferencesContext';
import { isExact5DigitZip } from '../utils/crossTabRouting';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onDetectZip?: (zip: string) => void;
  stats?: {
    total: number;
    filteredCount: number;
  };
  onOpenShortcuts?: () => void;
}

const PRESET_SEARCHES = [
  'Chase',
  'Wells Fargo',
  'Rocket Mortgage',
  'LoanDepot',
  'Mr. Cooper',
  'Bank of America',
  'Pennymac',
  'US Bank'
];

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  onDetectZip
}: SearchFilterBarProps) {
  const { t, isSpanish } = useLanguage();
  const { showHelpBanners, showTooltips, toggleHelpBanners } = usePreferences();
  const [localInput, setLocalInput] = useState(searchQuery);

  useEffect(() => {
    setLocalInput(searchQuery);
  }, [searchQuery]);

  const handleGoClick = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = localInput.trim();
    if (isExact5DigitZip(trimmed) && onDetectZip) {
      onDetectZip(trimmed);
      return;
    }
    onSearchChange(localInput);
  };

  const handleClear = () => {
    setLocalInput('');
    onSearchChange('');
  };

  return (
    <div className="bg-white border border-[#d5d5d5] rounded-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-3 sm:p-4 mb-3 text-[#222222]">
      <form onSubmit={handleGoClick} className="flex flex-col gap-2.5">
        {/* Main Controls Row: Enter Search Criteria Box + Clean Separate Sort Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 justify-between">
          {/* Search Box: Styled like Enter Search Criteria */}
          <div className="flex-1 max-w-2xl">
            <label
              htmlFor="global-search-input"
              className="block text-[#333333] text-[12px] font-bold mb-1 select-none"
            >
              {isSpanish ? 'Ingrese Criterios de Búsqueda' : 'Enter Search Criteria'}
            </label>
            <div className="flex items-stretch shadow-2xs">
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-[#777777] absolute left-2.5 pointer-events-none z-10" />
                <input
                  id="global-search-input"
                  type="text"
                  value={localInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLocalInput(val);
                    const trimmed = val.trim();
                    if (isExact5DigitZip(trimmed) && onDetectZip) {
                      onDetectZip(trimmed);
                      return;
                    }
                    onSearchChange(val);
                  }}
                  placeholder={isSpanish ? 'Buscar Nombre, Póliza #, Teléfono ...' : 'Search Name, Policy #, Phone ...'}
                  className="w-full bg-white text-[#222222] text-[13px] border border-[#b0b0b0] border-r-0 pl-9 pr-14 py-1 rounded-l-[2px] focus:outline-hidden focus:border-[#286090] focus:ring-1 focus:ring-[#286090]/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] h-[32px] font-sans placeholder-[#888888]"
                />
                <div className="absolute right-2 flex items-center gap-1 z-10">
                  {localInput ? (
                    <button
                      type="button"
                      onClick={handleClear}
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

          {/* Sort Selector: Label OUTSIDE the box */}
          <div className="flex flex-col shrink-0">
            <label
              htmlFor="mortgage-sort-select"
              className="block text-[#333333] text-[12px] font-bold mb-1 select-none"
            >
              {t('sortBy')}:
            </label>
            <div className="flex items-center gap-1.5 bg-white border border-[#b0b0b0] rounded-[2px] px-2 py-1 h-[32px] shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#286090]" />
              <select
                id="mortgage-sort-select"
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="bg-transparent border-none text-[12.5px] text-[#222222] font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="name_asc">{t('sortNameAsc')}</option>
                <option value="name_desc">{t('sortNameDesc')}</option>
                <option value="updated_desc">{isSpanish ? 'Más Reciente' : 'Newest Updated'}</option>
                <option value="updated_asc">{isSpanish ? 'Más Antiguo' : 'Oldest Updated'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Popular Preset Searches Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#ebebeb]">
          <div className="flex flex-wrap items-center gap-1.5 text-[11.5px]">
            <span className="text-[#555555] font-bold text-[11px] select-none">
              {isSpanish ? 'Prestamistas Frecuentes:' : 'Popular Lenders:'}
            </span>
            {PRESET_SEARCHES.map((preset) => {
              const isMatch = searchQuery.toLowerCase() === preset.toLowerCase();
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    if (isMatch) {
                      onSearchChange('');
                    } else {
                      onSearchChange(preset);
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
          </div>

          {searchQuery.trim() && (
            <button
              type="button"
              onClick={handleClear}
              className="text-rose-700 hover:text-rose-900 text-[11.5px] font-bold cursor-pointer inline-flex items-center gap-1 hover:underline ml-auto"
              title="Clear search"
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
              <span className="truncate">{t('searchHintMortgage')}</span>
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
