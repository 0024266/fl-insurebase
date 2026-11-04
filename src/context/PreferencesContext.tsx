import React, { createContext, useContext, useState, useEffect } from 'react';

export type ViewMode = 'table' | 'cards' | 'map';
export type FontSize = 'normal' | 'large' | 'xl';

interface Preferences {
  showHelpBanners: boolean;
  showTooltips: boolean;
  enableShortcuts: boolean;
  compactView: boolean;
  viewMode: ViewMode;
  fontSize: FontSize;
}

interface PreferencesContextType extends Preferences {
  setShowHelpBanners: (val: boolean) => void;
  toggleHelpBanners: () => void;
  setShowTooltips: (val: boolean) => void;
  toggleTooltips: () => void;
  setEnableShortcuts: (val: boolean) => void;
  toggleShortcuts: () => void;
  setCompactView: (val: boolean) => void;
  toggleCompactView: () => void;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  setFontSize: (size: FontSize) => void;
  cycleFontSize: () => void;
}

const STORAGE_KEY = 'agency_directory_preferences_v3';

const defaultPreferences: Preferences = {
  showHelpBanners: true,
  showTooltips: true,
  enableShortcuts: true,
  compactView: false,
  viewMode: 'table',
  fontSize: 'large' // Default to crisp, slightly larger legible font size
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prefs, setPrefs] = useState<Preferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultPreferences, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return defaultPreferences;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }, [prefs]);

  const setShowHelpBanners = (val: boolean) => setPrefs((prev) => ({ ...prev, showHelpBanners: val }));
  const toggleHelpBanners = () => setPrefs((prev) => ({ ...prev, showHelpBanners: !prev.showHelpBanners }));

  const setShowTooltips = (val: boolean) => setPrefs((prev) => ({ ...prev, showTooltips: val }));
  const toggleTooltips = () => setPrefs((prev) => ({ ...prev, showTooltips: !prev.showTooltips }));

  const setEnableShortcuts = (val: boolean) => setPrefs((prev) => ({ ...prev, enableShortcuts: val }));
  const toggleShortcuts = () => setPrefs((prev) => ({ ...prev, enableShortcuts: !prev.enableShortcuts }));

  const setCompactView = (val: boolean) => setPrefs((prev) => ({ ...prev, compactView: val }));
  const toggleCompactView = () => setPrefs((prev) => ({ ...prev, compactView: !prev.compactView }));

  const setViewMode = (mode: ViewMode) => setPrefs((prev) => ({ ...prev, viewMode: mode }));
  const toggleViewMode = () => setPrefs((prev) => ({ ...prev, viewMode: prev.viewMode === 'table' ? 'cards' : 'table' }));

  const setFontSize = (size: FontSize) => setPrefs((prev) => ({ ...prev, fontSize: size }));
  const cycleFontSize = () => {
    setPrefs((prev) => {
      const nextSize: FontSize = prev.fontSize === 'normal' ? 'large' : prev.fontSize === 'large' ? 'xl' : 'normal';
      return { ...prev, fontSize: nextSize };
    });
  };

  return (
    <PreferencesContext.Provider
      value={{
        ...prefs,
        setShowHelpBanners,
        toggleHelpBanners,
        setShowTooltips,
        toggleTooltips,
        setEnableShortcuts,
        toggleShortcuts,
        setCompactView,
        toggleCompactView,
        setViewMode,
        toggleViewMode,
        setFontSize,
        cycleFontSize
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export function usePreferences(): PreferencesContextType {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
