import React, { useState, useRef, useEffect } from 'react';
import {
  Lock,
  LogOut,
  Plus,
  Upload,
  Download,
  Link as LinkIcon,
  ChevronDown,
  Building2,
  FileText,
  Landmark,
  Shield,
  ShieldCheck,
  Menu,
  MessageSquarePlus,
  Share2,
  Check,
  User,
  Sparkles
} from 'lucide-react';
import { DirectoryMode } from '../types/permits';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { Logo } from './Logo';

interface HeaderProps {
  activeTab: DirectoryMode;
  onTabChange: (tab: DirectoryMode) => void;
  totalCount: number;
  filteredCount: number;
  isAdmin: boolean;
  onOpenLogin: () => void;
  onExitAdmin: () => void;
  onOpenFeedback: () => void;
  onShare?: () => void;
  onOpenShortcuts?: () => void;
  onAddNew?: () => void;
  onOpenImport?: () => void;
  onOpenBulkUpdate?: () => void;
  onExport?: (format: 'json' | 'csv') => void;
  onDownloadWordPressHtml?: () => void;
}

export function Header({
  activeTab,
  onTabChange,
  totalCount,
  filteredCount,
  isAdmin,
  onOpenLogin,
  onExitAdmin,
  onOpenFeedback,
  onShare,
  onAddNew,
  onOpenImport,
  onOpenBulkUpdate,
  onExport,
  onDownloadWordPressHtml
}: HeaderProps) {
  const { t, isSpanish } = useLanguage();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isShareCopied, setIsShareCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAdminMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShareClick = () => {
    if (onShare) {
      onShare();
      setIsShareCopied(true);
      setTimeout(() => setIsShareCopied(false), 2000);
    }
  };

  return (
    <header className="qq-top-header select-none sticky top-0 z-40">
      <div className="max-w-[1850px] mx-auto px-3 sm:px-4 py-1.5 flex items-center justify-between gap-3">
        {/* Left Section: QQCatalyst Orange Logo & Top Navigation Links */}
        <div className="flex items-center gap-3 lg:gap-5 min-w-0">
          {/* Brand Logo: Clean FL InsureBase vector emblem & lockup */}
          <Logo onTabChange={onTabChange} />

          {/* Directory Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 text-xs font-sans shrink-0 whitespace-nowrap" aria-label="Directory Navigation">
            {/* 1. Mortgagees & Loss Payees */}
            <button
              type="button"
              onClick={() => onTabChange('mortgages')}
              className={`transition-all flex items-center gap-1 cursor-pointer py-1 px-2.5 rounded-[3px] text-[12.5px] font-bold shrink-0 whitespace-nowrap ${
                activeTab === 'mortgages'
                  ? 'qq-nav-link-active'
                  : 'qq-nav-link hover:underline'
              }`}
            >
              <span>{t('tabMortgages')}</span>
              {activeTab === 'mortgages' && (
                <span className="text-[9px] ml-0.5 opacity-90">▼</span>
              )}
            </button>

            {/* 2. Florida Property Records & Permits */}
            <button
              type="button"
              onClick={() => onTabChange('property')}
              className={`transition-all flex items-center gap-1 cursor-pointer py-1 px-2.5 rounded-[3px] text-[12.5px] font-bold shrink-0 whitespace-nowrap ${
                activeTab === 'property'
                  ? 'qq-nav-link-active'
                  : 'qq-nav-link hover:underline'
              }`}
            >
              <span>{t('tabPermits')}</span>
              {activeTab === 'property' && (
                <span className="text-[9px] ml-0.5 opacity-90">▼</span>
              )}
            </button>

            {/* 3. Insurance Carriers */}
            <button
              type="button"
              onClick={() => onTabChange('carriers')}
              className={`transition-all flex items-center gap-1 cursor-pointer py-1 px-2.5 rounded-[3px] text-[12.5px] font-bold shrink-0 whitespace-nowrap ${
                activeTab === 'carriers'
                  ? 'qq-nav-link-active'
                  : 'qq-nav-link hover:underline'
              }`}
            >
              <span>{isSpanish ? 'Aseguradoras' : 'Insurance Carriers'}</span>
              {activeTab === 'carriers' && (
                <span className="text-[9px] ml-0.5 opacity-90">▼</span>
              )}
            </button>

            {/* 4. Legal Disclaimer */}
            <button
              type="button"
              onClick={() => onTabChange('disclaimer')}
              className={`transition-all flex items-center gap-1 cursor-pointer py-1 px-2.5 rounded-[3px] text-[12.5px] font-bold shrink-0 whitespace-nowrap ${
                activeTab === 'disclaimer'
                  ? 'qq-nav-link-active'
                  : 'qq-nav-link hover:underline'
              }`}
            >
              <span>{t('tabDisclaimer')}</span>
              {activeTab === 'disclaimer' && (
                <span className="text-[9px] ml-0.5 opacity-90">▼</span>
              )}
            </button>
          </nav>

          {/* Mobile Directory Selector (Dropdown for screens < lg) */}
          <div className="lg:hidden shrink-0">
            <select
              value={activeTab}
              onChange={(e) => onTabChange(e.target.value as DirectoryMode)}
              className="bg-white text-[#286090] font-bold text-xs py-1 px-2 rounded-[3px] border border-[#b8b8b8] shadow-xs cursor-pointer focus:ring-1 focus:ring-[#286090] max-w-[170px]"
            >
              <option value="mortgages">{t('tabMortgages')}</option>
              <option value="property">{t('tabPermits')}</option>
              <option value="carriers">
                {isSpanish ? 'Aseguradoras' : 'Insurance Carriers'}
              </option>
              <option value="disclaimer">{t('tabDisclaimer')}</option>
            </select>
          </div>
        </div>

        {/* Right Section: Share Button, Language Selector, User Profile & Admin */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-xs">
          {/* Share Button */}
          <button
            type="button"
            onClick={handleShareClick}
            className={`py-1 px-2 text-[11.5px] flex items-center gap-1 font-bold cursor-pointer transition-all shadow-xs rounded-[3px] ${
              isShareCopied
                ? 'bg-emerald-600 text-white border border-emerald-500'
                : 'qq-btn-silver text-[#333]'
            }`}
            title={t('btnShareTooltip')}
          >
            {isShareCopied ? (
              <>
                <Check className="w-3 h-3 stroke-[2.5]" />
                <span className="hidden xs:inline">{t('btnShareCopied')}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3 h-3 text-[#286090]" />
                <span className="hidden xs:inline">{t('btnShare')}</span>
              </>
            )}
          </button>

          {/* Bilingual Language Selector */}
          <LanguageSelector />

          {/* Update / Add Info Button */}
          <button
            type="button"
            onClick={onOpenFeedback}
            className="qq-btn-green py-1 px-2.5 text-[11.5px] flex items-center gap-1 font-bold cursor-pointer shadow-xs whitespace-nowrap"
            title={t('btnAddCorrectTooltip')}
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('btnAddCorrect')}</span>
            <span className="sm:hidden hidden xs:inline">Update</span>
          </button>

          {/* Hamburger Menu (Admin Controls / Admin Login) */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsAdminMenuOpen((prev) => !prev)}
              className={`p-1.5 rounded-[3px] border transition-colors cursor-pointer flex items-center justify-center shadow-xs ${
                isAdmin
                  ? 'bg-[#286090] text-white border-[#1f4e79]'
                  : 'bg-white hover:bg-[#f0f0f0] text-[#333] border-[#b0b0b0]'
              }`}
              title={isAdmin ? "Administrator Controls" : "Menu & Admin Login"}
              aria-label="Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {isAdminMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-60 bg-white rounded-[3px] border border-[#cbd5e0] shadow-xl py-1 z-50 text-[12px] text-[#2d3748] divide-y divide-[#e2e8f0]">
                {isAdmin ? (
                  <>
                    <div className="px-3 py-2 bg-[#f8f9fa]">
                      <div className="font-bold text-[#111]">Administrator Controls</div>
                      <div className="text-[11px] text-[#666]">Record editing & management</div>
                    </div>

                    <div className="p-1">
                      {onAddNew && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsAdminMenuOpen(false);
                            onAddNew();
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#edf2f7] flex items-center gap-2 rounded-[2px] cursor-pointer text-[#286090] font-semibold"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#286090]" />
                          <span>
                            {activeTab === 'property'
                              ? 'Add Florida Property Record'
                              : activeTab === 'carriers'
                              ? 'Add Insurance Carrier Record'
                              : 'Add Mortgagee Record'}
                          </span>
                        </button>
                      )}

                      {onOpenImport && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsAdminMenuOpen(false);
                            onOpenImport();
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#edf2f7] flex items-center gap-2 rounded-[2px] cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#555]" />
                          <span>Import CSV / JSON</span>
                        </button>
                      )}

                      {onOpenBulkUpdate && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsAdminMenuOpen(false);
                            onOpenBulkUpdate();
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#edf2f7] flex items-center gap-2 rounded-[2px] cursor-pointer text-amber-900 font-semibold"
                        >
                          <LinkIcon className="w-3.5 h-3.5 text-amber-700" />
                          <span>Bulk Update Links</span>
                        </button>
                      )}

                      {onExport && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsAdminMenuOpen(false);
                            onExport('json');
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#edf2f7] flex items-center gap-2 rounded-[2px] cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-[#555]" />
                          <span>Export Backup (JSON)</span>
                        </button>
                      )}

                      {onDownloadWordPressHtml && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsAdminMenuOpen(false);
                            onDownloadWordPressHtml();
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#edf2f7] flex items-center gap-2 rounded-[2px] cursor-pointer text-sky-800 font-semibold"
                        >
                          <FileText className="w-3.5 h-3.5 text-sky-600" />
                          <span>Download Standalone App (index.html)</span>
                        </button>
                      )}
                    </div>

                    <div className="p-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAdminMenuOpen(false);
                          onExitAdmin();
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-700 flex items-center gap-2 rounded-[2px] cursor-pointer font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('adminLogout')}</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdminMenuOpen(false);
                        onOpenLogin();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#edf2f7] flex items-center gap-2 rounded-[2px] cursor-pointer text-[#286090] font-bold text-[12.5px]"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#286090]" />
                      <span>{t('adminLogin')}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
