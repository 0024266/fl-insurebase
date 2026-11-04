/**
 * URL Clean Path & Deep Linking State Utilities
 *
 * Encodes active directory tab, search queries, and selected record ID into clean URL paths:
 *  - /mortgages/:id
 *  - /property/:id
 *  - /carriers
 *  - /disclaimer
 * while supporting legacy hash fragments (#tab=...) for backwards compatibility.
 */

export interface UrlShareState {
  tab?: 'mortgages' | 'property' | 'carriers' | 'disclaimer';
  id?: string;
  view?: 'detail' | 'list';
  q?: string;
  county?: string;
  lang?: 'en' | 'es';
}

/**
 * Parses current window.location.pathname & hash into structured URL state
 */
export function parseUrlState(): UrlShareState {
  if (typeof window === 'undefined') return {};

  const state: UrlShareState = {};
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(Boolean);

  // Parse Clean URL Path
  if (segments.length >= 1) {
    const firstSegment = segments[0].toLowerCase();
    if (firstSegment === 'mortgages' || firstSegment === 'mortgagees') {
      state.tab = 'mortgages';
      if (segments[1]) state.id = decodeURIComponent(segments[1]);
    } else if (firstSegment === 'property' || firstSegment === 'permits' || firstSegment === 'properties') {
      state.tab = 'property';
      if (segments[1]) state.id = decodeURIComponent(segments[1]);
    } else if (firstSegment === 'carriers' || firstSegment === 'carrier') {
      state.tab = 'carriers';
      if (segments[1]) state.id = decodeURIComponent(segments[1]);
    } else if (firstSegment === 'disclaimer' || firstSegment === 'terms' || firstSegment === 'legal') {
      state.tab = 'disclaimer';
    }
  }

  // Parse Query Parameters & Legacy Hash Parameters
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace(/^#\/?/, '');
  const hashParams = new URLSearchParams(hash);

  const getParam = (key: string) => searchParams.get(key) || hashParams.get(key);

  const tab = getParam('tab');
  if (tab === 'mortgages' || tab === 'property' || tab === 'carriers' || tab === 'disclaimer') {
    state.tab = tab;
  } else if (tab === 'permits') {
    state.tab = 'property';
  }

  const id = getParam('id');
  if (id) state.id = id;

  const view = getParam('view');
  if (view === 'detail' || view === 'list') {
    state.view = view;
  }

  const q = getParam('q');
  if (q) state.q = q;

  const county = getParam('county');
  if (county) state.county = county;

  const lang = getParam('lang');
  if (lang === 'en' || lang === 'es') state.lang = lang;

  return state;
}

/**
 * Backwards compatible alias for parseUrlState
 */
export const parseUrlHash = parseUrlState;

/**
 * Builds a clean URL path string with optional query params
 */
export function buildCleanPath(state: UrlShareState): string {
  const tab = state.tab || 'mortgages';
  let path = `/${tab}`;
  if (state.id) {
    path += `/${encodeURIComponent(state.id)}`;
  }

  const queryParams = new URLSearchParams();
  if (state.q && state.q.trim()) queryParams.set('q', state.q.trim());
  if (state.county && state.county.trim()) queryParams.set('county', state.county.trim());
  if (state.lang) queryParams.set('lang', state.lang);
  if (state.view === 'detail') queryParams.set('view', 'detail');

  const queryString = queryParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}

/**
 * Builds a hash string for legacy fallback
 */
export function buildUrlHash(state: UrlShareState): string {
  const params = new URLSearchParams();
  if (state.tab) params.set('tab', state.tab);
  if (state.id) params.set('id', state.id);
  if (state.view) params.set('view', state.view);
  if (state.q && state.q.trim()) params.set('q', state.q.trim());
  if (state.county && state.county.trim()) params.set('county', state.county.trim());
  if (state.lang) params.set('lang', state.lang);

  const qs = params.toString();
  return qs ? `#${qs}` : '';
}

/**
 * Generates a full shareable clean URL
 */
export function getShareableUrl(state: UrlShareState): string {
  if (typeof window === 'undefined') return '';
  const cleanPath = buildCleanPath(state);
  return `${window.location.origin}${cleanPath}`;
}

/**
 * Safely updates the browser URL path without adding noisy history stack entries or page reload
 */
export function syncUrlState(state: UrlShareState): void {
  if (typeof window === 'undefined') return;
  const newUrl = buildCleanPath(state);
  window.history.replaceState(null, '', newUrl);
}

/**
 * Backwards compatible alias for syncUrlState
 */
export const syncUrlHash = syncUrlState;
