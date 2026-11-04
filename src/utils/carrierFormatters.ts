import { CarrierRecord } from '../types/carrier';

export type CcFeeCategory = 'no_fee' | 'surcharge' | 'neutral';

/**
 * Classifies a CC_Fee string into:
 * - 'no_fee': Green badge — "No fee", "Free", "0%", "$0" (without a primary CC surcharge)
 * - 'surcharge': Amber badge — Percentage or dollar surcharges (e.g., "3.50%", "$5.00", "2.99%", "CC not accepted")
 * - 'neutral': Neutral badge — "Contact carrier" or empty/unspecified
 */
export function classifyCcFee(ccFee?: string | null): CcFeeCategory {
  const raw = (ccFee || '').trim();
  if (!raw) return 'neutral';
  const lower = raw.toLowerCase();

  if (lower.includes('contact carrier') || lower === 'n/a' || lower === 'unknown' || lower === 'tbd') {
    return 'neutral';
  }

  // Check if starts with "no fee", "free", "0%", "$0"
  if (
    lower.startsWith('no fee') ||
    lower === 'free' ||
    lower === '0%' ||
    lower === '$0' ||
    lower === '0.00%' ||
    lower === '$0.00'
  ) {
    return 'no_fee';
  }

  // If it has a percentage, dollar sign, or "not accepted", treat as surcharge/restriction (amber)
  if (
    /\d+(\.\d+)?%/.test(lower) ||
    /\$\d+/.test(lower) ||
    lower.includes('fee') ||
    lower.includes('not accepted') ||
    lower.includes('only')
  ) {
    return 'surcharge';
  }

  return 'neutral';
}

/**
 * Checks whether a carrier qualifies for the "No CC Fee" filter toggle
 */
export function isNoCcFeeCarrier(record: CarrierRecord): boolean {
  return classifyCcFee(record.CC_Fee) === 'no_fee';
}

/**
 * Normalizes a URL field. Returns null if empty or not a web URL (e.g. "Internal Captive Network" or "Direct Servicing").
 */
export function normalizeCarrierUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Reject descriptive non-URL text
  if (
    !trimmed.includes('.') ||
    /\s/.test(trimmed)
  ) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed.replace(/^\/+/, '')}`;
}

/**
 * Strips non-numeric formatting (and extension instructions like "-> 4 -> 3") for tel: links
 */
export function formatTelHref(phone?: string | null): string | null {
  if (!phone) return null;
  // Take primary phone before extension arrows or words like "option"
  const primarySegment = phone.split(/->|option|ext/i)[0] || phone;
  const digits = primarySegment.replace(/\D/g, '');
  if (digits.length < 7) return null;
  return `tel:${digits}`;
}

/**
 * Returns clean mailto: href if the string is a valid email address
 */
export function formatMailtoHref(email?: string | null): string | null {
  if (!email) return null;
  const trimmed = email.trim();
  if (!trimmed || !trimmed.includes('@')) return null;
  return `mailto:${trimmed}`;
}

/**
 * Splits carrier Notes containing <br>, <br/>, <br />, or newline characters into clean lines
 */
export function parseCarrierNotesLines(notes?: string | null): string[] {
  if (!notes) return [];
  return notes
    .split(/<br\s*\/?>|\r?\n/gi)
    .map((line) => line.replace(/<\/?[^>]+(>|$)/g, '').trim())
    .filter(Boolean);
}

/**
 * Generates a unique slug ID for a new or duplicated carrier record
 */
export function generateCarrierSlug(name: string, existingIds: Set<string>): string {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `carrier-${Date.now()}`;
  let slug = base;
  let counter = 2;
  while (existingIds.has(slug)) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}
