import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CarrierRecord,
  CarrierLobFilter,
  CarrierSortOption,
  CarrierStats
} from '../types/carrier';
import { INITIAL_CARRIER_RECORDS } from '../data/initialCarriers';
import {
  isNoCcFeeCarrier,
  classifyCcFee,
  generateCarrierSlug
} from '../utils/carrierFormatters';

const STORAGE_KEY = 'agency_carriers_db';
const DELETED_IDS_KEY = 'agency_carriers_deleted_ids';

export function useCarriers(
  onToast?: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void
) {
  const [records, setRecords] = useState<CarrierRecord[]>(() => {
    try {
      const deletedRaw = localStorage.getItem(DELETED_IDS_KEY);
      const deletedIds = new Set<string>(deletedRaw ? JSON.parse(deletedRaw) : []);

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge stored records with base CSV dataset by ID
          const mergedMap = new Map<string, CarrierRecord>();
          for (const baseRec of INITIAL_CARRIER_RECORDS) {
            if (!deletedIds.has(baseRec.id)) {
              mergedMap.set(baseRec.id, baseRec);
            }
          }
          for (const storedRec of parsed) {
            if (storedRec && storedRec.id && !deletedIds.has(storedRec.id)) {
              mergedMap.set(storedRec.id, storedRec);
            }
          }
          return Array.from(mergedMap.values());
        }
      }
    } catch (e) {
      console.error('Failed to load carriers from localStorage:', e);
    }
    return INITIAL_CARRIER_RECORDS;
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lobFilter, setLobFilter] = useState<CarrierLobFilter>('all');
  const [citizensTakeoutOnly, setCitizensTakeoutOnly] = useState<boolean>(false);
  const [noCcFeeOnly, setNoCcFeeOnly] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<CarrierSortOption>('name_asc');
  const [selectedId, setSelectedId] = useState<string>('');

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save carriers to localStorage:', e);
    }
  }, [records]);

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, '');

    const filtered = records.filter((rec) => {
      // 1. Line of Business filter
      if (lobFilter !== 'all') {
        if (!rec[lobFilter]) return false;
      }

      // 2. Citizens Takeout toggle
      if (citizensTakeoutOnly && !rec.CitizensTakeout) {
        return false;
      }

      // 3. No CC Fee toggle
      if (noCcFeeOnly && !isNoCcFeeCarrier(rec)) {
        return false;
      }

      // 4. Instant Search across Carrier, OtherNames, Notes, phones, and emails
      if (q) {
        const textFields = [
          rec.Carrier,
          rec.OtherNames,
          rec.Notes,
          rec.CC_Fee,
          rec.ForAgents,
          rec.CustomerServicePhone,
          rec.CustomerServiceEmail,
          rec.ClaimsPhone,
          rec.ClaimsEmail,
          rec.PublicWebsite
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        const normalizedText = textFields
          .replace(/property\s*&\s*casualty/g, 'property & casualty p&c')
          .replace(/\s+/g, ' ');
        const compactText = normalizedText.replace(/[^a-z0-9]/g, '');
        const compactQuery = q.replace(/[^a-z0-9]/g, '');

        const matchesText =
          normalizedText.includes(q) ||
          (compactQuery.length >= 2 && compactText.includes(compactQuery));

        let matchesPhoneDigits = false;
        if (qDigits.length >= 3) {
          const allDigits = [
            rec.ForAgents,
            rec.CustomerServicePhone,
            rec.ClaimsPhone
          ]
            .filter(Boolean)
            .join('')
            .replace(/\D/g, '');
          matchesPhoneDigits = allDigits.includes(qDigits);
        }

        if (!matchesText && !matchesPhoneDigits) {
          return false;
        }
      }

      return true;
    });

    // Sort results
    return [...filtered].sort((a, b) => {
      if (sortOption === 'name_desc') {
        return b.Carrier.localeCompare(a.Carrier);
      }
      if (sortOption === 'cc_fee_asc') {
        const rank = (r: CarrierRecord) => {
          const cat = classifyCcFee(r.CC_Fee);
          if (cat === 'no_fee') return 0;
          if (cat === 'surcharge') return 1;
          return 2;
        };
        const diff = rank(a) - rank(b);
        if (diff !== 0) return diff;
        return a.Carrier.localeCompare(b.Carrier);
      }
      if (sortOption === 'takeout_first') {
        if (a.CitizensTakeout !== b.CitizensTakeout) {
          return a.CitizensTakeout ? -1 : 1;
        }
        return a.Carrier.localeCompare(b.Carrier);
      }
      return a.Carrier.localeCompare(b.Carrier);
    });
  }, [records, searchQuery, lobFilter, citizensTakeoutOnly, noCcFeeOnly, sortOption]);

  const stats: CarrierStats = useMemo(() => {
    let noFeeCount = 0;
    let citizensTakeoutCount = 0;
    let homeCount = 0;
    let autoCount = 0;
    let floodCount = 0;
    let commercialCount = 0;

    for (const r of records) {
      if (isNoCcFeeCarrier(r)) noFeeCount++;
      if (r.CitizensTakeout) citizensTakeoutCount++;
      if (r.Home) homeCount++;
      if (r.Auto) autoCount++;
      if (r.Flood) floodCount++;
      if (r.Commercial) commercialCount++;
    }

    return {
      total: records.length,
      filteredCount: filteredRecords.length,
      noFeeCount,
      citizensTakeoutCount,
      homeCount,
      autoCount,
      floodCount,
      commercialCount
    };
  }, [records, filteredRecords.length]);

  const selectedRecord = useMemo(
    () => records.find((r) => r.id === selectedId) || null,
    [records, selectedId]
  );

  // Admin CRUD Operations
  const createRecord = useCallback(
    (data: Omit<CarrierRecord, 'id' | 'LastUpdated'>): string => {
      const existingIds = new Set(records.map((r) => r.id));
      const newId = generateCarrierSlug(data.Carrier, existingIds);
      const today = new Date().toISOString().split('T')[0];
      const newRecord: CarrierRecord = {
        ...data,
        id: newId,
        LastUpdated: today
      };
      setRecords((prev) => [newRecord, ...prev]);
      return newId;
    },
    [records]
  );

  const updateRecord = useCallback(
    (id: string, data: Omit<CarrierRecord, 'id' | 'LastUpdated'>) => {
      const today = new Date().toISOString().split('T')[0];
      setRecords((prev) =>
        prev.map((rec) =>
          rec.id === id
            ? {
                ...rec,
                ...data,
                id,
                LastUpdated: today
              }
            : rec
        )
      );
    },
    []
  );

  const deleteRecord = useCallback(
    (id: string) => {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      try {
        const deletedRaw = localStorage.getItem(DELETED_IDS_KEY);
        const deletedIds = new Set<string>(deletedRaw ? JSON.parse(deletedRaw) : []);
        deletedIds.add(id);
        localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(Array.from(deletedIds)));
      } catch {
        // ignore
      }
      if (selectedId === id) {
        setSelectedId('');
      }
      if (onToast) {
        onToast('Carrier Deleted', 'Carrier record removed from directory.', 'info');
      }
    },
    [selectedId, onToast]
  );

  const exportData = useCallback(
    (format: 'json' | 'csv') => {
      const timestamp = new Date().toISOString().slice(0, 10);
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(records, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `insurance_carriers_${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const headers = [
          'Carrier',
          'AgentPortalLogin',
          'ForAgents',
          'Payments',
          'PublicWebsite',
          'OtherNames',
          'ClaimsPhone',
          'ClaimsEmail',
          'CustomerServicePhone',
          'CustomerServiceEmail',
          'CC_Fee',
          'Notes',
          'Personal',
          'Commercial',
          'Auto',
          'Home',
          'Liability',
          'Health',
          'Flood',
          'CitizensTakeout'
        ];
        const escapeCsv = (val: unknown) => {
          if (typeof val === 'boolean') return val ? 'True' : 'False';
          const str = String(val ?? '');
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };
        const rows = records.map((r) =>
          headers.map((h) => escapeCsv(r[h as keyof CarrierRecord])).join(',')
        );
        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `insurance_carriers_${timestamp}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      if (onToast) {
        onToast(
          'Export Complete',
          `Exported ${records.length} insurance carriers (${format.toUpperCase()}).`,
          'success'
        );
      }
    },
    [records, onToast]
  );

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setLobFilter('all');
    setCitizensTakeoutOnly(false);
    setNoCcFeeOnly(false);
  }, []);

  return {
    records,
    filteredRecords,
    searchQuery,
    setSearchQuery,
    lobFilter,
    setLobFilter,
    citizensTakeoutOnly,
    setCitizensTakeoutOnly,
    noCcFeeOnly,
    setNoCcFeeOnly,
    sortOption,
    setSortOption,
    selectedId,
    setSelectedId,
    selectedRecord,
    stats,
    createRecord,
    updateRecord,
    deleteRecord,
    exportData,
    resetFilters
  };
}
