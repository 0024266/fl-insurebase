import React, { useState, useRef, useEffect } from 'react';
import {
  Table as TableIcon,
  LayoutGrid,
  HelpCircle,
  Keyboard,
  Settings,
  Check,
  X
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
    compactView,
    setCompactView,
    showHelpBanners,
    toggleHelpBanners
  } = usePreferences();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`py-1 px-2 text-[11.5px] flex items-center gap-1 font-bold cursor-pointer transition-all shadow-xs rounded-[3px] border ${
          isOpen
            ? 'bg-[#286090] text-white border-[#1f4e79]'
            : 'qq-btn-silver text-[#333] border-[#b0b0b0]'
        }`}
        title={isSpanish ? 'Ajustes de vista, texto y densidad' : 'View, font size & density settings'}
        aria-label={isSpanish ? 'Ajustes de vista y pantalla' : 'View and Display Settings'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Settings className={`w-3.5 h-3.5 ${isOpen ? 'text-white' : 'text-[#286090]'}`} />
        <span className="hidden sm:inline">{isSpanish ? 'Ajustes' : 'Settings'}</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label={isSpanish ? 'Ajustes de Vista y Pantalla' : 'View & Display Settings'}
          className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 bg-white rounded-[4px] border border-[#cbd5e0] shadow-xl p-3.5 z-50 text-[12px] text-[#222222] select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#e2e8f0]">
            <div className="flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-[#286090]" />
              <span className="font-bold text-[12.5px] text-[#111111]">
                {isSpanish ? 'Vista y Pantalla' : 'View & Display Settings'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {totalCount !== undefined && (
                <span className="text-[10.5px] font-mono text-[#555555] bg-[#f4f6f8] border border-[#d0d7de] px-1.5 py-0.5 rounded-[2px]">
                  {filteredCount ?? totalCount} / {totalCount}
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[#666666] hover:text-[#111111] p-0.5 rounded-[2px] cursor-pointer"
                aria-label={isSpanish ? 'Cerrar ajustes' : 'Close settings'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {/* 1. View Mode Switcher (Table / Cards) */}
            <div>
              <span className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1">
                {isSpanish ? 'Modo de Vista' : 'View Mode'}
              </span>
              <div className="grid grid-cols-2 gap-1 bg-[#f4f6f8] border border-[#d0d7de] rounded-[3px] p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`py-1 px-2 rounded-[2px] flex items-center justify-center gap-1.5 font-bold text-[11.5px] transition-colors cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-[#286090] text-white shadow-2xs'
                      : 'text-[#333333] hover:bg-white/70'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>{isSpanish ? 'Tabla' : 'Table'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`py-1 px-2 rounded-[2px] flex items-center justify-center gap-1.5 font-bold text-[11.5px] transition-colors cursor-pointer ${
                    viewMode === 'cards'
                      ? 'bg-[#286090] text-white shadow-2xs'
                      : 'text-[#333333] hover:bg-white/70'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>{isSpanish ? 'Tarjetas' : 'Cards'}</span>
                </button>
              </div>
            </div>

            {/* 2. Font Size Controls (A-, A, A+) */}
            <div>
              <span className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1">
                {isSpanish ? 'Tamaño de Texto' : 'Font Size'}
              </span>
              <div className="grid grid-cols-3 gap-1 bg-[#f4f6f8] border border-[#d0d7de] rounded-[3px] p-0.5">
                <button
                  type="button"
                  onClick={() => setFontSize('normal')}
                  className={`py-1 px-2 rounded-[2px] font-bold text-[11.5px] transition-colors cursor-pointer ${
                    fontSize === 'normal'
                      ? 'bg-[#286090] text-white shadow-2xs'
                      : 'text-[#333333] hover:bg-white/70'
                  }`}
                  title={isSpanish ? 'Fuente Estándar (100%)' : 'Standard Font (100%)'}
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('large')}
                  className={`py-1 px-2 rounded-[2px] font-bold text-[12px] transition-colors cursor-pointer ${
                    fontSize === 'large'
                      ? 'bg-[#286090] text-white shadow-2xs'
                      : 'text-[#333333] hover:bg-white/70'
                  }`}
                  title={isSpanish ? 'Fuente Mediana (+10%)' : 'Medium Font (+10%)'}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('xl')}
                  className={`py-1 px-2 rounded-[2px] font-bold text-[12.5px] transition-colors cursor-pointer ${
                    fontSize === 'xl'
                      ? 'bg-[#286090] text-white shadow-2xs'
                      : 'text-[#333333] hover:bg-white/70'
                  }`}
                  title={isSpanish ? 'Fuente Grande (+20%)' : 'Large Font (+20%)'}
                >
                  A+
                </button>
              </div>
            </div>

            {/* 3. Table Density Toggle (Compact / Normal) */}
            <div>
              <span className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1">
                {isSpanish ? 'Densidad de Tabla' : 'Table Density'}
              </span>
              <div className="grid grid-cols-2 gap-1 bg-[#f4f6f8] border border-[#d0d7de] rounded-[3px] p-0.5">
                <button
                  type="button"
                  onClick={() => setCompactView(true)}
                  className={`py-1 px-2 rounded-[2px] font-bold text-[11.5px] transition-colors cursor-pointer ${
                    compactView
                      ? 'bg-[#286090] text-white shadow-2xs'
                      : 'text-[#333333] hover:bg-white/70'
                  }`}
                >
                  {isSpanish ? 'Compacta' : 'Compact'}
                </button>
                <button
                  type="button"
                  onClick={() => setCompactView(false)}
                  className={`py-1 px-2 rounded-[2px] font-bold text-[11.5px] transition-colors cursor-pointer ${
                    !compactView
                      ? 'bg-[#286090] text-white shadow-2xs'
                      : 'text-[#333333] hover:bg-white/70'
                  }`}
                >
                  {isSpanish ? 'Normal' : 'Normal'}
                </button>
              </div>
            </div>

            {/* 4. Help Tips & Keyboard Shortcuts (?) */}
            <div className="pt-2.5 border-t border-[#e2e8f0] grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={toggleHelpBanners}
                className={`py-1.5 px-2 rounded-[3px] border font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  showHelpBanners
                    ? 'bg-[#edf4ff] text-[#0052cc] border-[#b0d0ff]'
                    : 'bg-white text-[#444444] border-[#cbd5e0] hover:bg-[#f4f6f8]'
                }`}
                title={isSpanish ? 'Mostrar/ocultar consejos' : 'Show/hide helpful guidance'}
              >
                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{isSpanish ? 'Consejos' : 'Help Tips'}</span>
                {showHelpBanners && <Check className="w-3 h-3 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenShortcuts();
                }}
                className="py-1.5 px-2 bg-white hover:bg-[#f4f6f8] text-[#286090] border border-[#cbd5e0] rounded-[3px] font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                title={isSpanish ? 'Abrir referencia de atajos (?)' : 'Open Keyboard Shortcuts Guide (?)'}
              >
                <Keyboard className="w-3.5 h-3.5 text-[#286090] shrink-0" />
                <span>{isSpanish ? 'Atajos (?)' : 'Shortcuts (?)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

