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
  { key: 'all', label: 'All', labelEs: 'Todos' },
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
    <div className="bg-white border border-[#d5d5d5] rounded-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-3 sm:p-4 mb-3 text-[#222222]">
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
        {/* Top Row: Search Input + Dedicated Toggles + Sort + Admin Add */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-3 justify-between">
          {/* Search Input */}
          <div className="flex-1 max-w-2xl">
            <label
              htmlFor="global-search-input"
              className="block text-[#333333] text-[12px] font-bold mb-1 select-none"
            >
              {isSpanish
                ? 'Buscar Aseguradora, Portal de Pago, Teléfono o Notas'
                : 'Search Insurance Carrier, Payment Portal, Phone, or Notes'}
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
                    onSearchChange(val);
                  }}
                  placeholder={
                    isSpanish
                      ? 'Ej. Citizens, Slide, American Integrity, 800-748-2030...'
                      : 'Search Carrier Name, Other Names, Claims/Service Phone, Email, or Notes...'
                  }
                  className="w-full bg-white text-[#222222] text-[13px] border border-[#b0b0b0] border-r-0 pl-9 pr-14 py-1 rounded-l-[2px] focus:outline-hidden focus:border-[#286090] focus:ring-1 focus:ring-[#286090]/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] h-[32px] font-sans placeholder-[#888888]"
                />
                <div className="absolute right-2 flex items-center gap-1 z-10">
                  {localInput ? (
                    <button
                      type="button"
                      onClick={handleClearSearch}
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

          {/* Dedicated Toggles + Sort Selector + Admin Action */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Citizens Takeout Toggle */}
            <button
              type="button"
              onClick={onToggleCitizensTakeout}
              className={`h-[32px] px-2.5 rounded-[2px] text-[11.5px] font-bold flex items-center gap-1.5 cursor-pointer border transition-colors ${
                citizensTakeoutOnly
                  ? 'bg-[#286090] text-white border-[#204d74] shadow-2xs'
                  : 'bg-[#f8f9fa] text-[#333333] border-[#b0b0b0] hover:bg-[#e9ecef]'
              }`}
              title="Filter carriers participating in Citizens Depopulation / Takeout"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Citizens Takeout</span>
              <span
                className={`text-[10px] font-mono px-1 rounded ${
                  citizensTakeoutOnly ? 'bg-white/20 text-white' : 'bg-[#e2e8f0] text-[#444]'
                }`}
              >
                {stats.citizensTakeoutCount}
              </span>
            </button>

            {/* No CC Fee Toggle */}
            <button
              type="button"
              onClick={onToggleNoCcFee}
              className={`h-[32px] px-2.5 rounded-[2px] text-[11.5px] font-bold flex items-center gap-1.5 cursor-pointer border transition-colors ${
                noCcFeeOnly
                  ? 'bg-[#1e7e34] text-white border-[#19692c] shadow-2xs'
                  : 'bg-[#f8f9fa] text-[#333333] border-[#b0b0b0] hover:bg-[#e9ecef]'
              }`}
              title="Filter carriers with $0 / No Credit Card Surcharge"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>No CC Fee</span>
              <span
                className={`text-[10px] font-mono px-1 rounded ${
                  noCcFeeOnly ? 'bg-white/20 text-white' : 'bg-[#e2e8f0] text-[#444]'
                }`}
              >
                {stats.noFeeCount}
              </span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#f8f9fa] border border-[#b0b0b0] rounded-[2px] px-2 h-[32px]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#555555] shrink-0" />
              <label htmlFor="carrier-sort-select" className="text-[11px] text-[#555555] font-semibold">
                {isSpanish ? 'Ordenar:' : 'Sort:'}
              </label>
              <select
                id="carrier-sort-select"
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as CarrierSortOption)}
                className="bg-transparent text-[12px] font-bold text-[#222222] focus:outline-hidden cursor-pointer pr-1"
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
                className="qq-btn-green h-[32px] px-3 text-[11.5px] font-bold flex items-center gap-1 cursor-pointer rounded-[2px]"
                title="Add a new insurance carrier record"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Carrier</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Line of Business (LOB) Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#eeeeee]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#555555] uppercase tracking-wider mr-1">
              {isSpanish ? 'Línea de Negocio:' : 'Line of Business:'}
            </span>
            {LOB_CHIPS.map((chip) => {
              const isActive = lobFilter === chip.key;
              return (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => onLobChange(chip.key)}
                  className={`px-2.5 py-1 rounded-[2px] text-[11.5px] font-bold cursor-pointer border transition-colors ${
                    isActive
                      ? 'bg-[#286090] text-white border-[#204d74] shadow-2xs'
                      : 'bg-[#f4f6f8] text-[#333333] border-[#d0d7de] hover:bg-[#e8ecf1]'
                  }`}
                >
                  [{isSpanish ? chip.labelEs : chip.label}]
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
              className="text-[11.5px] font-bold text-[#a94442] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isSpanish ? 'Restablecer Filtros' : 'Reset All Filters'}</span>
            </button>
          )}
        </div>

        {/* Row 3: Popular Carrier Quick Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-[#666666] mr-1">
            {isSpanish ? 'Acceso Rápido:' : 'Popular Carriers:'}
          </span>
          {POPULAR_CARRIERS.map((carrierName) => {
            const isSelectedChip =
              searchQuery.trim().toLowerCase() === carrierName.toLowerCase();
            return (
              <button
                key={carrierName}
                type="button"
                onClick={() => {
                  const nextVal = isSelectedChip ? '' : carrierName;
                  setLocalInput(nextVal);
                  onSearchChange(nextVal);
                }}
                className={`px-2 py-0.5 rounded-[2px] text-[11px] cursor-pointer border transition-colors ${
                  isSelectedChip
                    ? 'bg-[#ef6c00] text-white border-[#d84315] font-bold'
                    : 'bg-white text-[#286090] border-[#cbd5e1] hover:bg-[#f0f7ff] font-medium'
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
