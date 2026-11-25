import { useState, useEffect, useMemo, useCallback } from 'react';
import { MortgageRecord, CategoryFilter, SortOption, ToastMessage } from '../types/mortgage';
import { INITIAL_DATASET } from '../data/initialRecords';
import {
  getRecordId,
  isLossPayee,
  isAutoOrLossPayee,
  isMortgagee,
  hasOnlinePortal,
  isRecentlyUpdated,
  matchesSearch,
  generateObjectId,
  formatCurrentTimestamp,
  deduplicateRecords
} from '../utils/formatters';
import {
  fetchDirectoryFromMongo,
  syncCreateMortgage,
  syncUpdateMortgage,
  syncDeleteMortgage,
  syncBatchMortgages
} from '../utils/api';

const STORAGE_KEY = 'agency_mortgage_db';

export function useMortgages() {
  // Initialize with seed dataset while MongoDB loads
  const [records, setRecords] = useState<MortgageRecord[]>(() =>
    deduplicateRecords(INITIAL_DATASET)
  );

  // Selected Record ID (defaults to empty so reload stays on list view)
  const [selectedId, setSelectedId] = useState<string>('');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('name_asc');
  const [hasEmailOnly, setHasEmailOnly] = useState<boolean>(false);
  const [hasPortalOnly, setHasPortalOnly] = useState<boolean>(false);
  const [hasFaxOnly, setHasFaxOnly] = useState<boolean>(false);
  const [hasPhoneOnly, setHasPhoneOnly] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 180);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load records from shared MongoDB database on page load
  useEffect(() => {
    let mounted = true;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('mortgagee_directory_v3');
    } catch {
      // ignore
    }
    fetchDirectoryFromMongo().then((res) => {
      if (mounted && res && res.source === 'mongodb' && Array.isArray(res.mortgages) && res.mortgages.length > 0) {
        setRecords(deduplicateRecords(res.mortgages));
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Toast helper
  const addToast = useCallback((title: string, description?: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Filter and Sort records
  const filteredRecords = useMemo(() => {
    return records
      .filter(record => {
        // Multi-field search
        if (debouncedQuery && !matchesSearch(record, debouncedQuery)) {
          return false;
        }

        // Category filter
        if ((categoryFilter === 'mortgagee' || categoryFilter === 'mortgagees') && !isMortgagee(record)) {
          return false;
        }
        if (categoryFilter === 'loss_payee' && !isLossPayee(record)) {
          return false;
        }
        if (categoryFilter === 'auto_loss_payee' && !isAutoOrLossPayee(record)) {
          return false;
        }
        if (categoryFilter === 'has_portal' && !hasOnlinePortal(record)) {
          return false;
        }
        if (categoryFilter === 'recently_updated' && !isRecentlyUpdated(record)) {
          return false;
        }

        // Quick boolean filters
        if (hasEmailOnly && (!record.email || !record.email.trim())) {
          return false;
        }
        if (hasPortalOnly && !hasOnlinePortal(record)) {
          return false;
        }
        if (hasFaxOnly && (!record.FAX || !record.FAX.trim())) {
          return false;
        }
        if (hasPhoneOnly && (!record.Telephone?.trim() && !record.Telephone2?.trim())) {
          return false;
        }

        // State filter (if used)
        if (stateFilter !== 'ALL') {
          const recState = (record.State || '').trim().toUpperCase();
          if (recState !== stateFilter) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const nameA = (a.Name || '').toLowerCase().trim();
        const nameB = (b.Name || '').toLowerCase().trim();

        if (sortOption === 'name_asc') {
          return nameA.localeCompare(nameB);
        }
        if (sortOption === 'name_desc') {
          return nameB.localeCompare(nameA);
        }
        if (sortOption === 'updated_desc') {
          const dateA = a.LastUpdated || '2000-01-01';
          const dateB = b.LastUpdated || '2000-01-01';
          return dateB.localeCompare(dateA);
        }
        if (sortOption === 'updated_asc') {
          const dateA = a.LastUpdated || '2000-01-01';
          const dateB = b.LastUpdated || '2000-01-01';
          return dateA.localeCompare(dateB);
        }
        if (sortOption === 'state_asc') {
          const stateA = (a.State || 'ZZ').toUpperCase();
          const stateB = (b.State || 'ZZ').toUpperCase();
          return stateA.localeCompare(stateB) || nameA.localeCompare(nameB);
        }
        return 0;
      });
  }, [records, debouncedQuery, categoryFilter, stateFilter, sortOption, hasEmailOnly, hasPortalOnly, hasFaxOnly, hasPhoneOnly]);

  // Selected Record Object
  const selectedRecord = useMemo(() => {
    if (!selectedId) return filteredRecords[0] || null;
    return records.find(r => getRecordId(r) === selectedId) || filteredRecords[0] || null;
  }, [records, selectedId, filteredRecords]);

  // List of available US states from the dataset
  const availableStates = useMemo(() => {
    const stateSet = new Set<string>();
    records.forEach(r => {
      const st = r.State?.trim().toUpperCase();
      if (st && st.length <= 3 && !st.includes(' ')) {
        stateSet.add(st);
      }
    });
    return Array.from(stateSet).sort();
  }, [records]);

  // Quick stats
  const stats = useMemo(() => {
    const total = records.length;
    let mortgageeCount = 0;
    let lossPayeeCount = 0;
    let portalCount = 0;
    let emailCount = 0;
    let faxCount = 0;
    let phoneCount = 0;
    let recentlyUpdatedCount = 0;

    records.forEach(r => {
      if (isMortgagee(r)) mortgageeCount++;
      if (isLossPayee(r)) lossPayeeCount++;
      if (hasOnlinePortal(r)) portalCount++;
      if (r.email && r.email.trim()) emailCount++;
      if (r.FAX && r.FAX.trim()) faxCount++;
      if (r.Telephone?.trim() || r.Telephone2?.trim()) phoneCount++;
      if (isRecentlyUpdated(r)) recentlyUpdatedCount++;
    });

    return {
      total,
      mortgageeCount,
      lossPayeeCount,
      portalCount,
      emailCount,
      faxCount,
      phoneCount,
      recentlyUpdatedCount,
      filteredCount: filteredRecords.length
    };
  }, [records, filteredRecords]);

  // CRUD: Create
  const createRecord = useCallback((newRecordData: Omit<MortgageRecord, '_id'>) => {
    const newId = generateObjectId();
    const newRecord: MortgageRecord = {
      ...newRecordData,
      _id: { $oid: newId },
      LastUpdated: formatCurrentTimestamp()
    };

    setRecords(prev => [newRecord, ...prev]);
    setSelectedId(newId);
    syncCreateMortgage(newRecord).then((ok) => {
      if (ok) {
        addToast('Record Created', `"${newRecord.Name}" added and synced to MongoDB.`, 'success');
      } else {
        addToast('Database Sync Error', `Could not save "${newRecord.Name}" to MongoDB. Verify your Admin session.`, 'error');
      }
    });
    return newId;
  }, [addToast]);

  // CRUD: Update
  const updateRecord = useCallback((id: string, updatedFields: Partial<MortgageRecord>) => {
    const existing = records.find(item => getRecordId(item) === id);
    if (!existing) return;

    const updated: MortgageRecord = {
      ...existing,
      ...updatedFields,
      LastUpdated: formatCurrentTimestamp()
    };

    setRecords(prev =>
      prev.map(item => (getRecordId(item) === id ? updated : item))
    );

    syncUpdateMortgage(id, updated).then((ok) => {
      if (ok) {
        addToast('Record Updated', 'Changes saved and synced to MongoDB.', 'success');
      } else {
        addToast('Database Sync Error', 'Could not save changes to MongoDB. Verify your Admin session.', 'error');
      }
    });
  }, [records, addToast]);

  // CRUD: Delete
  const deleteRecord = useCallback((id: string) => {
    const itemToDelete = records.find(r => getRecordId(r) === id);
    setRecords(prev => {
      const remaining = prev.filter(r => getRecordId(r) !== id);
      if (selectedId === id) {
        setSelectedId(remaining.length > 0 ? getRecordId(remaining[0]) : '');
      }
      return remaining;
    });
    syncDeleteMortgage(id).then((ok) => {
      if (ok) {
        addToast('Record Deleted', `"${itemToDelete?.Name || 'Record'}" removed from MongoDB.`, 'info');
      } else {
        addToast('Database Sync Error', 'Could not delete record from MongoDB. Verify your Admin session.', 'error');
      }
    });
  }, [records, selectedId, addToast]);

  // Reset search and filters (safe for public & regular use - preserves imported records)
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStateFilter('ALL');
    setHasEmailOnly(false);
    setHasPortalOnly(false);
    setHasFaxOnly(false);
    setSortOption('name_asc');
    if (records.length > 0) {
      setSelectedId(getRecordId(records[0]));
    }
    addToast('View Refreshed', 'Search query and filters cleared.', 'info');
  }, [records, addToast]);

  // Reset to factory default dataset (admin only with confirmation)
  const resetToFactoryDefault = useCallback(() => {
    const sanitized = deduplicateRecords(INITIAL_DATASET);
    setRecords(sanitized);
    if (sanitized.length > 0) {
      setSelectedId(getRecordId(sanitized[0]));
    }
    setSearchQuery('');
    setCategoryFilter('all');
    setStateFilter('ALL');
    setHasEmailOnly(false);
    setHasPortalOnly(false);
    setHasFaxOnly(false);
    setSortOption('name_asc');
    syncBatchMortgages(sanitized, 'replace').then((ok) => {
      if (ok) {
        addToast('Database Reset', `Reverted and synced ${sanitized.length} default mortgage records to MongoDB.`, 'info');
      } else {
        addToast('Database Sync Error', 'Could not sync factory reset to MongoDB. Verify your Admin session.', 'error');
      }
    });
  }, [addToast]);

  // Export Data (JSON or CSV)
  const exportData = useCallback((format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `mortgagee_clauses_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addToast('JSON Exported', 'Dataset exported as JSON file.', 'success');
    } else {
      const headers = ['Name', 'ISAOA_Clause', 'Address', 'City', 'State', 'ZIP', 'Telephone', 'Telephone2', 'FAX', 'Email', 'Online_Portal', 'Notes', 'LastUpdated', 'RecordID'];
      const rows = records.map(r => [
        `"${(r.Name || '').replace(/"/g, '""')}"`,
        `"${(r.Name2 || '').replace(/"/g, '""')}"`,
        `"${(r.Address || '').replace(/"/g, '""')}"`,
        `"${(r.City || '').replace(/"/g, '""')}"`,
        `"${(r.State || '').replace(/"/g, '""')}"`,
        `"${(r.ZIP || '').replace(/"/g, '""')}"`,
        `"${(r.Telephone || '').replace(/"/g, '""')}"`,
        `"${(r.Telephone2 || '').replace(/"/g, '""')}"`,
        `"${(r.FAX || '').replace(/"/g, '""')}"`,
        `"${(r.email || '').replace(/"/g, '""')}"`,
        `"${(r.Online || '').replace(/"/g, '""')}"`,
        `"${(r.Notes || '').replace(/"/g, '""')}"`,
        `"${(r.LastUpdated || '').replace(/"/g, '""')}"`,
        `"${getRecordId(r)}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers.join(','), ...rows.map(e => e.join(','))].join('\n'));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', csvContent);
      downloadAnchor.setAttribute('download', `mortgagee_clauses_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addToast('CSV Exported', 'Dataset exported as CSV spreadsheet.', 'success');
    }
  }, [records, addToast]);

  // Import Data (merge or replace)
  const importRecords = useCallback((incoming: MortgageRecord[], mode: 'merge' | 'replace') => {
    const valid = incoming
      .filter(r => r && r.Name && r.Name.trim() !== '' && r.Name.toLowerCase() !== 'delete')
      .map(r => ({
        ...r,
        _id: r._id || { $oid: generateObjectId() },
        LastUpdated: r.LastUpdated || formatCurrentTimestamp()
      }));

    if (valid.length === 0) {
      addToast('Import Failed', 'No valid mortgage records found in the uploaded file.', 'error');
      return;
    }

    if (mode === 'replace') {
      setRecords(valid);
      if (valid.length > 0) {
        setSelectedId(getRecordId(valid[0]));
      }
      syncBatchMortgages(valid, 'replace').then((ok) => {
        if (ok) {
          addToast('Import Successful', `Replaced and synced directory with ${valid.length} records to MongoDB.`, 'success');
        } else {
          addToast('Database Sync Error', 'Imported locally, but failed to sync to MongoDB.', 'error');
        }
      });
    } else {
      // Merge mode
      const existingMap = new Map<string, MortgageRecord>();
      records.forEach(r => {
        const id = getRecordId(r) || `${(r.Name || '').toLowerCase()}_${(r.Address || '').toLowerCase()}`;
        existingMap.set(id, r);
      });

      valid.forEach(r => {
        const id = getRecordId(r) || `${(r.Name || '').toLowerCase()}_${(r.Address || '').toLowerCase()}`;
        existingMap.set(id, r);
      });

      const merged = Array.from(existingMap.values());
      setRecords(merged);
      syncBatchMortgages(valid, 'merge').then((ok) => {
        if (ok) {
          addToast('Import Successful', `Merged and synced ${valid.length} records to MongoDB (Total now: ${merged.length}).`, 'success');
        } else {
          addToast('Database Sync Error', 'Merged locally, but failed to sync to MongoDB.', 'error');
        }
      });
    }
  }, [records, addToast]);

  return {
    records,
    filteredRecords,
    selectedId,
    setSelectedId,
    selectedRecord,
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    categoryFilter,
    setCategoryFilter,
    stateFilter,
    setStateFilter,
    sortOption,
    setSortOption,
    hasEmailOnly,
    setHasEmailOnly,
    hasPortalOnly,
    setHasPortalOnly,
    hasFaxOnly,
    setHasFaxOnly,
    hasPhoneOnly,
    setHasPhoneOnly,
    availableStates,
    stats,
    createRecord,
    updateRecord,
    deleteRecord,
    resetFilters,
    resetToFactoryDefault,
    resetToDefault: resetToFactoryDefault,
    exportData,
    importRecords,
    toasts,
    addToast,
    removeToast
  };
}
