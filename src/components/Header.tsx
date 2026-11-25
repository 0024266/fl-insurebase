import React, { useState } from 'react';
import {
  MessageSquarePlus,
  Share2,
  Check,
  Building2,
  MapPin,
  Shield
} from 'lucide-react';
import { DirectoryMode } from '../types/permits';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { ViewSettingsBar } from './ViewSettingsBar';
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
  onOpenShortcuts,
  onAddNew,
  onOpenImport,
  onOpenBulkUpdate,
  onExport,
  onDownloadWordPressHtml
}: HeaderProps) {
  const { t, isSpanish } = useLanguage();
  const [isShareCopied, setIsShareCopied] = useState(false);

  const handleShareClick = () => {
    if (onShare) {
      onShare();
      setIsShareCopied(true);
      setTimeout(() => setIsShareCopied(false), 2000);
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs select-none sticky top-0 z-40 w-full">
      <div className="w-full px-3 sm:px-5 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2.5">
        {/* Left & Center Section: Brand Logo & Cohesive Primary Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-3 lg:gap-5 min-w-0">
          <Logo onTabChange={onTabChange} />

          {/* Desktop & Tablet Primary Directory Tabs */}
          <nav
            className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70"
            aria-label="Directory Navigation"
          >
            {/* 1. Mortgagee Clauses */}
            <button
              type="button"
              onClick={() => onTabChange('mortgages')}
              aria-current={activeTab === 'mortgages' ? 'page' : undefined}
              className={`transition-all flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-lg text-xs font-semibold shrink-0 whitespace-nowrap focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500/40 ${
                activeTab === 'mortgages'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Building2 className={`w-3.5 h-3.5 ${activeTab === 'mortgages' ? 'text-sky-700' : 'text-slate-400'}`} />
              <span>{t('tabMortgages')}</span>
            </button>

            {/* 2. FL Property Records */}
            <button
              type="button"
              onClick={() => onTabChange('property')}
              aria-current={activeTab === 'property' ? 'page' : undefined}
              className={`transition-all flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-lg text-xs font-semibold shrink-0 whitespace-nowrap focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500/40 ${
                activeTab === 'property'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${activeTab === 'property' ? 'text-sky-700' : 'text-slate-400'}`} />
              <span>{t('tabPermits')}</span>
            </button>

            {/* 3. Carrier Shortcuts */}
            <button
              type="button"
              onClick={() => onTabChange('carriers')}
              aria-current={activeTab === 'carriers' ? 'page' : undefined}
              className={`transition-all flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-lg text-xs font-semibold shrink-0 whitespace-nowrap focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500/40 ${
                activeTab === 'carriers'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Shield className={`w-3.5 h-3.5 ${activeTab === 'carriers' ? 'text-sky-700' : 'text-slate-400'}`} />
              <span>{isSpanish ? 'Accesos de Aseguradoras' : 'Carrier Shortcuts'}</span>
            </button>
          </nav>
        </div>

        {/* Right Section: Share, Language, Add or Correct Info, and Consolidated Settings */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
          {/* Share Button */}
          <button
            type="button"
            onClick={handleShareClick}
            className={`h-8 px-2.5 text-xs flex items-center gap-1.5 font-semibold cursor-pointer transition-all rounded-lg border focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500/40 ${
              isShareCopied
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 shadow-2xs'
            }`}
            title={t('btnShareTooltip')}
            aria-label={t('btnShareTooltip')}
          >
            {isShareCopied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">{t('btnShareCopied')}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">{t('btnShare')}</span>
              </>
            )}
          </button>

          {/* Bilingual Language Selector */}
          <LanguageSelector />

          {/* Add or Correct Info Accent Pill Button */}
          <button
            type="button"
            onClick={onOpenFeedback}
            className="h-8 px-3 text-xs flex items-center gap-1.5 font-semibold cursor-pointer rounded-lg bg-sky-600 hover:bg-sky-700 text-white border border-sky-700/80 shadow-xs transition-all whitespace-nowrap focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500/40"
            title={t('btnAddCorrectTooltip')}
            aria-label={t('btnAddCorrectTooltip')}
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('btnAddCorrect')}</span>
            <span className="sm:hidden">{isSpanish ? 'Sugerir' : 'Update'}</span>
          </button>

          {/* Consolidated View, Preferences & Admin Settings Button & Popover */}
          <ViewSettingsBar
            onOpenShortcuts={() => {
              if (onOpenShortcuts) onOpenShortcuts();
            }}
            totalCount={totalCount}
            filteredCount={filteredCount}
            activeTab={activeTab}
            onTabChange={onTabChange}
            isAdmin={isAdmin}
            onOpenLogin={onOpenLogin}
            onExitAdmin={onExitAdmin}
            onAddNew={onAddNew}
            onOpenImport={onOpenImport}
            onOpenBulkUpdate={onOpenBulkUpdate}
            onExport={onExport}
            onDownloadWordPressHtml={onDownloadWordPressHtml}
          />
        </div>
      </div>

      {/* Mobile Navigation Tab Strip (visible on screens < md) */}
      <nav
        className="md:hidden w-full px-3 pb-2 flex items-center gap-1 overflow-x-auto"
        aria-label="Mobile Directory Navigation"
      >
        <button
          type="button"
          onClick={() => onTabChange('mortgages')}
          aria-current={activeTab === 'mortgages' ? 'page' : undefined}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11.5px] font-semibold flex items-center justify-center gap-1 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'mortgages'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <span>{t('tabMortgages')}</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('property')}
          aria-current={activeTab === 'property' ? 'page' : undefined}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11.5px] font-semibold flex items-center justify-center gap-1 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'property'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{t('tabPermits')}</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('carriers')}
          aria-current={activeTab === 'carriers' ? 'page' : undefined}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11.5px] font-semibold flex items-center justify-center gap-1 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'carriers'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
          }`}
        >
          <Shield className="w-3.5 h-3.5 shrink-0" />
          <span>{isSpanish ? 'Accesos de Aseguradoras' : 'Carrier Shortcuts'}</span>
        </button>
      </nav>
    </header>
  );
}
