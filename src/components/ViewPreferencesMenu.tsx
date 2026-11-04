import React, { useState, useRef, useEffect } from 'react';
import {
  SlidersHorizontal,
  HelpCircle,
  Keyboard,
  MessageSquareText,
  Eye,
  LayoutGrid,
  Table as TableIcon,
  Check,
  Sparkles,
  Command
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { useLanguage } from '../context/LanguageContext';

interface ViewPreferencesMenuProps {
  onOpenShortcuts?: () => void;
}

export function ViewPreferencesMenu({ onOpenShortcuts }: ViewPreferencesMenuProps) {
  const { isSpanish } = useLanguage();
  const {
    showHelpBanners,
    toggleHelpBanners,
    showTooltips,
    toggleTooltips,
    enableShortcuts,
    toggleShortcuts,
    compactView,
    toggleCompactView,
    viewMode,
    toggleViewMode,
    fontSize,
    cycleFontSize
  } = usePreferences();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="qq-btn-secondary py-1 px-2 text-[11.5px] flex items-center gap-1.5 font-bold cursor-pointer shadow-xs whitespace-nowrap"
        title={isSpanish ? 'Opciones de visualización, ayuda, tooltips y atajos' : 'View options, help banners, tooltips & shortcut settings'}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-[#1f4e79]" />
        <span className="hidden sm:inline text-[#1f4e79] font-medium text-[11.5px]">
          {isSpanish ? 'Vista' : 'View'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-76 sm:w-80 bg-white rounded-[6px] shadow-2xl border border-[#cbd5e1] z-50 text-[#222] animate-in fade-in zoom-in-95 duration-100 overflow-hidden text-xs">
          <div className="px-3.5 py-2.5 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-[#1f4e79] text-[12.5px]">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isSpanish ? 'Preferencias de Vista y Ayuda' : 'View, Help & Tooltips'}</span>
            </div>
            <span className="text-[10px] text-[#64748b] bg-white px-2 py-0.5 rounded border border-[#e2e8f0] font-medium">
              {isSpanish ? 'Ajustes' : 'Settings'}
            </span>
          </div>

          <div className="p-2 space-y-1.5 divide-y divide-[#f1f5f9]">
            {/* 1. Toggle Help Banners */}
            <div className="pt-1.5 first:pt-0">
              <button
                type="button"
                onClick={toggleHelpBanners}
                className="w-full text-left px-2.5 py-1.5 rounded-[4px] flex items-center justify-between hover:bg-[#f1f5f9] transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-2 min-w-0 pr-2">
                  <HelpCircle className="w-4 h-4 text-[#004b91] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[12px] text-[#1e293b] flex items-center gap-1.5">
                      <span>{isSpanish ? 'Instrucciones y Consejos' : 'Help & Guidance Tips'}</span>
                      {showHelpBanners && (
                        <span className="text-[9px] px-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                          {isSpanish ? 'Activo' : 'On'}
                        </span>
                      )}
                    </div>
                    <div className="text-[10.5px] text-[#64748b]">
                      {isSpanish ? 'Mostrar barra de consejos en búsquedas' : 'Show helpful search tips and instructions'}
                    </div>
                  </div>
                </div>
                <div
                  className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors shrink-0 ${
                    showHelpBanners ? 'bg-[#004b91]' : 'bg-[#cbd5e1]'
                  }`}
                >
                  <div
                    className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                      showHelpBanners ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* 2. Toggle Tooltips & Shortcut Badges */}
            <div className="pt-1.5">
              <button
                type="button"
                onClick={toggleTooltips}
                className="w-full text-left px-2.5 py-1.5 rounded-[4px] flex items-center justify-between hover:bg-[#f1f5f9] transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-2 min-w-0 pr-2">
                  <MessageSquareText className="w-4 h-4 text-[#004b91] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[12px] text-[#1e293b] flex items-center gap-1.5">
                      <span>{isSpanish ? 'Insignias de Teclas / Tooltips' : 'Tooltips & Shortcut Badges'}</span>
                      {showTooltips && (
                        <span className="text-[9px] px-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                          {isSpanish ? 'Activo' : 'On'}
                        </span>
                      )}
                    </div>
                    <div className="text-[10.5px] text-[#64748b]">
                      {isSpanish ? 'Mostrar teclas Ctrl+K y badges de atajos' : 'Show Ctrl+K / Esc badges in search bars'}
                    </div>
                  </div>
                </div>
                <div
                  className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors shrink-0 ${
                    showTooltips ? 'bg-[#004b91]' : 'bg-[#cbd5e1]'
                  }`}
                >
                  <div
                    className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                      showTooltips ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* 3. Toggle Keyboard Shortcuts */}
            <div className="pt-1.5">
              <button
                type="button"
                onClick={toggleShortcuts}
                className="w-full text-left px-2.5 py-1.5 rounded-[4px] flex items-center justify-between hover:bg-[#f1f5f9] transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-2 min-w-0 pr-2">
                  <Keyboard className="w-4 h-4 text-[#004b91] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[12px] text-[#1e293b] flex items-center gap-1.5">
                      <span>{isSpanish ? 'Atajos de Teclado' : 'Keyboard Shortcuts'}</span>
                      {enableShortcuts && (
                        <span className="text-[9px] px-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                          {isSpanish ? 'Habilitado' : 'Active'}
                        </span>
                      )}
                    </div>
                    <div className="text-[10.5px] text-[#64748b]">
                      {isSpanish ? 'Navegación con flechas, teclas 1/2/3 y ?' : 'Arrow keys, 1/2/3 tabs, Alt+C copy, ? guide'}
                    </div>
                  </div>
                </div>
                <div
                  className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors shrink-0 ${
                    enableShortcuts ? 'bg-[#004b91]' : 'bg-[#cbd5e1]'
                  }`}
                >
                  <div
                    className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                      enableShortcuts ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* 4. Table vs Card Grid Layout Toggle */}
            <div className="pt-1.5">
              <button
                type="button"
                onClick={toggleViewMode}
                className="w-full text-left px-2.5 py-1.5 rounded-[4px] flex items-center justify-between hover:bg-[#f1f5f9] transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-2 min-w-0 pr-2">
                  {viewMode === 'cards' ? (
                    <LayoutGrid className="w-4 h-4 text-[#004b91] shrink-0 mt-0.5" />
                  ) : (
                    <TableIcon className="w-4 h-4 text-[#004b91] shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold text-[12px] text-[#1e293b]">
                      {isSpanish ? 'Diseño: Tabla / Tarjetas' : 'Display: Table vs Cards'}
                    </div>
                    <div className="text-[10.5px] text-[#64748b]">
                      {viewMode === 'cards'
                        ? isSpanish ? 'Modo Tarjetas (ideal para pantallas móviles)' : 'Card Grid Mode (mobile-optimized)'
                        : isSpanish ? 'Modo Tabla Clásica' : 'Classic Table Grid Mode'}
                    </div>
                  </div>
                </div>
                <span className="text-[10.5px] font-bold px-2 py-0.5 bg-[#e0ecf8] text-[#004b91] rounded-[3px] border border-[#c2d7ed]">
                  {viewMode === 'cards' ? (isSpanish ? 'Tarjetas' : 'Cards') : (isSpanish ? 'Tabla' : 'Table')}
                </span>
              </button>
            </div>

            {/* 5. Compact Table Density Toggle */}
            <div className="pt-1.5">
              <button
                type="button"
                onClick={toggleCompactView}
                className="w-full text-left px-2.5 py-1.5 rounded-[4px] flex items-center justify-between hover:bg-[#f1f5f9] transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-2 min-w-0 pr-2">
                  <Eye className="w-4 h-4 text-[#004b91] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[12px] text-[#1e293b]">
                      {isSpanish ? 'Densidad Compacta' : 'Compact Table Density'}
                    </div>
                    <div className="text-[10.5px] text-[#64748b]">
                      {isSpanish ? 'Más filas visibles en pantalla' : 'Higher row density for quick skimming'}
                    </div>
                  </div>
                </div>
                <div
                  className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors shrink-0 ${
                    compactView ? 'bg-[#004b91]' : 'bg-[#cbd5e1]'
                  }`}
                >
                  <div
                    className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                      compactView ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* 6. Font Size Scale Option */}
            <div className="pt-1.5">
              <button
                type="button"
                onClick={cycleFontSize}
                className="w-full text-left px-2.5 py-1.5 rounded-[4px] flex items-center justify-between hover:bg-[#f1f5f9] transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-2 min-w-0 pr-2">
                  <Sparkles className="w-4 h-4 text-[#004b91] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[12px] text-[#1e293b]">
                      {isSpanish ? 'Tamaño de Fuente' : 'Font Size Scale'}
                    </div>
                    <div className="text-[10.5px] text-[#64748b]">
                      {fontSize === 'xl'
                        ? isSpanish ? 'Extra Grande (A+)' : 'Extra Large (A+)'
                        : fontSize === 'large'
                        ? isSpanish ? 'Grande / Estándar (A)' : 'Large / Standard (A)'
                        : isSpanish ? 'Compacto (A-)' : 'Compact (A-)'}
                    </div>
                  </div>
                </div>
                <span className="text-[10.5px] font-bold px-2 py-0.5 bg-[#e0ecf8] text-[#004b91] rounded-[3px] border border-[#c2d7ed]">
                  {fontSize === 'xl' ? 'A+' : fontSize === 'large' ? 'A' : 'A-'}
                </span>
              </button>
            </div>
          </div>

          {/* Footer Shortcuts Guide Quick Link */}
          {onOpenShortcuts && (
            <div className="p-2 bg-[#f8fafc] border-t border-[#e2e8f0]">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenShortcuts();
                }}
                className="w-full py-1.5 px-3 bg-[#eef4fb] hover:bg-[#dfeaf8] text-[#004b91] font-semibold text-[11.5px] rounded-[4px] border border-[#c6daef] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>{isSpanish ? 'Ver Todos los Atajos de Teclado (?)' : 'View Keyboard Shortcuts Guide (?)'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
