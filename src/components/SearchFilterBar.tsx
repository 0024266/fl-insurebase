import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  ArrowUpDown,
  RotateCcw,
  Info
} from 'lucide-react';
import { SortOption, CategoryFilter } from '../types/mortgage';
import { useLanguage } from '../context/LanguageContext';
import { usePreferences } from '../context/PreferencesContext';
import { isExact5DigitZip } from '../utils/crossTabRouting';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter?: CategoryFilter;
  onCategoryChange?: (category: CategoryFilter) => void;
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClear();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-3.5 sm:p-4 mb-4 text-slate-900">
      <form onSubmit={handleGoClick} className="flex flex-col gap-3">
        {/* Main Controls Row: Search Input + GO Button + Sort Selector */}
        <div className="flex flex-wrap items-end gap-3 justify-between w-full">
          {/* Primary Search Box */}
          <div className="flex-1 min-w-[240px]">
            <label
              htmlFor="global-search-input"
              className="block text-slate-700 text-xs font-semibold mb-1.5 select-none"
            >
              {isSpanish ? 'Ingrese Criterios de Búsqueda' : 'Enter Search Criteria'}
            </label>
            <div className="flex items-stretch">
              <div className="relative flex-1 flex items-center min-w-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none z-10" />
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
                  onKeyDown={handleKeyDown}
                  placeholder={isSpanish ? 'Buscar Nombre, Póliza #, Teléfono ...' : 'Search Lender Name, Clause, Address, Phone ...'}
                  className="w-full bg-white text-slate-900 text-[13px] border border-slate-300 border-r-0 pl-9 pr-16 py-1.5 rounded-l-lg focus:outline-hidden focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 h-9 font-sans placeholder-slate-400 transition-all"
                />
                <div className="absolute right-2.5 flex items-center gap-1 z-10">
                  {localInput ? (
                    <button
                      type="button"
                      onClick={handleClear}
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

          {/* Sort Selector */}
          <div className="flex flex-col w-full sm:w-auto shrink-0">
            <label
              htmlFor="mortgage-sort-select"
              className="block text-slate-700 text-xs font-semibold mb-1.5 select-none"
            >
              {t('sortBy')}
            </label>
            <div className="flex items-center gap-2 bg-white border border-slate-300 hover:border-slate-400 focus-within:border-sky-600 focus-within:ring-2 focus-within:ring-sky-500/20 rounded-lg px-3 py-1.5 h-9 shadow-2xs transition-all">
              <ArrowUpDown className="w-3.5 h-3.5 text-sky-700 shrink-0" />
              <select
                id="mortgage-sort-select"
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="bg-transparent border-none text-xs text-slate-800 font-semibold focus:outline-hidden cursor-pointer w-full"
              >
                <option value="name_asc">{t('sortNameAsc')}</option>
                <option value="name_desc">{t('sortNameDesc')}</option>
                <option value="updated_desc">{isSpanish ? 'Más Reciente' : 'Newest Updated'}</option>
                <option value="updated_asc">{isSpanish ? 'Más Antiguo' : 'Oldest Updated'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Popular Preset Searches Chips — Single Horizontal Row with Hidden Overflow */}
        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100 overflow-hidden">
          <div
            className="flex flex-nowrap items-center gap-1.5 text-xs overflow-hidden min-w-0 flex-1"
            role="group"
            aria-label={isSpanish ? 'Prestamistas frecuentes' : 'Popular Lenders quick filters'}
          >
            <span className="text-slate-500 font-semibold text-[11.5px] mr-0.5 select-none shrink-0 whitespace-nowrap">
              {isSpanish ? 'Prestamistas Frecuentes:' : 'Popular Lenders:'}
            </span>
            {PRESET_SEARCHES.map((preset) => {
              const isMatch = searchQuery.toLowerCase() === preset.toLowerCase();
              return (
                <button
                  key={preset}
                  type="button"
                  aria-pressed={isMatch}
                  onClick={() => {
                    if (isMatch) {
                      onSearchChange('');
                    } else {
                      onSearchChange(preset);
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

          {searchQuery.trim() && (
            <button
              type="button"
              onClick={handleClear}
              className="text-rose-600 hover:text-rose-800 text-xs font-semibold cursor-pointer inline-flex items-center gap-1 hover:underline shrink-0 whitespace-nowrap ml-2"
              title="Clear search"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('clearFilters')}</span>
            </button>
          )}
        </div>

        {/* Guidance Banner */}
        {showHelpBanners && (
          <div className="flex items-center justify-between text-xs text-slate-600 bg-sky-50/70 border border-sky-200/70 px-3 py-2 rounded-lg transition-all">
            <div className="flex items-center gap-2 truncate">
              <Info className="w-3.5 h-3.5 text-sky-700 shrink-0" />
              <span className="truncate">{t('searchHintMortgage')}</span>
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
