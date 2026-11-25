import React, { useState, useRef, useEffect } from 'react';
import {
  Table as TableIcon,
  LayoutGrid,
  HelpCircle,
  Keyboard,
  Settings,
  Check,
  X,
  Lock,
  LogOut,
  Plus,
  Upload,
  Download,
  Link as LinkIcon,
  FileText,
  Scale,
  ShieldCheck
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { useLanguage } from '../context/LanguageContext';
import { DirectoryMode } from '../types/permits';

interface ViewSettingsBarProps {
  onOpenShortcuts: () => void;
  totalCount?: number;
  filteredCount?: number;
  activeTab?: DirectoryMode;
  onTabChange?: (tab: DirectoryMode) => void;
  isAdmin?: boolean;
  onOpenLogin?: () => void;
  onExitAdmin?: () => void;
  onAddNew?: () => void;
  onOpenImport?: () => void;
  onOpenBulkUpdate?: () => void;
  onExport?: (format: 'json' | 'csv') => void;
  onDownloadWordPressHtml?: () => void;
}

export function ViewSettingsBar({
  onOpenShortcuts,
  totalCount,
  filteredCount,
  activeTab,
  onTabChange,
  isAdmin = false,
  onOpenLogin,
  onExitAdmin,
  onAddNew,
  onOpenImport,
  onOpenBulkUpdate,
  onExport,
  onDownloadWordPressHtml
}: ViewSettingsBarProps) {
  const { t, isSpanish } = useLanguage();
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
        className={`h-8 px-2.5 text-xs flex items-center gap-1.5 font-semibold cursor-pointer transition-all rounded-lg border focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500/40 ${
          isOpen
            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
            : isAdmin
            ? 'bg-amber-50 hover:bg-amber-100/80 text-amber-900 border-amber-300 shadow-2xs'
            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 shadow-2xs'
        }`}
        title={isSpanish ? 'Ajustes de vista, texto y administración' : 'View settings, preferences & admin controls'}
        aria-label={isSpanish ? 'Ajustes de vista y pantalla' : 'View and Display Settings'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Settings className={`w-3.5 h-3.5 ${isOpen ? 'text-white' : isAdmin ? 'text-amber-700' : 'text-slate-600'}`} />
        <span className="hidden sm:inline">{isSpanish ? 'Ajustes' : 'Settings'}</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label={isSpanish ? 'Ajustes de Vista y Pantalla' : 'View & Display Settings'}
          className="absolute right-0 top-full mt-1.5 w-76 sm:w-84 max-w-[calc(100vw-1.5rem)] sm:max-w-md max-h-[85vh] overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-xl p-4 z-50 text-xs text-slate-800 select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-sky-700" />
              <span className="font-bold text-[13px] text-slate-900">
                {isSpanish ? 'Ajustes y Preferencias' : 'Settings & Controls'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {totalCount !== undefined && (
                <span className="text-[11px] font-mono font-medium text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md tabular-nums">
                  {filteredCount ?? totalCount} / {totalCount}
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 cursor-pointer transition-colors"
                aria-label={isSpanish ? 'Cerrar ajustes' : 'Close settings'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-3.5">
            {/* 1. View Mode Switcher (Table / Cards) */}
            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {isSpanish ? 'Modo de Vista' : 'View Mode'}
              </span>
              <div className="grid grid-cols-2 gap-1 bg-slate-100 border border-slate-200/80 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`py-1.5 px-2.5 rounded-md flex items-center justify-center gap-1.5 font-semibold text-xs transition-all cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>{isSpanish ? 'Tabla' : 'Table'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`py-1.5 px-2.5 rounded-md flex items-center justify-center gap-1.5 font-semibold text-xs transition-all cursor-pointer ${
                    viewMode === 'cards'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>{isSpanish ? 'Tarjetas' : 'Cards'}</span>
                </button>
              </div>
            </div>

            {/* 2. Font Size Controls (A-, A, A+) */}
            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {isSpanish ? 'Tamaño de Texto' : 'Font Size'}
              </span>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 border border-slate-200/80 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setFontSize('normal')}
                  className={`py-1.5 px-2 rounded-md font-semibold text-xs transition-all cursor-pointer ${
                    fontSize === 'normal'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={isSpanish ? 'Fuente Estándar (100%)' : 'Standard Font (100%)'}
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('large')}
                  className={`py-1.5 px-2 rounded-md font-semibold text-xs transition-all cursor-pointer ${
                    fontSize === 'large'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={isSpanish ? 'Fuente Mediana (+10%)' : 'Medium Font (+10%)'}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('xl')}
                  className={`py-1.5 px-2 rounded-md font-semibold text-xs transition-all cursor-pointer ${
                    fontSize === 'xl'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={isSpanish ? 'Fuente Grande (+20%)' : 'Large Font (+20%)'}
                >
                  A+
                </button>
              </div>
            </div>

            {/* 3. Table Density Toggle (Compact / Normal) */}
            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {isSpanish ? 'Densidad de Tabla' : 'Table Density'}
              </span>
              <div className="grid grid-cols-2 gap-1 bg-slate-100 border border-slate-200/80 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setCompactView(true)}
                  className={`py-1.5 px-2.5 rounded-md font-semibold text-xs transition-all cursor-pointer ${
                    compactView
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isSpanish ? 'Compacta' : 'Compact'}
                </button>
                <button
                  type="button"
                  onClick={() => setCompactView(false)}
                  className={`py-1.5 px-2.5 rounded-md font-semibold text-xs transition-all cursor-pointer ${
                    !compactView
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isSpanish ? 'Normal' : 'Normal'}
                </button>
              </div>
            </div>

            {/* 4. Help Tips & Keyboard Shortcuts (?) */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={toggleHelpBanners}
                className={`py-1.5 px-2.5 rounded-lg border font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  showHelpBanners
                    ? 'bg-sky-50 text-sky-800 border-sky-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
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
                className="py-1.5 px-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title={isSpanish ? 'Abrir referencia de atajos (?)' : 'Open Keyboard Shortcuts Guide (?)'}
              >
                <Keyboard className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{isSpanish ? 'Atajos (?)' : 'Shortcuts (?)'}</span>
              </button>
            </div>

            {/* 5. Legal Disclaimer Secondary Menu Link */}
            {onTabChange && (
              <div className="pt-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onTabChange('disclaimer');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer font-medium text-xs ${
                    activeTab === 'disclaimer'
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5 opacity-80" />
                    <span>{t('tabDisclaimer')}</span>
                  </span>
                </button>
              </div>
            )}

            {/* 6. Consolidated Administrator Login / Controls */}
            <div className="pt-2.5 border-t border-slate-100">
              {isAdmin ? (
                <div className="space-y-1">
                  <div className="px-2 py-1 flex items-center gap-1.5 text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isSpanish ? 'Controles de Administrador' : 'Administrator Controls'}</span>
                  </div>

                  {onAddNew && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onAddNew();
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 rounded-lg cursor-pointer text-sky-700 font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5 text-sky-700" />
                      <span>
                        {activeTab === 'property'
                          ? 'Add Florida Property Record'
                          : activeTab === 'carriers'
                          ? 'Add Carrier Shortcut Record'
                          : 'Add Mortgagee Record'}
                      </span>
                    </button>
                  )}

                  {onOpenImport && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onOpenImport();
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 rounded-lg cursor-pointer text-slate-700 font-medium"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Import CSV / JSON</span>
                    </button>
                  )}

                  {onOpenBulkUpdate && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onOpenBulkUpdate();
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 rounded-lg cursor-pointer text-amber-800 font-semibold"
                    >
                      <LinkIcon className="w-3.5 h-3.5 text-amber-600" />
                      <span>Bulk Update Links</span>
                    </button>
                  )}

                  {onExport && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onExport('json');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 rounded-lg cursor-pointer text-slate-700 font-medium"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Export Backup (JSON)</span>
                    </button>
                  )}

                  {onDownloadWordPressHtml && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onDownloadWordPressHtml();
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 rounded-lg cursor-pointer text-sky-800 font-semibold"
                    >
                      <FileText className="w-3.5 h-3.5 text-sky-600" />
                      <span>Download Standalone App</span>
                    </button>
                  )}

                  {onExitAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onExitAdmin();
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-700 flex items-center gap-2 rounded-lg cursor-pointer font-semibold mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('adminLogout')}</span>
                    </button>
                  )}
                </div>
              ) : (
                onOpenLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenLogin();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 rounded-lg cursor-pointer text-slate-700 hover:text-slate-900 font-semibold transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t('adminLogin')}</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
