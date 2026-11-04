import React, { useEffect } from 'react';
import {
  Keyboard,
  X,
  Search,
  Shield,
  Layers,
  Command,
  MessageSquareText,
  Check
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { useLanguage } from '../context/LanguageContext';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  category: 'Navigation' | 'Search & Actions' | 'Admin & Export';
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  const { showTooltips, toggleTooltips } = usePreferences();
  const { isSpanish } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts: ShortcutItem[] = [
    {
      keys: [`${modKey}`, 'K'],
      description: 'Focus and select search input bar',
      category: 'Search & Actions'
    },
    {
      keys: ['/'],
      description: 'Quick jump to search (when not typing in a text field)',
      category: 'Search & Actions'
    },
    {
      keys: ['Esc'],
      description: 'Close open dialogs / clear search focus / exit mobile detail',
      category: 'Search & Actions'
    },
    {
      keys: ['1', 'or', 'Alt', '1'],
      description: 'Switch to Mortgages Directory',
      category: 'Navigation'
    },
    {
      keys: ['2', 'or', 'Alt', '2'],
      description: 'Switch to Property Records Directory',
      category: 'Navigation'
    },
    {
      keys: ['3', 'or', 'Alt', '3'],
      description: 'Switch to Disclaimer View',
      category: 'Navigation'
    },
    {
      keys: ['↓', '↑', 'or', 'J', 'K'],
      description: 'Navigate up / down through directory records list',
      category: 'Navigation'
    },
    {
      keys: [`${modKey}`, 'N'],
      description: 'Add new record (Admin mode)',
      category: 'Admin & Export'
    },
    {
      keys: [`${modKey}`, 'E'],
      description: 'Export active directory data',
      category: 'Admin & Export'
    },
    {
      keys: ['?'],
      description: 'Show / hide this keyboard shortcuts reference',
      category: 'Navigation'
    }
  ];

  const categories = ['Search & Actions', 'Navigation', 'Admin & Export'] as const;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white border border-[#a8b3c0] rounded-[6px] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-[#222]">
        {/* Title Bar */}
        <div className="qq-modal-header px-4 py-2.5 flex items-center justify-between text-white select-none shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-[3px] bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Keyboard className="w-3.5 h-3.5 text-white" />
            </div>
            <h3 id="shortcuts-modal-title" className="text-sm font-bold tracking-wide truncate">
              {isSpanish ? 'Atajos de Teclado' : 'Keyboard Shortcuts Reference'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shortcuts dialog (Esc)"
            className="qq-modal-close-btn shrink-0 cursor-pointer shadow-md"
            title="Close (Esc)"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Shortcuts Content */}
        <div className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          {/* Key Badges Toggle Option (Moved here as requested) */}
          <div className="bg-[#f0f6fc] border border-[#c0d8f0] rounded-[4px] p-3 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <MessageSquareText className="w-4 h-4 text-[#286090] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-[#222222] text-[12px]">
                  {isSpanish ? 'Insignias de Teclas en Pantalla' : 'Show Shortcut Badges in UI'}
                </div>
                <div className="text-[11px] text-[#555555] leading-snug">
                  {isSpanish
                    ? 'Muestra insignias visuales (ej. Ctrl K) junto a las barras de búsqueda'
                    : 'Display visual hotkey indicator badges (e.g. Ctrl K) in search bars'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTooltips}
              className={`px-2.5 py-1 rounded-[2px] border font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                showTooltips
                  ? 'bg-[#286090] text-white border-[#1d4567] shadow-2xs'
                  : 'bg-white text-[#333333] border-[#b0b0b0] hover:bg-[#f0f0f0]'
              }`}
            >
              {showTooltips && <Check className="w-3 h-3" />}
              <span>{showTooltips ? (isSpanish ? 'Activado' : 'Enabled') : (isSpanish ? 'Desactivado' : 'Disabled')}</span>
            </button>
          </div>

          <div className="bg-[#f8f9fa] border border-[#e2e8f0] rounded-[4px] p-3 text-[#333] flex items-start gap-2.5">
            <Command className="w-4 h-4 text-[#286090] shrink-0 mt-0.5" />
            <p className="text-[11.5px] leading-snug">
              Boost your underwriting and insurance tracking workflow speed with global hotkeys. Press <kbd className="px-1.5 py-0.5 font-mono font-bold bg-white border border-[#ccd] rounded text-[11px] text-[#111]">Esc</kbd> anytime to dismiss overlays.
            </p>
          </div>

          {categories.map((cat) => {
            const items = shortcuts.filter((s) => s.category === cat);
            return (
              <div key={cat} className="space-y-1.5">
                <h4 className="text-[11px] font-bold text-[#4a5568] uppercase tracking-wider border-b border-[#e5e5e5] pb-1 flex items-center gap-1.5">
                  {cat === 'Search & Actions' && <Search className="w-3.5 h-3.5 text-[#286090]" />}
                  {cat === 'Navigation' && <Layers className="w-3.5 h-3.5 text-[#286090]" />}
                  {cat === 'Admin & Export' && <Shield className="w-3.5 h-3.5 text-[#286090]" />}
                  <span>{cat}</span>
                </h4>
                <div className="divide-y divide-[#edf2f7] bg-white border border-[#e2e8f0] rounded-[4px]">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 flex items-center justify-between gap-3 hover:bg-[#f8fafc]"
                    >
                      <span className="text-[#2d3748] font-medium text-[11.5px]">
                        {item.description}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {item.keys.map((k, kIdx) => (
                          <React.Fragment key={kIdx}>
                            {k === 'or' ? (
                              <span className="text-[10px] text-[#888] px-0.5">or</span>
                            ) : (
                              <kbd className="px-1.5 py-0.5 text-[11px] font-mono font-bold bg-[#f3f4f6] text-[#1f2937] border border-[#d1d5db] rounded shadow-2xs">
                                {k}
                              </kbd>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-[#718096]">
          <span>Tip: Press <kbd className="font-mono font-bold text-[#222]">?</kbd> anywhere to toggle this menu</span>
          <button
            type="button"
            onClick={onClose}
            className="qq-btn-green py-1.5 px-4 text-xs cursor-pointer font-bold"
          >
            {isSpanish ? 'Entendido' : 'Got It'}
          </button>
        </div>
      </div>
    </div>
  );
}
