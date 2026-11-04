import { useEffect } from 'react';
import { DirectoryMode } from '../types/permits';

interface UseGlobalShortcutsOptions {
  directoryMode: DirectoryMode;
  onDirectoryModeChange: (mode: DirectoryMode) => void;
  isAnyModalOpen: boolean;
  onCloseAllModals: () => void;
  isAdmin: boolean;
  onOpenAddNew: () => void;
  onOpenAdminLogin: () => void;
  onOpenShortcuts: () => void;
  onExport: (format: 'json' | 'csv') => void;
  mobileShowDetail: boolean;
  onCloseMobileDetail: () => void;
  onNavigateList?: (direction: 'next' | 'prev') => void;
  onClearSearch?: () => void;
  enabled?: boolean;
}

export function useGlobalShortcuts({
  directoryMode,
  onDirectoryModeChange,
  isAnyModalOpen,
  onCloseAllModals,
  isAdmin,
  onOpenAddNew,
  onOpenAdminLogin,
  onOpenShortcuts,
  onExport,
  mobileShowDetail,
  onCloseMobileDetail,
  onNavigateList,
  onClearSearch,
  enabled = true
}: UseGlobalShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isModifierPressed = isMac ? e.metaKey : e.ctrlKey;
      const target = e.target as HTMLElement | null;
      const isInputFocused =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      // 1. Ctrl+K or Cmd+K: Focus Search Bar
      if (isModifierPressed && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input') as HTMLInputElement | null;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
        return;
      }

      // 2. Escape: Context-aware dismissal
      if (e.key === 'Escape') {
        if (isAnyModalOpen) {
          e.preventDefault();
          onCloseAllModals();
          return;
        }

        if (isInputFocused) {
          e.preventDefault();
          target.blur();
          return;
        }

        if (mobileShowDetail) {
          e.preventDefault();
          onCloseMobileDetail();
          return;
        }

        return;
      }

      // If an input is focused or a modal is open, do not trigger single-key navigation shortcuts
      if (isInputFocused || isAnyModalOpen) {
        return;
      }

      // 3. Quick Slash (/) to search
      if (e.key === '/' && !isModifierPressed) {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input') as HTMLInputElement | null;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
        return;
      }

      // 4. Switch Tabs: 1 or Alt+1 (Mortgages), 2 or Alt+2 (Property Records), 3 or Alt+3 (Disclaimer)
      if ((e.key === '1' && !e.shiftKey) || (e.altKey && e.key === '1')) {
        e.preventDefault();
        onDirectoryModeChange('mortgages');
        return;
      }
      if ((e.key === '2' && !e.shiftKey) || (e.altKey && e.key === '2')) {
        e.preventDefault();
        onDirectoryModeChange('property');
        return;
      }
      if ((e.key === '3' && !e.shiftKey) || (e.altKey && e.key === '3')) {
        e.preventDefault();
        onDirectoryModeChange('disclaimer');
        return;
      }

      // 5. Help / Shortcuts (? / Shift+/)
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        onOpenShortcuts();
        return;
      }

      // 6. Ctrl+N / Cmd+N / Alt+N: Add New Record
      if ((isModifierPressed || e.altKey) && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        if (isAdmin) {
          onOpenAddNew();
        } else {
          onOpenAdminLogin();
        }
        return;
      }

      // 7. Ctrl+E / Cmd+E / Alt+E: Export Data
      if ((isModifierPressed || e.altKey) && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        onExport('csv');
        return;
      }

      // 8. List Navigation (j/k or ArrowDown/ArrowUp)
      if (onNavigateList) {
        if (e.key === 'ArrowDown' || e.key === 'j') {
          e.preventDefault();
          onNavigateList('next');
          return;
        }
        if (e.key === 'ArrowUp' || e.key === 'k') {
          e.preventDefault();
          onNavigateList('prev');
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    enabled,
    directoryMode,
    onDirectoryModeChange,
    isAnyModalOpen,
    onCloseAllModals,
    isAdmin,
    onOpenAddNew,
    onOpenAdminLogin,
    onOpenShortcuts,
    onExport,
    mobileShowDetail,
    onCloseMobileDetail,
    onNavigateList,
    onClearSearch
  ]);
}
