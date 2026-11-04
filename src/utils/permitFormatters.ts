import { FloridaZipRecord } from '../types/permits';
import { resolveRatings } from '../data/flRatingData';

/**
 * Safely extracts unique record ID from MongoDB-like object or string ID
 */
export function getPermitRecordId(record: FloridaZipRecord): string {
  if (!record) return '';
  if (typeof record._id === 'object' && record._id !== null && '$oid' in record._id) {
    return record._id.$oid;
  }
  if (typeof record._id === 'string') {
    return record._id;
  }
  return String(record.zip || Math.random().toString(36).substring(2));
}

/**
 * Generates 24-character hexadecimal ObjectId
 */
export function generatePermitObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const randomChars = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return timestamp + randomChars;
}

/**
 * Formats a 5-digit US ZIP code
 */
export function formatZipCode(zip: number | string): string {
  if (zip === null || zip === undefined) return '';
  const str = String(zip).trim();
  if (str.length < 5 && /^\d+$/.test(str)) {
    return str.padStart(5, '0');
  }
  return str;
}

/**
 * Multi-field search matching against ZIP, City, County, Terrain, and Rating Classifications (PPC, Wind Zone, BCEGS, CSP)
 */
export function matchesPermitSearch(record: FloridaZipRecord, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase().trim();
  const rawTerms = q.split(/\s+/).filter(Boolean);

  const zipStr = formatZipCode(record.zip).toLowerCase();
  const cityStr = (record.City || '').toLowerCase();
  const countyStr = (record.County || '').toLowerCase();
  const stateStr = (record.State || '').toLowerCase();
  const terrainStr = (record.Terrain || '').toLowerCase();

  const ratings = resolveRatings(record.County, record.City);
  const ppcStr = (ratings.ppc || '').toLowerCase();
  const windZoneStr = ratings.windZone !== null ? `zone ${ratings.windZone} windzone ${ratings.windZone}` : '';
  const cspStr = (ratings.csp || '').toLowerCase();
  const bcegsStr = ratings.bcegs
    ? `bcegs ${ratings.bcegs.personal} ${ratings.bcegs.commercial} ${ratings.bcegs.year}`
    : '';

  const searchableText = `${zipStr} ${cityStr} ${countyStr} ${stateStr} terrain ${terrainStr} ppc ${ppcStr} ${windZoneStr} csp ${cspStr} ${bcegsStr}`;

  return rawTerms.every((term) => searchableText.includes(term));
}

/**
 * Formats all available links and Underwriting Rating Profile for instant copy to clipboard in agent correspondence style
 */
export function formatPermitLinksForCopy(record: FloridaZipRecord): string {
  const zip = formatZipCode(record.zip);
  const city = (record.City || '').trim().toUpperCase();
  const county = (record.County || '').trim().toUpperCase();
  const state = (record.State || 'FL').trim().toUpperCase();
  const terrain = record.Terrain ? `Terrain ${record.Terrain}` : 'N/A';
  const ratings = resolveRatings(record.County, record.City);

  const lines: string[] = [
    `FLORIDA JURISDICTION & UNDERWRITING DIRECTORY`,
    `Location: ${zip} - ${city}, ${county} County, ${state}`,
    `Wind Terrain Exposure: ${terrain}`
  ];

  // Underwriting Rating Profile
  lines.push('');
  lines.push('ISO & UNDERWRITING RATINGS:');
  lines.push(`• ISO Public Protection Class (PPC): ${ratings.ppc || '10'}`);
  lines.push(
    `• Commercial Wind Zone (EC Zone): ${
      ratings.windZone !== null ? `Zone ${ratings.windZone}` : 'N/A'
    }`
  );
  if (ratings.bcegs) {
    lines.push(
      `• Building Code Effectiveness (BCEGS): Personal ${ratings.bcegs.personal} / Commercial ${ratings.bcegs.commercial} (Evaluation Year: ${ratings.bcegs.year})`
    );
  }
  if (ratings.csp) {
    lines.push(`• CSP County Code: ${ratings.csp}`);
  }

  if (record.lat && record.long) {
    lines.push(`• Coordinates / Map: https://www.google.com/maps?q=${record.lat},${record.long}`);
  }

  lines.push('');
  lines.push('OFFICIAL PORTAL LINKS:');

  if (record.PAlink && record.PAlink.trim()) {
    lines.push(`• Property Appraiser: ${record.PAlink.trim()}`);
  } else {
    lines.push(`• Property Appraiser: Not listed / Use County PA`);
  }

  if (record.PermitByCounty && record.PermitByCounty.trim()) {
    lines.push(`• County Building Permits: ${record.PermitByCounty.trim()}`);
  }

  if (record.PermitByCity && record.PermitByCity.trim()) {
    lines.push(`• Municipal/City Permits: ${record.PermitByCity.trim()}`);
  } else {
    lines.push(`• Municipal/City Permits: Serviced under ${county} County`);
  }

  return lines.join('\n');
}

