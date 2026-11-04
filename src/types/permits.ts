export * from '../data/flRatingData';

export interface FloridaZipRecord {
  _id: { $oid: string } | string;
  zip: number | string;
  City: string;
  County: string;
  State: string;
  PAlink: string | null;
  PermitByCounty: string | null;
  PermitByCity: string | null;
  lat?: number;
  long?: number;
  Terrain?: string;
  LastUpdated?: string;
}

export type DirectoryMode = 'mortgages' | 'property' | 'carriers' | 'disclaimer';

export type PermitTerrainFilter = 'all' | 'B' | 'C';

export type PermitSortOption =
  | 'zip_asc'
  | 'zip_desc'
  | 'city_asc'
  | 'city_desc'
  | 'county_asc'
  | 'county_desc';

export interface PermitStats {
  total: number;
  filteredCount: number;
  hasCityPermitCount: number;
  hasCountyPermitCount: number;
  terrainCCount: number;
  terrainBCount: number;
  uniqueCountiesCount: number;
}

export type BulkScopeMode = 'city' | 'county' | 'city_and_county' | 'filtered' | 'zips';

export interface BulkUpdateLinksOptions {
  scope: BulkScopeMode;
  targetCity?: string;
  targetCounty?: string;
  customZips?: string[];
  selectedRecordIds?: string[];
  updatePaLink: boolean;
  newPaLink?: string;
  updateCountyPermitLink: boolean;
  newCountyPermitLink?: string;
  updateCityPermitLink: boolean;
  newCityPermitLink?: string;
  onlyIfEmpty?: boolean;
}
