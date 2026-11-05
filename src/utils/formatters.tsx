import React from 'react';
import { MortgageRecord, ClauseCustomization } from '../types/mortgage';

/**
 * Extracts a normalized string ID from a MortgageRecord
 */
export function getRecordId(record: MortgageRecord): string {
  if (!record) return '';
  if (typeof record._id === 'string') {
    return record._id;
  }
  if (record._id && typeof record._id === 'object' && '$oid' in record._id) {
    return record._id.$oid;
  }
  return '';
}

/**
 * Formats a multi-line standard Mortgagee / Loss Payee Clause
 */
export function buildMortgageeClause(
  record: MortgageRecord,
  customization?: ClauseCustomization
): string {
  const lines: string[] = [];

  const name = record.Name?.trim();
  if (name) {
    lines.push(name);
  }

  const name2 = record.Name2?.trim();
  if (name2) {
    lines.push(name2);
  }

  const address = record.Address?.trim();
  if (address) {
    lines.push(address);
  }

  const cityStateZipParts: string[] = [];
  if (record.City?.trim()) {
    cityStateZipParts.push(record.City.trim());
  }

  const stateZip: string[] = [];
  if (record.State?.trim()) {
    stateZip.push(record.State.trim().toUpperCase());
  }
  if (record.ZIP?.trim()) {
    stateZip.push(record.ZIP.trim());
  }

  if (stateZip.length > 0) {
    if (cityStateZipParts.length > 0) {
      cityStateZipParts[0] = `${cityStateZipParts[0]}, ${stateZip.join(' ')}`;
    } else {
      cityStateZipParts.push(stateZip.join(' '));
    }
  }

  if (cityStateZipParts.length > 0) {
    lines.push(cityStateZipParts.join(''));
  }

  // Customization additions (if provided)
  const extras: string[] = [];
  if (customization?.loanNumber?.trim()) {
    extras.push(`Loan #: ${customization.loanNumber.trim()}`);
  }
  if (customization?.borrowerName?.trim()) {
    extras.push(`Borrower: ${customization.borrowerName.trim()}`);
  }
  if (customization?.policyNumber?.trim()) {
    extras.push(`Policy #: ${customization.policyNumber.trim()}`);
  }

  if (extras.length > 0) {
    lines.push('');
    lines.push(...extras);
  }

  return lines.join('\n');
}

/**
 * Alias for buildMortgageeClause
 */
export const buildFullClause = buildMortgageeClause;

export interface PolicyEmailOptions {
  loanNumber?: string;
  borrowerName?: string;
  policyNumber?: string;
  carrierName?: string;
  toEmail?: string;
  includeDetailsFooter?: boolean;
}

/**
 * Builds email subject and body for sending policy documents (Dec Page & Invoice) to mortgagee
 */
export function buildPolicyDocEmail(
  record: MortgageRecord,
  options?: PolicyEmailOptions
): { subject: string; body: string; mailtoUrl: string } {
  const loanNum = options?.loanNumber?.trim();
  const loanDisplay = loanNum ? `Loan #${loanNum}` : 'Loan #[Loan Number]';
  const borrower = options?.borrowerName?.trim() || '[Borrower Name]';
  const policyNum = options?.policyNumber?.trim() || '[Policy Number]';
  const carrier = options?.carrierName?.trim();
  const lenderName = record.Name?.trim() || 'Lender / Mortgagee';
  
  const fullAddress = [
    record.Address,
    [record.City, record.State, record.ZIP].filter(Boolean).join(' ')
  ].filter(Boolean).join(', ');

  // Professional industry standard subject line
  const subjectParts = [`Evidence of Insurance & Mortgagee Bill - ${loanDisplay}`];
  if (options?.borrowerName?.trim()) {
    subjectParts.push(`- ${options.borrowerName.trim()}`);
  }
  const subject = subjectParts.join(' ');

  // Structured, professional body content
  const bodyLines: string[] = [
    `Attn: Insurance Processing & Escrow Servicing Department`,
    `${lenderName}`,
    '',
    `RE: Evidence of Property Insurance & Mortgagee Bill (Escrow Disbursement)`,
    `Borrower / Named Insured: ${borrower}`,
    `Loan / Account #: ${loanNum || '[Loan Number]'}`,
    `Policy #: ${policyNum}`,
    ...(carrier ? [`Carrier: ${carrier}`] : []),
    ...(fullAddress ? [`Property / Insured Address: ${fullAddress}`] : []),
    '',
    `Dear Insurance Processing Team,`,
    '',
    `Please find attached the renewal/new policy Declarations Page (Evidence of Insurance) and annual premium invoice for the loan referenced above.`,
    '',
    `Action Requested:`,
    `1. Please update your escrow records with the attached Evidence of Insurance.`,
    `2. Please disburse the annual premium payment from the borrower's escrow account to the insurance carrier prior to the effective date to maintain continuous, uninterrupted coverage.`,
    '',
    `Kindly reply with confirmation of receipt and the scheduled escrow disbursement date.`,
    '',
    `Thank you for your prompt assistance,`,
    `Insurance Servicing & Processing Team`
  ];

  const body = bodyLines.join('\n');
  const recipient = (options?.toEmail !== undefined ? options.toEmail : record.email)?.trim() || '';
  
  const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return {
    subject,
    body,
    mailtoUrl
  };
}

