import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  ArrowUpDown,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  Plus
} from 'lucide-react';
import {
  CarrierLobFilter,
  CarrierSortOption,
  CarrierStats
} from '../types/carrier';
import { useLanguage } from '../context/LanguageContext';
import { usePreferences } from '../context/PreferencesContext';

interface CarrierFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  lobFilter: CarrierLobFilter;
  onLobChange: (lob: CarrierLobFilter) => void;
  citizensTakeoutOnly: boolean;
  onToggleCitizensTakeout: () => void;
  noCcFeeOnly: boolean;
  onToggleNoCcFee: () => void;
  sortOption: CarrierSortOption;
  onSortChange: (sort: CarrierSortOption) => void;
  stats: CarrierStats;
  onResetFilters: () => void;
  onAddNewCarrier?: () => void;
}

const LOB_CHIPS: { key: CarrierLobFilter; label: string; labelEs: string }[] = [
  { key: 'all', label: 'All Lines', labelEs: 'Todas' },
  { key: 'Home', label: 'Home', labelEs: 'Hogar' },
  { key: 'Auto', label: 'Auto', labelEs: 'Auto' },
  { key: 'Flood', label: 'Flood', labelEs: 'Inundación' },
  { key: 'Commercial', label: 'Commercial', labelEs: 'Comercial' },
  { key: 'Personal', label: 'Personal', labelEs: 'Personal' },
  { key: 'Liability', label: 'Liability', labelEs: 'Responsabilidad' }
];

const POPULAR_CARRIERS = [
  'Citizens',
  'American Coastal',
  'American Integrity',
  'Slide',
  'Universal P&C',
  'Florida Peninsula',
  'Heritage',
  'TypTap',
  'Security First',
  'Progressive'
];

