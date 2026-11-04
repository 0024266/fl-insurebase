import React from 'react';
import {
  Table as TableIcon,
  LayoutGrid,
  HelpCircle,
  Keyboard,
  User,
  Check
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { useLanguage } from '../context/LanguageContext';

interface ViewSettingsBarProps {
  onOpenShortcuts: () => void;
  totalCount?: number;
  filteredCount?: number;
}

export function ViewSettingsBar({
  onOpenShortcuts,
  totalCount,
  filteredCount
}: ViewSettingsBarProps) {
  const { isSpanish } = useLanguage();
  const {
    viewMode,
    setViewMode,
    fontSize,
    setFontSize,
    showHelpBanners,
    toggleHelpBanners
  } = usePreferences();

  return (
    <div className="qq-dark-ribbon px-3 sm:px-4 py-1.5 shadow-xs select-none">
      <div className="max-w-[1850px] mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
        {/* Left Section: 'Find / View' controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Label & Icon */}
          <div className="flex items-center gap-1.5 text-white font-bold text-[13px] select-none mr-1">
            <User className="w-3.5 h-3.5 text-white" />
            <span>{isSpanish ? 'Buscar / Vista' : 'Find / View'}</span>
          </div>

          {/* 1. Layout Mode Switcher (Table vs Cards) */}
          <div className="flex items-center bg-[#ffffff] border border-[#777] rounded-[2px] p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2 py-0.5 rounded-[2px] flex items-center gap-1 font-bold text-[11px] transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#286090] text-white shadow-2xs'
                  : 'text-[#333333] hover:text-[#000000]'
              }`}
              title={isSpanish ? 'Modo Tabla' : 'Table View'}
            >
              <TableIcon className="w-3 h-3" />
              <span>{isSpanish ? 'Tabla' : 'Table'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-2 py-0.5 rounded-[2px] flex items-center gap-1 font-bold text-[11px] transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[#286090] text-white shadow-2xs'
                  : 'text-[#333333] hover:text-[#000000]'
              }`}
              title={isSpanish ? 'Modo Tarjetas' : 'Cards Grid View'}
            >
              <LayoutGrid className="w-3 h-3" />
              <span>{isSpanish ? 'Tarjetas' : 'Cards'}</span>
            </button>
          </div>

          {/* 2. Font Size Buttons (A- / A / A+) */}
          <div className="flex items-center bg-[#ffffff] border border-[#777] rounded-[2px] p-0.5 shadow-2xs">
            <span className="px-1.5 text-[10.5px] text-[#555555] font-bold hidden sm:inline select-none">
              {isSpanish ? 'Texto:' : 'Font:'}
            </span>
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded-[2px] font-bold text-[11px] transition-colors cursor-pointer ${
                fontSize === 'normal'
                  ? 'bg-[#286090] text-white shadow-2xs'
                  : 'text-[#333333] hover:bg-[#e8e8e8]'
              }`}
              title={isSpanish ? 'Fuente Estándar (100%)' : 'Standard Font (100%)'}
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded-[2px] font-bold text-[11.5px] transition-colors cursor-pointer ${
                fontSize === 'large'
                  ? 'bg-[#286090] text-white shadow-2xs'
                  : 'text-[#333333] hover:bg-[#e8e8e8]'
              }`}
              title={isSpanish ? 'Fuente Mediana (+10%)' : 'Medium Font (+10%)'}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('xl')}
              className={`px-2 py-0.5 rounded-[2px] font-bold text-[12.5px] transition-colors cursor-pointer ${
                fontSize === 'xl'
                  ? 'bg-[#286090] text-white shadow-2xs'
                  : 'text-[#333333] hover:bg-[#e8e8e8]'
              }`}
              title={isSpanish ? 'Fuente Grande (+20%)' : 'Large Font (+20%)'}
            >
              A+
            </button>
          </div>
        </div>

        {/* Right Section: Guidance Tips & Shortcuts (?) Button */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Help Tips Toggle */}
          <button
            type="button"
            onClick={toggleHelpBanners}
            className={`px-2 py-1 rounded-[2px] border font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs ${
              showHelpBanners
                ? 'bg-[#286090] text-white border-[#1d4567]'
                : 'bg-white text-[#333333] border-[#777777] hover:bg-[#f0f0f0]'
            }`}
            title={isSpanish ? 'Mostrar/ocultar consejos' : 'Show/hide helpful guidance'}
          >
            <HelpCircle className="w-3 h-3" />
            <span>{isSpanish ? 'Consejos' : 'Help Tips'}</span>
            {showHelpBanners && <Check className="w-2.5 h-2.5" />}
          </button>

          {/* Shortcuts Modal Button */}
          <button
            type="button"
            onClick={onOpenShortcuts}
            className="px-2 py-1 bg-white hover:bg-[#f0f0f0] text-[#286090] border border-[#777777] rounded-[2px] font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            title={isSpanish ? 'Abrir referencia de atajos (?)' : 'Open Keyboard Shortcuts Guide (?)'}
          >
            <Keyboard className="w-3 h-3 text-[#286090]" />
            <span>{isSpanish ? 'Atajos (?)' : 'Shortcuts (?)'}</span>
          </button>

          {/* Active Records Count */}
          {totalCount !== undefined && (
            <div className="hidden xl:flex items-center gap-1 pl-2 text-[11px] text-white font-mono border-l border-[#555]">
              <span>{filteredCount ?? totalCount} / {totalCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
