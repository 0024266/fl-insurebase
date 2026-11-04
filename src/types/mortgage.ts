export interface MortgageRecord {
  _id: { $oid: string } | string;
  Name: string;
  Name2: string | null;
  Address: string | null;
  City: string | null;
  State: string | null;
  ZIP: string | null;
  Telephone: string | null;
  Telephone2: string | null;
  FAX: string | null;
  email: string | null;
  Online: string | null;
  Notes: string | null;
  LastUpdated?: string;
}

export type CategoryFilter = 'all' | 'mortgagee' | 'loss_payee' | 'has_portal' | 'recently_updated';

export type SortOption = 'name_asc' | 'name_desc' | 'updated_desc' | 'updated_asc' | 'state_asc';

export interface ClauseCustomization {
  loanNumber?: string;
  borrowerName?: string;
  policyNumber?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'error';
}
