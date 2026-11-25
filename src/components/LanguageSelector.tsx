import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ExternalLink, ChevronDown, Languages, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n/translations';

const POPULAR_GOOGLE_LANGUAGES = [
  { code: 'pt', name: 'Português (Portuguese)' },
  { code: 'ht', name: 'Kreyòl Ayisyen (Haitian Creole)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)' },
  { code: 'zh-CN', name: '中文 (Simplified Chinese)' },
  { code: 'it', name: 'Italiano (Italian)' },
  { code: 'ru', name: 'Русский (Russian)' },
  { code: 'ar', name: 'العربية (Arabic)' },
  { code: 'tl', name: 'Tagalog / Filipino' }
];

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
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

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  const handleOpenGoogleTranslate = (targetCode?: string) => {
    const currentUrl = encodeURIComponent(window.location.href);
    const target = targetCode || (language === 'es' ? 'en' : 'es');
    const translateUrl = `https://translate.google.com/translate?sl=auto&tl=${target}&u=${currentUrl}`;
    window.open(translateUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-8 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500/40 ${
          isOpen
            ? 'bg-slate-100 text-slate-900 border-slate-300'
            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 shadow-2xs'
        }`}
        title={t('languageSwitch')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-3.5 h-3.5 text-sky-700" />
        <span className="uppercase font-mono text-[11.5px] font-bold text-slate-800">
          {language === 'es' ? 'ES' : 'EN'}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 max-w-[calc(100vw-1.5rem)] bg-white rounded-xl shadow-xl border border-slate-200 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-100 overflow-hidden text-xs">
          {/* Header */}
          <div className="px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[12px]">
              <Languages className="w-3.5 h-3.5 text-sky-700" />
              <span>{t('languageSwitch')}</span>
            </div>
            <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
              Bilingual + GT
            </span>
          </div>

          {/* Native High-Fidelity Translations */}
          <div className="p-1.5 space-y-1">
            <button
              type="button"
              onClick={() => handleSelectLanguage('en')}
              className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-sky-50 text-sky-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">🇺🇸</span>
                <div>
                  <div className="font-semibold text-[12px]">English (US)</div>
                  <div className="text-[10.5px] text-slate-500">Native Interface & Templates</div>
                </div>
              </div>
              {language === 'en' && <Check className="w-4 h-4 text-sky-700" />}
            </button>

            <button
              type="button"
              onClick={() => handleSelectLanguage('es')}
              className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                language === 'es'
                  ? 'bg-sky-50 text-sky-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">🇺🇸</span>
                <div>
                  <div className="font-semibold text-[12px]">Español (EE. UU. / US)</div>
                  <div className="text-[10.5px] text-slate-500">Español de Estados Unidos para seguros</div>
                </div>
              </div>
              {language === 'es' && <Check className="w-4 h-4 text-sky-700" />}
            </button>
          </div>

          {/* Google Translate Integration */}
          <div className="p-2.5 bg-slate-50/80 border-t border-slate-200/80">
            <div className="flex items-center gap-1 text-[10.5px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Google Translate (100+ Languages)</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] mb-2">
              {POPULAR_GOOGLE_LANGUAGES.slice(0, 4).map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleOpenGoogleTranslate(lang.code)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-left truncate text-slate-700 hover:text-sky-800 transition-colors cursor-pointer font-medium"
                  title={`Translate page to ${lang.name}`}
                >
                  {lang.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleOpenGoogleTranslate()}
              className="w-full py-1.5 px-2.5 bg-white hover:bg-slate-100 border border-slate-200/90 rounded-lg text-sky-800 font-semibold text-[11.5px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Globe className="w-3 h-3" />
              <span>Translate with Google</span>
              <ExternalLink className="w-3 h-3 opacity-75" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