/**
 * Deduplicates and validates incoming Florida ZIP records
 */
export function deduplicatePermitRecords(records: FloridaZipRecord[]): FloridaZipRecord[] {
  if (!Array.isArray(records)) return [];

  const recordMap = new Map<string, FloridaZipRecord>();

  records.forEach(rec => {
    if (!rec) return;
    const zipStr = formatZipCode(rec.zip);
    if (!zipStr) return;

    const recId = getPermitRecordId(rec);
    const cityStr = (rec.City || '').trim().toUpperCase();
    const countyStr = (rec.County || '').trim().toUpperCase();
    // Unique key: Key by unique Record ID or ZIP + City + County to allow multi-county jurisdictions
    // (such as Lutz in Hillsborough vs. Pasco) to coexist without key conflicts
    const uniqueKey = recId || `${zipStr}__${cityStr}__${countyStr}`;

    let paLink = rec.PAlink ? rec.PAlink.trim() : null;
    if (countyStr === 'MARION' && (!paLink || paLink === 'https://www.pa.marion.fl.us/' || paLink === 'https://www.pa.marion.fl.us' || paLink === 'http://www.pa.marion.fl.us/')) {
      paLink = 'https://www.pa.marion.fl.us/PropertySearch.aspx';
    }

    const existing = recordMap.get(uniqueKey);
    if (!existing) {
      recordMap.set(uniqueKey, {
        ...rec,
        _id: rec._id || { $oid: generatePermitObjectId() },
        zip: zipStr,
        City: (rec.City || '').trim(),
        County: (rec.County || '').trim().toUpperCase(),
        State: (rec.State || 'FL').trim().toUpperCase(),
        PAlink: paLink,
        PermitByCounty: rec.PermitByCounty ? rec.PermitByCounty.trim() : null,
        PermitByCity: rec.PermitByCity ? rec.PermitByCity.trim() : null,
        Terrain: rec.Terrain ? rec.Terrain.trim().toUpperCase() : undefined
      });
    } else {
      let finalPaLink = paLink || existing.PAlink;
      if ((existing.County === 'MARION' || countyStr === 'MARION') &&
          (!finalPaLink || finalPaLink === 'https://www.pa.marion.fl.us/' || finalPaLink === 'https://www.pa.marion.fl.us' || finalPaLink === 'http://www.pa.marion.fl.us/')) {
        finalPaLink = 'https://www.pa.marion.fl.us/PropertySearch.aspx';
      }

      // Merge best available fields
      const merged: FloridaZipRecord = {
        ...existing,
        City: existing.City || (rec.City || '').trim(),
        County: existing.County || (rec.County || '').trim().toUpperCase(),
        PAlink: finalPaLink,
        PermitByCounty: rec.PermitByCounty && rec.PermitByCounty.trim() ? rec.PermitByCounty.trim() : existing.PermitByCounty,
        PermitByCity: rec.PermitByCity && rec.PermitByCity.trim() ? rec.PermitByCity.trim() : existing.PermitByCity,
        lat: rec.lat ?? existing.lat,
        long: rec.long ?? existing.long,
        Terrain: rec.Terrain ? rec.Terrain.trim().toUpperCase() : existing.Terrain,
        LastUpdated: rec.LastUpdated || existing.LastUpdated
      };
      recordMap.set(uniqueKey, merged);
    }
  });

  return Array.from(recordMap.values());
}

/**
 * Formats a record's LastUpdated timestamp into a clear date and time display string
 */
export function formatLastEditedDateTime(timestamp?: string): string {
  if (!timestamp || !timestamp.trim()) return 'Not recorded';
  const val = timestamp.trim();

  // Format: YYYY-MM-DD HH:mm or ISO timestamp
  if (val.includes(':') || val.includes('T')) {
    try {
      const d = new Date(val.replace(' ', 'T'));
      if (!isNaN(d.getTime())) {
        return (
          d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) +
          ' at ' +
          d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        );
      }
    } catch {
      // ignore
    }
    return val;
  }

  // Format: YYYY-MM-DD
  const parts = val.split('-');
  if (parts.length === 3) {
    const [y, m, d] = parts.map(Number);
    if (y && m && d) {
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }

  return val;
}
