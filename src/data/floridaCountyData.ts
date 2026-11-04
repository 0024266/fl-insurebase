export interface CountyGeoInfo {
  name: string;
  seat: string;
  lat: number;
  lon: number;
  region: 'Panhandle' | 'North' | 'Central' | 'Tampa Bay' | 'Southwest' | 'Treasure Coast' | 'South' | 'Keys';
  windZone: number;
  defaultTerrain: 'B' | 'C';
  // Normalized SVG coordinates for statewide vector map (width: 620, height: 480)
  svgX: number;
  svgY: number;
  svgPath?: string;
}

/**
 * All 67 Florida Counties with geographic centroids, seats, wind exposure, and SVG positions
 */
export const FLORIDA_COUNTIES_GEO: Record<string, CountyGeoInfo> = {
  ALACHUA: {
    name: 'Alachua',
    seat: 'Gainesville',
    lat: 29.6746,
    lon: -82.3577,
    region: 'North',
    windZone: 4,
    defaultTerrain: 'B',
    svgX: 374,
    svgY: 130
  },
  BAKER: {
    name: 'Baker',
    seat: 'Macclenny',
    lat: 30.3312,
    lon: -82.2846,
    region: 'North',
    windZone: 4,
    defaultTerrain: 'B',
    svgX: 380,
    svgY: 78
  },
  BAY: {
    name: 'Bay',
    seat: 'Panama City',
    lat: 30.2647,
    lon: -85.6321,
    region: 'Panhandle',
    windZone: 3,
    defaultTerrain: 'C',
    svgX: 145,
    svgY: 82
  },
  BRADFORD: {
    name: 'Bradford',
    seat: 'Starke',
    lat: 29.9525,
    lon: -82.1693,
    region: 'North',
    windZone: 4,
    defaultTerrain: 'B',
    svgX: 388,
    svgY: 108
  },
  BREVARD: {
    name: 'Brevard',
    seat: 'Titusville',
    lat: 28.2957,
    lon: -80.7326,
    region: 'Central',
    windZone: 2,
    defaultTerrain: 'C',
    svgX: 488,
    svgY: 236
  },
  BROWARD: {
    name: 'Broward',
    seat: 'Fort Lauderdale',
    lat: 26.1244,
    lon: -80.2495,
    region: 'South',
    windZone: 1,
    defaultTerrain: 'C',
    svgX: 520,
    svgY: 395
  },
  CALHOUN: {
    name: 'Calhoun',
    seat: 'Blountstown',
    lat: 30.4086,
    lon: -85.2014,
    region: 'Panhandle',
    windZone: 3,
    defaultTerrain: 'B',
    svgX: 175,
    svgY: 72
  },
  CHARLOTTE: {
    name: 'Charlotte',
    seat: 'Punta Gorda',
    lat: 26.8958,
    lon: -81.9329,
    region: 'Southwest',
    windZone: 2,
    defaultTerrain: 'C',
    svgX: 405,
    svgY: 338
  },
  CITRUS: {
    name: 'Citrus',
    seat: 'Inverness',
    lat: 28.8488,
    lon: -82.4646,
    region: 'Central',
    windZone: 3,
    defaultTerrain: 'C',
    svgX: 366,
    svgY: 194
  },
  CLAY: {
    name: 'Clay',
    seat: 'Green Cove Springs',
    lat: 29.9839,
    lon: -81.8596,
    region: 'North',
    windZone: 3,
    defaultTerrain: 'B',
    svgX: 410,
    svgY: 105
  },
  COLLIER: {
    name: 'Collier',
    seat: 'Naples',
    lat: 26.1264,
    lon: -81.4202,
    region: 'Southwest',
    windZone: 1,
    defaultTerrain: 'C',
    svgX: 442,
    svgY: 395
  },
  COLUMBIA: {
    name: 'Columbia',
    seat: 'Lake City',
    lat: 30.2225,
    lon: -82.6306,
    region: 'North',
    windZone: 4,
    defaultTerrain: 'B',
    svgX: 355,
    svgY: 86
  },
  DESOTO: {
    name: 'DeSoto',
    seat: 'Arcadia',
    lat: 27.1897,
    lon: -81.8044,
    region: 'Central',
    windZone: 3,
    defaultTerrain: 'B',
    svgX: 415,
    svgY: 318
  },
  DIXIE: {
    name: 'Dixie',
    seat: 'Cross City',
    lat: 29.6044,
    lon: -83.1197,
    region: 'North',
    windZone: 3,
    defaultTerrain: 'C',
    svgX: 320,
    svgY: 135
  },
  DUVAL: {
    name: 'Duval',
    seat: 'Jacksonville',
    lat: 30.3322,
    lon: -81.6557,
    region: 'North',
    windZone: 3,
    defaultTerrain: 'C',
    svgX: 425,
    svgY: 78
  },
  ESCAMBIA: {
    name: 'Escambia',
    seat: 'Pensacola',
    lat: 30.6277,
    lon: -87.3323,
    region: 'Panhandle',
    windZone: 2,
    defaultTerrain: 'C',
    svgX: 25,
    svgY: 55
  },
  FLAGLER: {
    name: 'Flagler',
    seat: 'Bunnell',
    lat: 29.4744,
    lon: -81.3092,
    region: 'North',
    windZone: 3,
    defaultTerrain: 'C',
    svgX: 450,
    svgY: 145
  },
  FRANKLIN: {
    name: 'Franklin',
    seat: 'Apalachicola',
    lat: 29.8131,
    lon: -84.8872,
    region: 'Panhandle',
    windZone: 2,
    defaultTerrain: 'C',
    svgX: 198,
    svgY: 118
  },
  GADSDEN: {
    name: 'Gadsden',
    seat: 'Quincy',
    lat: 30.5794,
    lon: -84.6186,
    region: 'Panhandle',
    windZone: 4,
    defaultTerrain: 'B',
    svgX: 216,
    svgY: 58
  },
  GILCHRIST: {
    name: 'Gilchrist',
    seat: 'Trenton',
    lat: 29.7289,
    lon: -82.8533,
    region: 'North',
    windZone: 4,
    defaultTerrain: 'B',
    svgX: 338,
    svgY: 125
  },
  GLADES: {
    name: 'Glades',
    seat: 'Moore Haven',
    lat: 26.9634,
    lon: -81.1894,
    region: 'Southwest',
    windZone: 2,
    defaultTerrain: 'B',
    svgX: 458,
    svgY: 332
  },
  GULF: {
    name: 'Gulf',
    seat: 'Port St. Joe',
    lat: 29.9322,
    lon: -85.2281,
    region: 'Panhandle',
    windZone: 2,
    defaultTerrain: 'C',
    svgX: 172,
    svgY: 110
  },
  HAMILTON: {
    name: 'Hamilton',
    seat: 'Jasper',
    lat: 30.5056,
    lon: -82.9514,
    region: 'North',
    windZone: 4,
    defaultTerrain: 'B',
    svgX: 332,
    svgY: 64
  },
  HARDEE: {
    name: 'Hardee',
    seat: 'Wauchula',
    lat: 27.4878,
    lon: -81.8086,
    region: 'Central',
    windZone: 3,
    defaultTerrain: 'B',
    svgX: 415,
    svgY: 295
  },
  HENDRY: {
    name: 'Hendry',
    seat: 'LaBelle',
    lat: 26.5492,
    lon: -81.1561,
    region: 'Southwest',
    windZone: 2,
    defaultTerrain: 'B',
    svgX: 460,
    svgY: 365
  },
  HERNANDO: {
    name: 'Hernando',
    seat: 'Brooksville',
    lat: 28.5667,
    lon: -82.4697,
    region: 'Central',
    windZone: 3,
    defaultTerrain: 'C',
    svgX: 366,
    svgY: 215
  },
  HIGHLANDS: {
    name: 'Highlands',
    seat: 'Sebring',
    lat: 27.3406,
    lon: -81.3411,
    region: 'Central',
    windZone: 3,
    defaultTerrain: 'B',
    svgX: 448,
    svgY: 305
  },
  HILLSBOROUGH: {
    name: 'Hillsborough',
    seat: 'Tampa',
    lat: 27.9904,
    lon: -82.3018,
    region: 'Tampa Bay',
    windZone: 2,
    defaultTerrain: 'C',
    svgX: 378,
    svgY: 258
  },
  HOLMES: {
    name: 'Holmes',
    seat: 'Bonifay',
    lat: 30.8661,
    lon: -85.8117,
    region: 'Panhandle',
    windZone: 4,
    defaultTerrain: 'B',
    svgX: 132,
    svgY: 38
  },
  INDIAN_RIVER: {
    name: 'Indian River',
    seat: 'Vero Beach',
    lat: 27.6697,
    lon: -80.5286,
    region: 'Treasure Coast',
    windZone: 2,
    defaultTerrain: 'C',
    svgX: 504,
    svgY: 282
  },
  JACKSON: {
    name: 'Jackson',
    seat: 'Marianna',
    lat: 30.7989,
    lon: -85.2214,
    region: 'Panhandle',
    windZone: 4,
    defaultTerrain: 'B',
    svgX: 172,
    svgY: 42
  },
  JEFFERSON: {
    name: 'Jefferson',
    seat: 'Monticello',
    lat: 30.4192,
    lon: -83.9017,
    region: 'North',
    windZone: 4,
    defaultTerrain: 'B',
    svgX: 266,
    svgY: 70
  },
  LAFAYETTE: {
    name: 'Lafayette',
    seat: 'Mayo',
    lat: 30.0547,
    lon: -83.1814,
    region: 'North',
    windZone: 4,
    defaultTerrain: 'B',
    svgX: 316,
    svgY: 98
  },
  LAKE: {
    name: 'Lake',
    seat: 'Tavares',
    lat: 28.7667,
    lon: -81.7167,
    region: 'Central',
    windZone: 3,
    defaultTerrain: 'B',
    svgX: 422,
    svgY: 202
  },
  LEE: {
    name: 'Lee',
    seat: 'Fort Myers',
    lat: 26.5867,
    lon: -81.8483,
    region: 'Southwest',
    windZone: 2,
    defaultTerrain: 'C',
    svgX: 412,
    svgY: 362
  },
  LEON: {
    name: 'Leon',
    seat: 'Tallahassee',
    lat: 30.4578,
    lon: -84.2806,
    region: 'Panhandle',
    windZone: 4,
    defaultTerrain: 'B',
    svgX: 240,
    svgY: 68
  },
  LEVY: {
    name: 'Levy',
    seat: 'Bronson',
    lat: 29.2806,
    lon: -82.6178,
    region: 'North',
    windZone: 3,
    defaultTerrain: 'C',
    svgX: 355,
    svgY: 160
  },
  LIBERTY: {
    name: 'Liberty',
    seat: 'Bristol',
    lat: 30.2333,
    lon: -84.9833,
    region: 'Panhandle',
    windZone: 4,
    defaultTerrain: 'B',
    svgX: 190,
    svgY: 84
  },
  MADISON: {
    name: 'Madison',
    seat: 'Madison',
    lat: 30.4694,
    lon: -83.4131,
    region: 'North',
    windZone: 4,
    defaultTerrain: 'B',
    svgX: 300,
    svgY: 66
  },
  MANATEE: {
    name: 'Manatee',
    seat: 'Bradenton',
    lat: 27.4797,
    lon: -82.3517,
    region: 'Tampa Bay',
    windZone: 2,
    defaultTerrain: 'C',
    svgX: 374,
    svgY: 296
  },
  MARION: {
    name: 'Marion',
    seat: 'Ocala',
    lat: 29.1872,
    lon: -82.1306,
    region: 'Central',
    windZone: 3,
    defaultTerrain: 'B',
    svgX: 392,
    svgY: 168
  },
  MARTIN: {
    name: 'Martin',
    seat: 'Stuart',
    lat: 27.0806,
    lon: -80.4042,
    region: 'Treasure Coast',
    windZone: 1,
    defaultTerrain: 'C',
    svgX: 512,
    svgY: 326
  },
  MIAMI_DADE: {
    name: 'Miami-Dade',
    seat: 'Miami',
    lat: 25.7617,
    lon: -80.1918,
    region: 'South',
    windZone: 1,
    defaultTerrain: 'C',
    svgX: 524,
    svgY: 422
  },
  MONROE: {
    name: 'Monroe',
    seat: 'Key West',
    lat: 24.5551,
    lon: -81.7800,
    region: 'Keys',
    windZone: 1,
    defaultTerrain: 'C',
    svgX: 418,
    svgY: 462
  },
  NASSAU: {
    name: 'Nassau',
    seat: 'Fernandina Beach',
    lat: 30.6128,
    lon: -81.7778,
    region: 'North',
    windZone: 3,
    defaultTerrain: 'C',
    svgX: 416,
    svgY: 56
  },
  OKALOOSA: {
    name: 'Okaloosa',
    seat: 'Crestview',
    lat: 30.6728,
    lon: -86.5897,
    region: 'Panhandle',
    windZone: 3,
    defaultTerrain: 'C',
    svgX: 78,
    svgY: 52
  },
  OKEECHOBEE: {
    name: 'Okeechobee',
    seat: 'Okeechobee',
    lat: 27.3564,
    lon: -80.8931,
    region: 'Central',
    windZone: 2,
    defaultTerrain: 'B',
    svgX: 480,
    svgY: 304
  },
  ORANGE: {
    name: 'Orange',
    seat: 'Orlando',
    lat: 28.5383,
    lon: -81.3792,
    region: 'Central',
    windZone: 3,
    defaultTerrain: 'B',
    svgX: 444,
    svgY: 218
  },
  OSCEOLA: {
    name: 'Osceola',
    seat: 'Kissimmee',
    lat: 28.1136,
    lon: -81.1444,
    region: 'Central',
    windZone: 3,
    defaultTerrain: 'B',
    svgX: 460,
    svgY: 250
  },
  PALM_BEACH: {
    name: 'Palm Beach',
    seat: 'West Palm Beach',
    lat: 26.6536,
    lon: -80.4356,
    region: 'South',
    windZone: 1,
    defaultTerrain: 'C',
    svgX: 510,
    svgY: 358
  },
  PASCO: {
    name: 'Pasco',
    seat: 'Dade City',
    lat: 28.3236,
    lon: -82.4319,
    region: 'Tampa Bay',
    windZone: 2,
    defaultTerrain: 'C',
    svgX: 368,
    svgY: 234
  },
  PINELLAS: {
    name: 'Pinellas',
    seat: 'Clearwater',
    lat: 27.9044,
    lon: -82.7442,
    region: 'Tampa Bay',
    windZone: 2,
    defaultTerrain: 'C',
    svgX: 346,
    svgY: 264
  },
  POLK: {
    name: 'Polk',
    seat: 'Bartow',
    lat: 27.9619,
    lon: -81.7967,
    region: 'Central',
    windZone: 3,
    defaultTerrain: 'B',
    svgX: 415,
    svgY: 260
  },
  PUTNAM: {
    name: 'Putnam',
    seat: 'Palatka',
    lat: 29.6267,
    lon: -81.7333,
    region: 'North',
    windZone: 3,
    defaultTerrain: 'B',
    svgX: 420,
    svgY: 134
  },
  ST_JOHNS: {
    name: 'St. Johns',
    seat: 'St. Augustine',
    lat: 29.9133,
    lon: -81.4111,
    region: 'North',
    windZone: 3,
    defaultTerrain: 'C',
    svgX: 442,
    svgY: 112
  },
  ST_LUCIE: {
    name: 'St. Lucie',
    seat: 'Fort Pierce',
    lat: 27.3811,
    lon: -80.4331,
    region: 'Treasure Coast',
    windZone: 1,
    defaultTerrain: 'C',
    svgX: 512,
    svgY: 304
  },
  SANTA_ROSA: {
    name: 'Santa Rosa',
    seat: 'Milton',
    lat: 30.6978,
    lon: -87.0219,
    region: 'Panhandle',
    windZone: 2,
    defaultTerrain: 'C',
    svgX: 48,
    svgY: 50
  },
  SARASOTA: {
    name: 'Sarasota',
    seat: 'Sarasota',
    lat: 27.2406,
    lon: -82.4178,
    region: 'Tampa Bay',
    windZone: 2,
    defaultTerrain: 'C',
    svgX: 370,
    svgY: 316
  },
  SEMINOLE: {
    name: 'Seminole',
    seat: 'Sanford',
    lat: 28.7189,
    lon: -81.2356,
    region: 'Central',
    windZone: 3,
    defaultTerrain: 'B',
    svgX: 454,
    svgY: 204
  },
  SUMTER: {
    name: 'Sumter',
    seat: 'Bushnell',
    lat: 28.7108,
    lon: -82.0831,
    region: 'Central',
    windZone: 3,
    defaultTerrain: 'B',
    svgX: 395,
    svgY: 206
  },
  SUWANNEE: {
    name: 'Suwannee',
    seat: 'Live Oak',
    lat: 30.2942,
    lon: -82.9842,
    region: 'North',
    windZone: 4,
    defaultTerrain: 'B',
    svgX: 330,
    svgY: 82
  },
  TAYLOR: {
    name: 'Taylor',
    seat: 'Perry',
    lat: 30.0389,
    lon: -83.6194,
    region: 'North',
    windZone: 3,
    defaultTerrain: 'C',
    svgX: 285,
    svgY: 100
  },
  UNION: {
    name: 'Union',
    seat: 'Lake Butler',
    lat: 30.0483,
    lon: -82.3556,
    region: 'North',
    windZone: 4,
    defaultTerrain: 'B',
    svgX: 375,
    svgY: 100
  },
  VOLUSIA: {
    name: 'Volusia',
    seat: 'DeLand',
    lat: 29.0286,
    lon: -81.3031,
    region: 'Central',
    windZone: 2,
    defaultTerrain: 'C',
    svgX: 450,
    svgY: 180
  },
  WAKULLA: {
    name: 'Wakulla',
    seat: 'Crawfordville',
    lat: 30.1656,
    lon: -84.3819,
    region: 'Panhandle',
    windZone: 3,
    defaultTerrain: 'C',
    svgX: 232,
    svgY: 88
  },
  WALTON: {
    name: 'Walton',
    seat: 'DeFuniak Springs',
    lat: 30.6389,
    lon: -86.1778,
    region: 'Panhandle',
    windZone: 3,
    defaultTerrain: 'C',
    svgX: 106,
    svgY: 54
  },
  WASHINGTON: {
    name: 'Washington',
    seat: 'Chipley',
    lat: 30.6128,
    lon: -85.6706,
    region: 'Panhandle',
    windZone: 4,
    defaultTerrain: 'B',
    svgX: 142,
    svgY: 56
  }
};

