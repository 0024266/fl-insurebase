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

  // Close dropdown when clicking outside
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
        className="qq-btn-secondary py-1 px-2 text-[11.5px] flex items-center gap-1.5 font-bold cursor-pointer shadow-xs whitespace-nowrap"
        title={t('languageSwitch')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-3.5 h-3.5 text-[#1f4e79]" />
        <span className="uppercase font-mono text-[11px] font-bold text-[#1f4e79]">
          {language === 'es' ? 'ES' : 'EN'}
        </span>
        <ChevronDown className="w-3 h-3 text-[#666] opacity-80" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-[6px] shadow-xl border border-[#cbd5e1] z-50 text-[#222] animate-in fade-in zoom-in-95 duration-100 overflow-hidden text-xs">
          {/* Header */}
          <div className="px-3 py-2 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-[#1f4e79] text-[11.5px]">
              <Languages className="w-3.5 h-3.5" />
              <span>{t('languageSwitch')}</span>
            </div>
            <span className="text-[10px] text-[#64748b] bg-white px-1.5 py-0.5 rounded border border-[#e2e8f0]">
              Bilingual + GT
            </span>
          </div>

          {/* Native High-Fidelity Translations */}
          <div className="p-1.5 space-y-1">
            <button
              type="button"
              onClick={() => handleSelectLanguage('en')}
              className={`w-full text-left px-2.5 py-2 rounded-[4px] flex items-center justify-between transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-[#e8f4fd] text-[#004b91] font-bold'
                  : 'text-[#334155] hover:bg-[#f1f5f9]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🇺🇸</span>
                <div>
                  <div className="font-semibold text-[12px]">English (US)</div>
                  <div className="text-[10px] text-[#64748b]">Native Interface & Templates</div>
                </div>
              </div>
              {language === 'en' && <Check className="w-4 h-4 text-[#004b91]" />}
            </button>

            <button
              type="button"
              onClick={() => handleSelectLanguage('es')}
              className={`w-full text-left px-2.5 py-2 rounded-[4px] flex items-center justify-between transition-colors cursor-pointer ${
                language === 'es'
                  ? 'bg-[#e8f4fd] text-[#004b91] font-bold'
                  : 'text-[#334155] hover:bg-[#f1f5f9]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🇺🇸</span>
                <div>
                  <div className="font-semibold text-[12px]">Español (EE. UU. / US)</div>
                  <div className="text-[10px] text-[#64748b]">Español de Estados Unidos para seguros</div>
                </div>
              </div>
              {language === 'es' && <Check className="w-4 h-4 text-[#004b91]" />}
            </button>
          </div>

          {/* Google Translate Integration */}
          <div className="p-2 bg-[#f8fafc] border-t border-[#e2e8f0]">
            <div className="flex items-center gap-1 text-[10.5px] font-bold text-[#475569] mb-1.5 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Google Translate (100+ Languages)</span>
            </div>

            <div className="grid grid-cols-2 gap-1 text-[11px] mb-2">
              {POPULAR_GOOGLE_LANGUAGES.slice(0, 4).map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleOpenGoogleTranslate(lang.code)}
                  className="px-2 py-1 bg-white hover:bg-[#eef2f6] border border-[#d8e0e8] rounded-[3px] text-left truncate text-[#333] hover:text-[#004b91] transition-colors cursor-pointer"
                  title={`Translate page to ${lang.name}`}
                >
                  {lang.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleOpenGoogleTranslate()}
              className="w-full py-1.5 px-2.5 bg-white hover:bg-[#f1f5f9] border border-[#cbd5e1] rounded-[3px] text-[#004b91] font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
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
