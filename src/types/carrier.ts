export interface CarrierRecord {
  id: string;
  Carrier: string;
  OtherNames: string;
  AgentPortalLogin: string;
  Payments: string;
  PublicWebsite: string;
  ForAgents: string;
  CustomerServicePhone: string;
  CustomerServiceEmail: string;
  ClaimsPhone: string;
  ClaimsEmail: string;
  CC_Fee: string;
  Notes: string;
  Personal: boolean;
  Commercial: boolean;
  Auto: boolean;
  Home: boolean;
  Liability: boolean;
  Health: boolean;
  Flood: boolean;
  CitizensTakeout: boolean;
  LastUpdated?: string;
}

export type CarrierLobFilter =
  | 'all'
  | 'Home'
  | 'Auto'
  | 'Flood'
  | 'Commercial'
  | 'Personal'
  | 'Liability';

export type CarrierSortOption =
  | 'name_asc'
  | 'name_desc'
  | 'cc_fee_asc'
  | 'takeout_first';

export interface CarrierStats {
  total: number;
  filteredCount: number;
  noFeeCount: number;
  citizensTakeoutCount: number;
  homeCount: number;
  autoCount: number;
  floodCount: number;
  commercialCount: number;
}