export function CarrierFilterBar({
  searchQuery,
  onSearchChange,
  lobFilter,
  onLobChange,
  citizensTakeoutOnly,
  onToggleCitizensTakeout,
  noCcFeeOnly,
  onToggleNoCcFee,
  sortOption,
  onSortChange,
  stats,
  onResetFilters,
  onAddNewCarrier
}: CarrierFilterBarProps) {
  const { isSpanish } = useLanguage();
  const { showTooltips } = usePreferences();
  const [localInput, setLocalInput] = useState(searchQuery);

  useEffect(() => {
    setLocalInput(searchQuery);
  }, [searchQuery]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localInput);
  };

  const handleClearSearch = () => {
    setLocalInput('');
    onSearchChange('');
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    lobFilter !== 'all' ||
    citizensTakeoutOnly ||
    noCcFeeOnly;

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-3.5 sm:p-4 mb-4 text-slate-900">
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
        {/* Top Row: Search Input + Dedicated Toggles + Sort + Admin Add */}
        <div className="flex flex-wrap items-end gap-3 justify-between w-full">
          {/* Search Input */}
          <div className="flex-1 min-w-[240px]">
            <label
              htmlFor="carrier-search-input"
              className="block text-slate-700 text-xs font-semibold mb-1.5 select-none"
            >
              {isSpanish
                ? 'Buscar Accesos de Aseguradoras, Portal de Pago, Teléfono o Notas'
                : 'Search Carrier Shortcuts, Payment Portal, Phone, or Notes'}
            </label>
            <div className="flex items-stretch">
              <div className="relative flex-1 flex items-center min-w-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none z-10" />
                <input
                  id="carrier-search-input"
                  type="text"
                  value={localInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLocalInput(val);
                    onSearchChange(val);
                  }}
                  placeholder={
                    isSpanish
                      ? 'Ej. Citizens, Slide, American Integrity, 800-748-2030...'
                      : 'Search Carrier Name, MGA, Claims/Service Phone, Email, or Notes...'
                  }
                  className="w-full bg-white text-slate-900 text-[13px] border border-slate-300 border-r-0 pl-9 pr-16 py-1.5 rounded-l-lg focus:outline-hidden focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 h-9 font-sans placeholder-slate-400 transition-all"
                />
                <div className="absolute right-2.5 flex items-center gap-1 z-10">
                  {localInput ? (
                    <button
                      type="button"
                      onClick={handleClearSearch}
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

          {/* Dedicated Toggles + Sort Selector + Admin Action */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Citizens Takeout Toggle */}
            <button
              type="button"
              aria-pressed={citizensTakeoutOnly}
              onClick={onToggleCitizensTakeout}
              className={`h-9 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500/40 ${
                citizensTakeoutOnly
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
              title="Filter carriers participating in Citizens Depopulation / Takeout"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Citizens Takeout</span>
              <span
                className={`text-[10.5px] font-mono px-1.5 py-0.2 rounded-md tabular-nums ${
                  citizensTakeoutOnly ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {stats.citizensTakeoutCount}
              </span>
            </button>

            {/* No CC Fee Toggle */}
            <button
              type="button"
              aria-pressed={noCcFeeOnly}
              onClick={onToggleNoCcFee}
              className={`h-9 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500/40 ${
                noCcFeeOnly
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
              title="Filter carriers with $0 / No Credit Card Surcharge"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>No CC Fee</span>
              <span
                className={`text-[10.5px] font-mono px-1.5 py-0.2 rounded-md tabular-nums ${
                  noCcFeeOnly ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {stats.noFeeCount}
              </span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-slate-300 hover:border-slate-400 focus-within:border-sky-600 focus-within:ring-2 focus-within:ring-sky-500/20 rounded-lg px-3 h-9 shadow-2xs transition-all">
              <ArrowUpDown className="w-3.5 h-3.5 text-sky-700 shrink-0" />
              <label htmlFor="carrier-sort-select" className="text-xs text-slate-500 font-semibold">
                {isSpanish ? 'Ordenar:' : 'Sort:'}
              </label>
              <select
                id="carrier-sort-select"
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as CarrierSortOption)}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer pr-1"
              >
                <option value="name_asc">Carrier Name (A–Z)</option>
                <option value="name_desc">Carrier Name (Z–A)</option>
                <option value="cc_fee_asc">No CC Fee First</option>
                <option value="takeout_first">Citizens Takeout First</option>
              </select>
            </div>

            {onAddNewCarrier && (
              <button
                type="button"
                onClick={onAddNewCarrier}
                className="h-9 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 shadow-xs transition-all"
                title="Add a new carrier shortcut record"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Carrier</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Line of Business (LOB) Filter Chips — Single Horizontal Row with Hidden Overflow */}
        <div className="flex flex-nowrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100 overflow-hidden">
          <div
            className="flex flex-nowrap items-center gap-1.5 overflow-hidden min-w-0 flex-1"
            role="group"
            aria-label={isSpanish ? 'Filtrar por línea de negocio' : 'Filter by Line of Business'}
          >
            <span className="text-[11.5px] font-semibold text-slate-500 mr-0.5 select-none shrink-0 whitespace-nowrap">
              {isSpanish ? 'Línea de Negocio:' : 'Line of Business:'}
            </span>
            {LOB_CHIPS.map((chip) => {
              const isActive = lobFilter === chip.key;
              return (
                <button
                  key={chip.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onLobChange(chip.key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border shrink-0 whitespace-nowrap transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500/40 ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200/90 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {isSpanish ? chip.labelEs : chip.label}
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setLocalInput('');
                onResetFilters();
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap ml-2"
            >
              <RotateCcw className="w-3 h-3 shrink-0" />
              <span>{isSpanish ? 'Restablecer Filtros' : 'Reset All Filters'}</span>
            </button>
          )}
        </div>

        {/* Row 3: Popular Carrier Quick Chips — Single Horizontal Row with Hidden Overflow */}
        <div
          className="flex flex-nowrap items-center gap-1.5 pt-1 overflow-hidden"
          role="group"
          aria-label={isSpanish ? 'Aseguradoras populares' : 'Popular Carriers quick filters'}
        >
          <span className="text-[11.5px] font-semibold text-slate-500 mr-0.5 select-none shrink-0 whitespace-nowrap">
            {isSpanish ? 'Acceso Rápido:' : 'Popular Carriers:'}
          </span>
          {POPULAR_CARRIERS.map((carrierName) => {
            const isSelectedChip =
              searchQuery.trim().toLowerCase() === carrierName.toLowerCase();
            return (
              <button
                key={carrierName}
                type="button"
                aria-pressed={isSelectedChip}
                onClick={() => {
                  const nextVal = isSelectedChip ? '' : carrierName;
                  setLocalInput(nextVal);
                  onSearchChange(nextVal);
                }}
                className={`px-2.5 py-1 rounded-full text-xs cursor-pointer border shrink-0 whitespace-nowrap transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500/40 ${
                  isSelectedChip
                    ? 'bg-sky-600 text-white border-sky-600 font-semibold shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:text-slate-900 font-medium'
                }`}
              >
                {carrierName}
              </button>
            );
          })}
        </div>
      </form>
    </div>
  );
}