/**
 * Formats City, State ZIP for preview
 */
export function formatLocation(record: MortgageRecord): string {
  const parts: string[] = [];
  if (record.City?.trim()) parts.push(record.City.trim());
  if (record.State?.trim()) parts.push(record.State.trim().toUpperCase());
  if (record.ZIP?.trim()) parts.push(record.ZIP.trim());

  if (parts.length === 0) return 'Location not specified';
  
  if (record.City?.trim() && record.State?.trim()) {
    return `${record.City.trim()}, ${record.State.trim().toUpperCase()} ${record.ZIP?.trim() || ''}`.trim();
  }
  return parts.join(', ');
}

/**
 * Cleans phone number for tel: link
 */
export function cleanPhoneUri(phone: string | null | undefined): string {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Checks if a record has Loss Payee or Auto Finance / Leasing characteristics
 */
export function isLossPayee(record: MortgageRecord): boolean {
  const text = `${record.Name || ''} ${record.Name2 || ''} ${record.Notes || ''}`.toLowerCase();
  return text.includes('loss payee') || text.includes('loss-payee');
}

/**
 * Checks if a record is Auto Finance, Leasing, or Auto Loss Payee
 */
export function isAutoOrLossPayee(record: MortgageRecord): boolean {
  if (!record) return false;
  const text = `${record.Name || ''} ${record.Name2 || ''} ${record.Notes || ''}`.toLowerCase();
  return (
    isLossPayee(record) ||
    text.includes('auto') ||
    text.includes('lease') ||
    text.includes('leasing') ||
    text.includes('acceptance') ||
    text.includes('motor credit') ||
    text.includes('ally') ||
    text.includes('toyota') ||
    text.includes('honda') ||
    text.includes('nissan') ||
    text.includes('ford credit') ||
    text.includes('gm financial') ||
    text.includes('vw credit') ||
    text.includes('bmw financial') ||
    text.includes('chrysler') ||
    text.includes('carmax')
  );
}

/**
 * Checks if a record is Mortgagee / ISAOA / ATIMA
 */
export function isMortgagee(record: MortgageRecord): boolean {
  const text = `${record.Name || ''} ${record.Name2 || ''} ${record.Notes || ''}`.toLowerCase();
  return text.includes('mortgagee') || text.includes('isaoa') || text.includes('atima') || !isAutoOrLossPayee(record);
}

/**
 * Checks if a record has an active Online Web Portal
 */
export function hasOnlinePortal(record: MortgageRecord): boolean {
  if (!record.Online) return false;
  const trimmed = record.Online.trim().toLowerCase();
  return trimmed.length > 3 && (trimmed.startsWith('http') || trimmed.includes('.com') || trimmed.includes('.org') || trimmed.includes('.net') || trimmed.includes('www.'));
}

/**
 * Formats URL to ensure http/https prefix
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Check if updated recently (year 2025 or 2026, or within last 365 days)
 */
export function isRecentlyUpdated(record: MortgageRecord): boolean {
  if (!record.LastUpdated) return false;
  const updatedStr = record.LastUpdated.trim();
  return updatedStr.startsWith('2025') || updatedStr.startsWith('2026') || updatedStr.startsWith('2027');
}

/**
 * Multi-field fuzzy search matcher
 */
export function matchesSearch(record: MortgageRecord, query: string): boolean {
  if (!query || !query.trim()) return true;

  const searchTokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (searchTokens.length === 0) return true;

  const combinedSearchContent = [
    record.Name || '',
    record.Name2 || '',
    record.Address || '',
    record.City || '',
    record.State || '',
    record.ZIP || '',
    record.Telephone || '',
    record.Telephone2 || '',
    record.FAX || '',
    record.email || '',
    record.Online || '',
    record.Notes || '',
    getRecordId(record)
  ].join(' ').toLowerCase();

  // All tokens must be present somewhere in the combined search content
  return searchTokens.every(token => combinedSearchContent.includes(token));
}

/**
 * React Component helper to highlight search terms
 */
export function HighlightedText({ text, query }: { text: string | null | undefined; query: string }): React.JSX.Element {
  if (!text) return <span>-</span>;
  if (!query || !query.trim()) return <span>{text}</span>;

  const rawTokens = query.trim().split(/\s+/).filter(t => t.length > 0);
  if (rawTokens.length === 0) return <span>{text}</span>;

  // Escape regex special chars
  const escapedTokens = rawTokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedTokens.join('|')})`, 'gi');

  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) => {
        const isMatch = rawTokens.some(tok => tok.toLowerCase() === part.toLowerCase());
        if (isMatch) {
          return (
            <mark
              key={index}
              className="bg-[#ffe58f] text-[#111] font-semibold px-0.5 rounded-[2px]"
            >
              {part}
            </mark>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

/**
 * Helper to generate a unique MongoDB-like 24-character hex ID
 */
export function generateObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const randomHex = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return `${timestamp}${randomHex}`;
}

/**
 * Normalizes company and institution names for fuzzy deduplication
 */
export function normalizeNameForMatching(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\b(llc|inc|incorporated|corp|corporation|co|company|bank|fsb|na|n a|national association|credit union|cu|fcu|mortgage|mtg|financial|services|servicing|ltd|lp)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes address, city, state, zip for matching
 */
export function normalizeAddressForMatching(addr: string, city: string, state: string, zip: string): string {
  const cleanZip = (zip || '').replace(/[^\d]/g, '').slice(0, 5);
  const cleanState = (state || '').trim().toLowerCase();
  const cleanCity = (city || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanStreet = (addr || '')
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\b(po box|p o box|pobox|box|suite|ste|dept|fl|floor|bldg|building|street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd|highway|hwy|way)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleanStreet && cleanZip) {
    return `${cleanStreet}_${cleanZip}`;
  }
  if (cleanStreet && cleanCity) {
    return `${cleanStreet}_${cleanCity}_${cleanState}`;
  }
  if (cleanZip) {
    return `zip_${cleanZip}`;
  }
  return `${cleanCity}_${cleanState}`;
}

/**
 * Deduplicates and enriches records, merging duplicates and filtering placeholder/blank entries
 */
export function deduplicateRecords(rawRecords: MortgageRecord[]): MortgageRecord[] {
  const mergedMap = new Map<string, MortgageRecord>();

  // Filter out blank or invalid records first
  const validRecords = rawRecords.filter(r => {
    if (!r.Name || !r.Name.trim()) return false;
    const nameLower = r.Name.trim().toLowerCase();
    if (nameLower === 'delete' || nameLower === 'deleted' || nameLower === 'null' || nameLower === 'n/a') return false;
    return true;
  });

  for (const record of validRecords) {
    const normName = normalizeNameForMatching(record.Name);
    const normAddr = normalizeAddressForMatching(record.Address || '', record.City || '', record.State || '', record.ZIP || '');
    
    // Key based on normalized name and normalized location/address
    const dedupeKey = normAddr ? `${normName}:::${normAddr}` : `${normName}:::no_address`;

    if (!mergedMap.has(dedupeKey)) {
      mergedMap.set(dedupeKey, { ...record });
    } else {
      const existing = mergedMap.get(dedupeKey)!;
      
      // Calculate data fullness score
      const calcScore = (rec: MortgageRecord) => {
        let score = 0;
        if (rec.Telephone && rec.Telephone.trim()) score += 3;
        if (rec.Telephone2 && rec.Telephone2.trim()) score += 2;
        if (rec.FAX && rec.FAX.trim()) score += 3;
        if (rec.email && rec.email.trim()) score += 4;
        if (rec.Online && rec.Online.trim()) score += 4;
        if (rec.Notes && rec.Notes.trim()) score += 2;
        if (rec.Address && rec.Address.trim()) score += 2;
        if (rec.City && rec.City.trim()) score += 1;
        if (rec.State && rec.State.trim()) score += 1;
        if (rec.ZIP && rec.ZIP.trim()) score += 1;
        if (rec.LastUpdated && rec.LastUpdated.startsWith('202')) score += 2;
        return score;
      };

      const existingScore = calcScore(existing);
      const newScore = calcScore(record);

      // Base record is the one with higher score / more recent info
      const base = newScore > existingScore ? { ...record } : { ...existing };
      const secondary = newScore > existingScore ? existing : record;

      // Merge missing fields
      const mergedRecord: MortgageRecord = {
        ...base,
        Name2: base.Name2 || secondary.Name2,
        Address: base.Address || secondary.Address,
        City: base.City || secondary.City,
        State: base.State || secondary.State,
        ZIP: base.ZIP || secondary.ZIP,
        Telephone: base.Telephone || secondary.Telephone,
        Telephone2: base.Telephone2 || secondary.Telephone2,
        FAX: base.FAX || secondary.FAX,
        email: base.email || secondary.email,
        Online: base.Online || secondary.Online,
        Notes: base.Notes
          ? (secondary.Notes && !base.Notes.includes(secondary.Notes) ? `${base.Notes}; ${secondary.Notes}` : base.Notes)
          : secondary.Notes,
        LastUpdated: (base.LastUpdated && base.LastUpdated > (secondary.LastUpdated || ''))
          ? base.LastUpdated
          : (secondary.LastUpdated || base.LastUpdated)
      };

      mergedMap.set(dedupeKey, mergedRecord);
    }
  }

  return Array.from(mergedMap.values());
}

/**
 * Formats current date and time as YYYY-MM-DD HH:mm
 */
export function formatCurrentTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
