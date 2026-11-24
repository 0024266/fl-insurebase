import { MortgageRecord } from '../types/mortgage';
import { FloridaZipRecord, BulkUpdateLinksOptions } from '../types/permits';
import { CarrierRecord } from '../types/carrier';
import { getRecordId } from './formatters';
import { getPermitRecordId } from './permitFormatters';

// In-memory Admin session token (never persisted to localStorage or sessionStorage)
let adminBearerToken: string | null = null;

export function setAdminToken(token: string | null) {
  adminBearerToken = token;
}

export function getAdminToken(): string | null {
  return adminBearerToken;
}

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (adminBearerToken) {
    headers['Authorization'] = `Bearer ${adminBearerToken}`;
  }
  return headers;
}

export interface AuthStatusResponse {
  configured: boolean;
  dbConnected: boolean;
  dbName?: string;
}

export async function fetchAuthStatus(): Promise<AuthStatusResponse> {
  try {
    const res = await fetch('/api/auth/status');
    if (!res.ok) return { configured: false, dbConnected: false };
    return await res.json();
  } catch {
    return { configured: false, dbConnected: false };
  }
}

export async function setupAdminPasscode(passcode: string): Promise<{ token?: string; error?: string }> {
  try {
    const res = await fetch('/api/auth/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode })
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Failed to configure passcode.' };
    if (data.token) {
      setAdminToken(data.token);
    }
    return { token: data.token };
  } catch {
    return { error: 'Network error connecting to authentication service.' };
  }
}

export async function loginAdminPasscode(passcode: string): Promise<{ token?: string; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode })
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Invalid admin passcode.' };
    if (data.token) {
      setAdminToken(data.token);
    }
    return { token: data.token };
  } catch {
    return { error: 'Network error connecting to authentication service.' };
  }
}

export async function logoutAdminSession(): Promise<void> {
  try {
    if (adminBearerToken) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders()
      });
    }
  } catch {
    // ignore
  } finally {
    setAdminToken(null);
  }
}

export interface DirectoryRecordsResponse {
  source: 'mongodb' | 'static';
  dbConnected: boolean;
  dbName?: string;
  mortgages: MortgageRecord[] | null;
  permits: FloridaZipRecord[] | null;
  carriers: CarrierRecord[] | null;
}

let cachedDirectoryPromise: Promise<DirectoryRecordsResponse | null> | null = null;

export function fetchDirectoryFromMongo(forceRefresh = false): Promise<DirectoryRecordsResponse | null> {
  if (!forceRefresh && cachedDirectoryPromise) {
    return cachedDirectoryPromise;
  }
  cachedDirectoryPromise = fetch('/api/records')
    .then(async (res) => {
      if (!res.ok) return null;
      return (await res.json()) as DirectoryRecordsResponse;
    })
    .catch(() => null);
  return cachedDirectoryPromise;
}

// --- Mortgage API Sync Helpers ---
export async function syncCreateMortgage(record: MortgageRecord): Promise<boolean> {
  try {
    const recordId = getRecordId(record);
    const res = await fetch('/api/mortgages', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...record, recordId })
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function syncUpdateMortgage(id: string, record: MortgageRecord): Promise<boolean> {
  try {
    const res = await fetch(`/api/mortgages/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...record, recordId: id })
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function syncDeleteMortgage(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/mortgages/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.ok;
  } catch {
    return false;
  }
}

// --- Florida Permits API Sync Helpers ---
export async function syncCreatePermit(record: FloridaZipRecord): Promise<boolean> {
  try {
    const recordId = getPermitRecordId(record);
    const res = await fetch('/api/permits', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...record, recordId })
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function syncUpdatePermit(id: string, record: FloridaZipRecord): Promise<boolean> {
  try {
    const res = await fetch(`/api/permits/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...record, recordId: id })
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function syncDeletePermit(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/permits/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function syncBulkUpdatePermits(options: BulkUpdateLinksOptions): Promise<boolean> {
  try {
    const res = await fetch('/api/permits/bulk-links', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(options)
    });
    return res.ok;
  } catch {
    return false;
  }
}

// --- Insurance Carriers API Sync Helpers ---
export async function syncCreateCarrier(record: CarrierRecord): Promise<boolean> {
  try {
    const res = await fetch('/api/carriers', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(record)
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function syncUpdateCarrier(id: string, record: CarrierRecord): Promise<boolean> {
  try {
    const res = await fetch(`/api/carriers/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(record)
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function syncDeleteCarrier(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/carriers/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.ok;
  } catch {
    return false;
  }
}