/**
 * Normalizes county name to match key in FLORIDA_COUNTIES_GEO
 */
export function normalizeCountyKey(rawName: string): string {
  if (!rawName) return '';
  const clean = rawName
    .toUpperCase()
    .replace(/\s+COUNTY.*$/, '')
    .trim()
    .replace(/[^A-Z0-9]/g, '_');

  if (FLORIDA_COUNTIES_GEO[clean]) return clean;

  // Common aliases
  if (clean.includes('MIAMI') || clean.includes('DADE')) return 'MIAMI_DADE';
  if (clean.includes('PALM') && clean.includes('BEACH')) return 'PALM_BEACH';
  if (clean.includes('ST') && clean.includes('LUCIE')) return 'ST_LUCIE';
  if (clean.includes('ST') && clean.includes('JOHNS')) return 'ST_JOHNS';
  if (clean.includes('INDIAN') && clean.includes('RIVER')) return 'INDIAN_RIVER';
  if (clean.includes('SANTA') && clean.includes('ROSA')) return 'SANTA_ROSA';

  return clean;
}

/**
 * Retrieves county coordinates and info by county name
 */
export function getCountyGeoInfo(countyName: string): CountyGeoInfo | null {
  const key = normalizeCountyKey(countyName);
  return FLORIDA_COUNTIES_GEO[key] || null;
}

/**
 * Florida Regions for Map Grouping
 */
export const FLORIDA_REGIONS = [
  { id: 'ALL', label: 'All Florida' },
  { id: 'Panhandle', label: 'Panhandle' },
  { id: 'North', label: 'North FL' },
  { id: 'Central', label: 'Central FL / Orlando' },
  { id: 'Tampa Bay', label: 'Tampa Bay & Suncoast' },
  { id: 'Treasure Coast', label: 'Treasure Coast' },
  { id: 'Southwest', label: 'Southwest FL' },
  { id: 'South', label: 'South FL / Miami' },
  { id: 'Keys', label: 'FL Keys' }
] as const;
