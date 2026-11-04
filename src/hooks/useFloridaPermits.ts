import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FloridaZipRecord,
  PermitTerrainFilter,
  PermitSortOption,
  PermitStats,
  BulkUpdateLinksOptions
} from '../types/permits';
import { ToastMessage } from '../types/mortgage';
import { INITIAL_FLORIDA_PERMIT_DATASET } from '../data/initialPermitRecords';
import {
  getPermitRecordId,
  formatZipCode,
  matchesPermitSearch,
  deduplicatePermitRecords,
  generatePermitObjectId
} from '../utils/permitFormatters';
import { formatCurrentTimestamp } from '../utils/formatters';

const PERMIT_STORAGE_KEY = 'agency_fl_permits_db';

export function useFloridaPermits(
  addToast: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void
) {
  // Load initial data from localStorage or seed dataset
  const [records, setRecords] = useState<FloridaZipRecord[]>(() => {
    try {
      const stored = localStorage.getItem(PERMIT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize and upgrade any known legacy URLs like Marion County Property Appraiser
          const sanitized = parsed.map((item: FloridaZipRecord) => {
            if (
              item &&
              (item.County === 'MARION' || String(item.County).toUpperCase() === 'MARION') &&
              (!item.PAlink ||
                item.PAlink === 'https://www.pa.marion.fl.us/' ||
                item.PAlink === 'https://www.pa.marion.fl.us' ||
                item.PAlink === 'http://www.pa.marion.fl.us/')
            ) {
              return { ...item, PAlink: 'https://www.pa.marion.fl.us/PropertySearch.aspx' };
            }
            return item;
          });
          // Merge with initial dataset to ensure all new records are available
          const combined = [...INITIAL_FLORIDA_PERMIT_DATASET, ...sanitized];
          return deduplicatePermitRecords(combined);
        }
      }
    } catch (e) {
      console.error('Error reading permit localStorage:', e);
    }
    return deduplicatePermitRecords(INITIAL_FLORIDA_PERMIT_DATASET);
  });

  // Selected Record ID (defaults to empty so reload stays on list view)
  const [selectedId, setSelectedId] = useState<string>('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [countyFilter, setCountyFilter] = useState<string>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [terrainFilter, setTerrainFilter] = useState<PermitTerrainFilter>('all');
  const [hasCityPermitOnly, setHasCityPermitOnly] = useState<boolean>(false);
  const [hasCountyPermitOnly, setHasCountyPermitOnly] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<PermitSortOption>('zip_asc');

  // Pagination state
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 180);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, countyFilter, cityFilter, terrainFilter, hasCityPermitOnly, hasCountyPermitOnly, sortOption, pageSize]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PERMIT_STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save permits to localStorage:', e);
    }
  }, [records]);

  // Unique list of Florida Counties for the dropdown
  const uniqueCounties = useMemo(() => {
    const countySet = new Set<string>();
    records.forEach(r => {
      const c = (r.County || '').trim().toUpperCase();
      if (c) countySet.add(c);
    });
    return Array.from(countySet).sort();
  }, [records]);

  // Available cities filtered by selected county (or all cities if ALL counties)
  const availableCities = useMemo(() => {
    const citySet = new Set<string>();
    records.forEach(r => {
      const city = (r.City || '').trim().toUpperCase();
      const county = (r.County || '').trim().toUpperCase();
      if (!city) return;
      if (countyFilter === 'ALL' || county === countyFilter.toUpperCase()) {
        citySet.add(city);
      }
    });
    return Array.from(citySet).sort();
  }, [records, countyFilter]);

  // All unique Florida municipalities/cities across the entire database
  const allCities = useMemo(() => {
    const citySet = new Set<string>();
    records.forEach(r => {
      const city = (r.City || '').trim().toUpperCase();
      if (city) citySet.add(city);
    });
    return Array.from(citySet).sort();
  }, [records]);

  // Safe county setter that validates cityFilter
  const handleSetCountyFilter = useCallback((newCounty: string) => {
    setCountyFilter(newCounty);
    if (newCounty !== 'ALL' && cityFilter !== 'ALL') {
      const isValidInNewCounty = records.some(
        r =>
          (r.County || '').trim().toUpperCase() === newCounty.toUpperCase() &&
          (r.City || '').trim().toUpperCase() === cityFilter.toUpperCase()
      );
      if (!isValidInNewCounty) {
        setCityFilter('ALL');
      }
    }
  }, [records, cityFilter]);

  // Filter and Sort records
  const filteredRecords = useMemo(() => {
    return records
      .filter(record => {
        // Multi-term search
        if (debouncedQuery && !matchesPermitSearch(record, debouncedQuery)) {
          return false;
        }

        // County filter
        if (countyFilter !== 'ALL') {
          const recCounty = (record.County || '').trim().toUpperCase();
          if (recCounty !== countyFilter.toUpperCase()) {
            return false;
          }
        }

        // City filter
        if (cityFilter !== 'ALL') {
          const recCity = (record.City || '').trim().toUpperCase();
          if (recCity !== cityFilter.toUpperCase()) {
            return false;
          }
        }

        // Terrain filter
        if (terrainFilter !== 'all') {
          const recTerrain = (record.Terrain || '').trim().toUpperCase();
          if (recTerrain !== terrainFilter.toUpperCase()) {
            return false;
          }
        }

        // Quick filters
        if (hasCityPermitOnly && (!record.PermitByCity || !record.PermitByCity.trim())) {
          return false;
        }
        if (hasCountyPermitOnly && (!record.PermitByCounty || !record.PermitByCounty.trim())) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const zipA = Number(a.zip) || 0;
        const zipB = Number(b.zip) || 0;
        const cityA = (a.City || '').toLowerCase();
        const cityB = (b.City || '').toLowerCase();
        const countyA = (a.County || '').toLowerCase();
        const countyB = (b.County || '').toLowerCase();

        if (sortOption === 'zip_asc') return zipA - zipB;
        if (sortOption === 'zip_desc') return zipB - zipA;
        if (sortOption === 'city_asc') return cityA.localeCompare(cityB);
        if (sortOption === 'city_desc') return cityB.localeCompare(cityA);
        if (sortOption === 'county_asc') return countyA.localeCompare(countyB) || zipA - zipB;
        if (sortOption === 'county_desc') return countyB.localeCompare(countyA) || zipA - zipB;
        return 0;
      });
  }, [records, debouncedQuery, countyFilter, cityFilter, terrainFilter, hasCityPermitOnly, hasCountyPermitOnly, sortOption]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedRecords = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredRecords.slice(startIndex, startIndex + pageSize);
  }, [filteredRecords, safeCurrentPage, pageSize]);

  // Selected Record
  const selectedRecord = useMemo(() => {
    if (!selectedId) return filteredRecords[0] || null;
    return records.find(r => getPermitRecordId(r) === selectedId) || filteredRecords[0] || null;
  }, [records, selectedId, filteredRecords]);

  // Stats
  const stats: PermitStats = useMemo(() => {
    let hasCityPermitCount = 0;
    let hasCountyPermitCount = 0;
    let terrainCCount = 0;
    let terrainBCount = 0;

    records.forEach(r => {
      if (r.PermitByCity && r.PermitByCity.trim()) hasCityPermitCount++;
      if (r.PermitByCounty && r.PermitByCounty.trim()) hasCountyPermitCount++;
      if ((r.Terrain || '').toUpperCase() === 'C') terrainCCount++;
      if ((r.Terrain || '').toUpperCase() === 'B') terrainBCount++;
    });

    return {
      total: records.length,
      filteredCount: filteredRecords.length,
      hasCityPermitCount,
      hasCountyPermitCount,
      terrainCCount,
      terrainBCount,
      uniqueCountiesCount: uniqueCounties.length
    };
  }, [records, filteredRecords, uniqueCounties]);

  // CRUD: Create
  const createRecord = useCallback((newRecordData: Omit<FloridaZipRecord, '_id'>) => {
    const newId = generatePermitObjectId();
    const newRecord: FloridaZipRecord = {
      ...newRecordData,
      _id: { $oid: newId },
      zip: formatZipCode(newRecordData.zip),
      City: (newRecordData.City || '').trim(),
      County: (newRecordData.County || '').trim().toUpperCase(),
      State: (newRecordData.State || 'FL').trim().toUpperCase(),
      LastUpdated: formatCurrentTimestamp()
    };

    setRecords(prev => [newRecord, ...prev]);
    setSelectedId(newId);
    addToast('Permit Record Created', `ZIP ${newRecord.zip} (${newRecord.City}) added.`, 'success');
    return newId;
  }, [addToast]);

  // CRUD: Update
  const updateRecord = useCallback((id: string, updatedFields: Partial<FloridaZipRecord>) => {
    setRecords(prev =>
      prev.map(item => {
        if (getPermitRecordId(item) === id) {
          return {
            ...item,
            ...updatedFields,
            zip: updatedFields.zip !== undefined ? formatZipCode(updatedFields.zip) : item.zip,
            City: updatedFields.City !== undefined ? updatedFields.City.trim() : item.City,
            County: updatedFields.County !== undefined ? updatedFields.County.trim().toUpperCase() : item.County,
            LastUpdated: formatCurrentTimestamp()
          };
        }
        return item;
      })
    );
    addToast('Permit Record Updated', 'Changes saved successfully.', 'success');
  }, [addToast]);

  // CRUD: Delete
  const deleteRecord = useCallback((id: string) => {
    const itemToDelete = records.find(r => getPermitRecordId(r) === id);
    setRecords(prev => {
      const remaining = prev.filter(r => getPermitRecordId(r) !== id);
      if (selectedId === id) {
        setSelectedId(remaining.length > 0 ? getPermitRecordId(remaining[0]) : '');
      }
      return remaining;
    });
    addToast('Record Deleted', `ZIP ${itemToDelete?.zip || ''} removed.`, 'info');
  }, [records, selectedId, addToast]);

  // Bulk update links across multiple records matching criteria
  const bulkUpdateLinks = useCallback(
    (options: BulkUpdateLinksOptions): number => {
      const {
        scope,
        targetCity,
        targetCounty,
        customZips,
        selectedRecordIds,
        updatePaLink,
        newPaLink,
        updateCountyPermitLink,
        newCountyPermitLink,
        updateCityPermitLink,
        newCityPermitLink,
        onlyIfEmpty
      } = options;

      const normCity = (targetCity || '').trim().toUpperCase();
      const normCounty = (targetCounty || '').trim().toUpperCase();
      const zipsSet = new Set((customZips || []).map(z => formatZipCode(z)));
      const idsSet = selectedRecordIds && selectedRecordIds.length > 0 ? new Set(selectedRecordIds) : null;

      let changedCount = 0;

      setRecords(prev => {
        return prev.map(rec => {
          const recId = getPermitRecordId(rec);
          if (idsSet && !idsSet.has(recId)) {
            return rec;
          }

          const recCity = (rec.City || '').trim().toUpperCase();
          const recCounty = (rec.County || '').trim().toUpperCase();
          const recZip = formatZipCode(rec.zip);

          // Evaluate scope match
          let matches = false;
          if (scope === 'city') {
            matches = normCity ? recCity === normCity : false;
          } else if (scope === 'county') {
            matches = normCounty ? recCounty === normCounty : false;
          } else if (scope === 'city_and_county') {
            matches =
              (normCity ? recCity === normCity : true) &&
              (normCounty ? recCounty === normCounty : true);
          } else if (scope === 'zips') {
            matches = zipsSet.has(recZip);
          } else if (scope === 'filtered') {
            matches = idsSet ? idsSet.has(recId) : true;
          }

          if (!matches) {
            return rec;
          }

          let recChanged = false;
          let paLink = rec.PAlink;
          let countyPermit = rec.PermitByCounty;
          let cityPermit = rec.PermitByCity;

          if (updatePaLink) {
            const trimmed = (newPaLink || '').trim();
            const val = trimmed ? trimmed : null;
            if (!onlyIfEmpty || !paLink) {
              if (paLink !== val) {
                paLink = val;
                recChanged = true;
              }
            }
          }

          if (updateCountyPermitLink) {
            const trimmed = (newCountyPermitLink || '').trim();
            const val = trimmed ? trimmed : null;
            if (!onlyIfEmpty || !countyPermit) {
              if (countyPermit !== val) {
                countyPermit = val;
                recChanged = true;
              }
            }
          }

          if (updateCityPermitLink) {
            const trimmed = (newCityPermitLink || '').trim();
            const val = trimmed ? trimmed : null;
            if (!onlyIfEmpty || !cityPermit) {
              if (cityPermit !== val) {
                cityPermit = val;
                recChanged = true;
              }
            }
          }

          if (recChanged) {
            changedCount++;
            return {
              ...rec,
              PAlink: paLink,
              PermitByCounty: countyPermit,
              PermitByCity: cityPermit,
              LastUpdated: formatCurrentTimestamp()
            };
          }

          return rec;
        });
      });

      addToast(
        'Bulk Link Update Applied',
        `Successfully updated portal links for ${changedCount} record${changedCount === 1 ? '' : 's'}.`,
        'success'
      );

      return changedCount;
    },
    [addToast]
  );

  // Reset search and filters (safe for public & regular use - preserves imported records)
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setCountyFilter('ALL');
    setCityFilter('ALL');
    setTerrainFilter('all');
    setHasCityPermitOnly(false);
    setHasCountyPermitOnly(false);
    setSortOption('zip_asc');
    setCurrentPage(1);
    if (records.length > 0) {
      setSelectedId(getPermitRecordId(records[0]));
    }
    addToast('View Refreshed', 'Search query and filters cleared.', 'info');
  }, [records, addToast]);

  // Reset to default dataset (admin only with confirmation)
  const resetToFactoryDefault = useCallback(() => {
    const sanitized = deduplicatePermitRecords(INITIAL_FLORIDA_PERMIT_DATASET);
    setRecords(sanitized);
    if (sanitized.length > 0) {
      setSelectedId(getPermitRecordId(sanitized[0]));
    }
    setSearchQuery('');
    setCountyFilter('ALL');
    setCityFilter('ALL');
    setTerrainFilter('all');
    setHasCityPermitOnly(false);
    setHasCountyPermitOnly(false);
    setSortOption('zip_asc');
    setCurrentPage(1);
    addToast('Database Reset', `Reverted to ${sanitized.length} default Florida ZIP records.`, 'info');
  }, [addToast]);

  // Export Data (JSON or CSV)
  const exportData = useCallback((format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `florida_permits_appraisers_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addToast('Permits JSON Exported', 'Dataset exported as JSON file.', 'success');
    } else {
      const headers = ['ZIP', 'City', 'County', 'State', 'PropertyAppraiser_URL', 'PermitByCounty_URL', 'PermitByCity_URL', 'Latitude', 'Longitude', 'WindTerrain', 'LastUpdated', 'RecordID'];
      const rows = records.map(r => [
        `"${formatZipCode(r.zip)}"`,
        `"${(r.City || '').replace(/"/g, '""')}"`,
        `"${(r.County || '').replace(/"/g, '""')}"`,
        `"${(r.State || 'FL').replace(/"/g, '""')}"`,
        `"${(r.PAlink || '').replace(/"/g, '""')}"`,
        `"${(r.PermitByCounty || '').replace(/"/g, '""')}"`,
        `"${(r.PermitByCity || '').replace(/"/g, '""')}"`,
        `"${r.lat ?? ''}"`,
        `"${r.long ?? ''}"`,
        `"${(r.Terrain || '').replace(/"/g, '""')}"`,
        `"${(r.LastUpdated || '').replace(/"/g, '""')}"`,
        `"${getPermitRecordId(r)}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers.join(','), ...rows.map(e => e.join(','))].join('\n'));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', csvContent);
      downloadAnchor.setAttribute('download', `florida_permits_appraisers_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addToast('Permits CSV Exported', 'Dataset exported as CSV spreadsheet.', 'success');
    }
  }, [records, addToast]);

  // Import Data (merge or replace)
  const importRecords = useCallback((incoming: FloridaZipRecord[], mode: 'merge' | 'replace') => {
    const valid = incoming.filter(r => r && (r.zip || r.City));
    if (valid.length === 0) {
      addToast('Import Failed', 'No valid Florida ZIP / permit records found in file.', 'error');
      return;
    }

    const sanitized = deduplicatePermitRecords(valid);

    if (mode === 'replace') {
      setRecords(sanitized);
      if (sanitized.length > 0) {
        setSelectedId(getPermitRecordId(sanitized[0]));
      }
      setCurrentPage(1);
      addToast('Import Successful', `Replaced permit directory with ${sanitized.length} records.`, 'success');
    } else {
      // Merge mode
      setRecords(prev => {
        const merged = deduplicatePermitRecords([...prev, ...sanitized]);
        addToast('Import Successful', `Merged ${sanitized.length} records (Total now: ${merged.length}).`, 'success');
        return merged;
      });
    }
  }, [addToast]);

  return {
    records,
    filteredRecords,
    paginatedRecords,
    selectedId,
    setSelectedId,
    selectedRecord,
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    countyFilter,
    setCountyFilter: handleSetCountyFilter,
    cityFilter,
    setCityFilter,
    availableCities,
    terrainFilter,
    setTerrainFilter,
    hasCityPermitOnly,
    setHasCityPermitOnly,
    hasCountyPermitOnly,
    setHasCountyPermitOnly,
    sortOption,
    setSortOption,
    pageSize,
    setPageSize,
    currentPage: safeCurrentPage,
    setCurrentPage,
    totalPages,
    uniqueCounties,
    allCities,
    stats,
    createRecord,
    updateRecord,
    bulkUpdateLinks,
    deleteRecord,
    resetFilters,
    resetToFactoryDefault,
    resetToDefault: resetToFactoryDefault,
    exportData,
    importRecords
  };
}
