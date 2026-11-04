/**
 * Cross-Tab Smart Search & Auto-Routing Detection Utilities
 */

// Regex for exact 5-digit US ZIP code
export const ZIP_5_DIGIT_REGEX = /^\d{5}$/;

/**
 * Checks if a string is an exact 5-digit US ZIP code
 */
export function isExact5DigitZip(query: string): boolean {
  if (!query) return false;
  return ZIP_5_DIGIT_REGEX.test(query.trim());
}

// Distinct lender search tokens and known servicer aliases
export const LENDER_KEYWORDS: string[] = [
  'mortgage',
  'mortgages',
  'mortgagee',
  'loss payee',
  'loss-payee',
  'isaoa',
  'atima',
  'lender',
  'escrow',
  'servicing',
  'bank',
  'fannie',
  'freddie',
  'credit union',
  'fcu',
  'fsb',
  'chase',
  'jp morgan',
  'jpmorgan',
  'wells fargo',
  'wells',
  'rocket',
  'quicken',
  'pennymac',
  'penny mac',
  'loandepot',
  'loan depot',
  'mr cooper',
  'mr. cooper',
  'nationstar',
  'sps',
  'select portfolio',
  'freedom mortgage',
  'flagstar',
  'truist',
  'suntrust',
  'bbt',
  'citibank',
  'citi',
  'amerihome',
  'plaza home',
  'fairway',
  'movement mortgage',
  'guaranteed rate',
  'cardinal financial',
  'carrington',
  'newrez',
  'shellpoint',
  'cenlar',
  'figure lending',
  'ocean bank',
  'valon',
  'planet home',
  'guild mortgage',
  'fifth third',
  'pnc',
  'bofa',
  'bank of america',
  'us bank',
  'roundpoint'
];

/**
 * Checks if a search query in the Florida Property & Permits tab represents a mortgage lender
 * instead of a Florida municipality, county, or property search.
 */
export function isLenderQuery(query: string): boolean {
  if (!query) return false;
  const q = query.trim().toLowerCase();
  if (q.length < 3) return false;

  // If it's a 5-digit ZIP, it belongs in Property Records, not a lender
  if (isExact5DigitZip(q)) return false;

  // Check if any distinct lender keyword is present as a whole word or significant substring
  return LENDER_KEYWORDS.some((kw) => {
    if (kw.length <= 4) {
      // Short terms like sps, citi, fcu, fsb, bofa should match as discrete words
      const wordRegex = new RegExp(`(^|\\s|[^a-z0-9])${kw}($|\\s|[^a-z0-9])`, 'i');
      return wordRegex.test(q);
    }
    return q.includes(kw);
  });
}
