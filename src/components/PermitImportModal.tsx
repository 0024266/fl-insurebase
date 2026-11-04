import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Database,
  ArrowRight
} from 'lucide-react';
import { FloridaZipRecord } from '../types/permits';
import { formatZipCode } from '../utils/permitFormatters';

interface PermitImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (records: FloridaZipRecord[], mode: 'merge' | 'replace') => void;
}

export function PermitImportModal({
  isOpen,
  onClose,
  onImport
}: PermitImportModalProps) {
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState<FloridaZipRecord[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'file' | 'paste'>('paste');
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const parseJSON = (text: string): FloridaZipRecord[] => {
    const raw = JSON.parse(text);
    if (!Array.isArray(raw)) {
      throw new Error('Expected JSON array of Florida ZIP records.');
    }
    return raw.map((item: any) => ({
      _id: item._id || undefined,
      zip: formatZipCode(item.zip),
      City: item.City || item.city || '',
      County: (item.County || item.county || '').toUpperCase(),
      State: (item.State || item.state || 'FL').toUpperCase(),
      PAlink: item.PAlink || item.paLink || item.PALink || item.pa_link || null,
      PermitByCounty:
        item.PermitByCounty || item.permitByCounty || item.countyPermit || null,
      PermitByCity:
        item.PermitByCity || item.permitByCity || item.cityPermit || null,
      lat: typeof item.lat === 'number' ? item.lat : undefined,
      long: typeof item.long === 'number' ? item.long : undefined,
      Terrain: item.Terrain || item.terrain || undefined
    }));
  };

  const parseCSV = (text: string): FloridaZipRecord[] => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      throw new Error('CSV file must have a header line and at least one data row.');
    }

    const header = lines[0].split(',').map((h) => h.replace(/^["']|["']$/g, '').trim().toLowerCase());
    const zipIdx = header.findIndex((h) => h.includes('zip'));
    const cityIdx = header.findIndex((h) => h.includes('city') || h.includes('muni'));
    const countyIdx = header.findIndex((h) => h.includes('county'));
    const paIdx = header.findIndex((h) => h.includes('pa') || h.includes('appraiser'));
    const countyPermitIdx = header.findIndex((h) => h.includes('countypermit') || h.includes('permitbycounty'));
    const cityPermitIdx = header.findIndex((h) => h.includes('citypermit') || h.includes('permitbycity'));
    const terrainIdx = header.findIndex((h) => h.includes('terrain') || h.includes('wind'));

    if (zipIdx === -1) {
      throw new Error('CSV must contain a "ZIP" column header.');
    }

    const records: FloridaZipRecord[] = [];
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map((c) => c.replace(/^["']|["']$/g, '').trim());
      if (!row[zipIdx]) continue;

      records.push({
        _id: String(row[zipIdx]),
        zip: formatZipCode(row[zipIdx]),
        City: cityIdx >= 0 ? row[cityIdx] : '',
        County: countyIdx >= 0 ? row[countyIdx].toUpperCase() : '',
        State: 'FL',
        PAlink: paIdx >= 0 && row[paIdx] ? row[paIdx] : null,
        PermitByCounty: countyPermitIdx >= 0 && row[countyPermitIdx] ? row[countyPermitIdx] : null,
        PermitByCity: cityPermitIdx >= 0 && row[cityPermitIdx] ? row[cityPermitIdx] : null,
        Terrain: terrainIdx >= 0 && row[terrainIdx] ? row[terrainIdx].toUpperCase() : undefined
      });
    }

    return records;
  };

  const handleValidateText = (text: string) => {
    setParseError(null);
    setParsedData(null);
    if (!text.trim()) return;

    try {
      let records: FloridaZipRecord[] = [];
      if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
        records = parseJSON(text);
      } else {
        records = parseCSV(text);
      }

      if (records.length === 0) {
        setParseError('No valid records found in provided input.');
      } else {
        setParsedData(records);
      }
    } catch (err: any) {
      setParseError(err.message || 'Failed to parse JSON/CSV.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content);
      handleValidateText(content);
    };
    reader.onerror = () => {
      setParseError('Failed to read selected file.');
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (parsedData && parsedData.length > 0) {
      onImport(parsedData, importMode);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="permit-import-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white border border-[#a8b3c0] rounded-[8px] w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-[#222]">
        {/* Modal Header Bar with Nested Close Button */}
        <div className="qq-modal-header px-4 py-2.5 flex items-center justify-between text-white shadow-xs select-none">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-[3px] bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Upload className="w-3.5 h-3.5 text-white" />
            </div>
            <h3 id="permit-import-title" className="text-sm font-bold text-white tracking-wide truncate">
              Import Florida Permits & Appraiser Dataset
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog (Esc)"
            className="qq-modal-close-btn shrink-0 cursor-pointer shadow-md"
            title="Close (Esc)"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Tab navigation */}
          <div className="flex border-b border-[#d0d0d0] gap-4 text-[12px] font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`pb-2 px-1 cursor-pointer transition-colors ${
                activeTab === 'paste'
                  ? 'border-b-2 border-[#004b91] text-[#004b91]'
                  : 'text-[#666] hover:text-[#222]'
              }`}
            >
              Paste JSON / CSV
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('file')}
              className={`pb-2 px-1 cursor-pointer transition-colors ${
                activeTab === 'file'
                  ? 'border-b-2 border-[#004b91] text-[#004b91]'
                  : 'text-[#666] hover:text-[#222]'
              }`}
            >
              Upload File (.json, .csv)
            </button>
          </div>

          {activeTab === 'file' ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#c0c0c0] hover:border-[#004b91] bg-white p-6 rounded-[3px] text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json,.csv,application/json,text/csv"
                className="hidden"
              />
              <FileText className="w-8 h-8 text-[#888]" />
              <div>
                <p className="font-semibold text-[#111]">
                  {fileName ? fileName : 'Click to select JSON or CSV file'}
                </p>
                <p className="text-[11px] text-[#777] mt-0.5">
                  Supports full Florida 2,100+ ZIP dataset in standard JSON/CSV schema
                </p>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[#333] font-semibold mb-1">
                Paste Raw JSON Array or CSV text:
              </label>
              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  handleValidateText(e.target.value);
                }}
                placeholder='[{"zip": 33010, "City": "Hialeah", "County": "MIAMI-DADE", "PAlink": "...", "PermitByCounty": "...", "PermitByCity": "...", "Terrain": "C"}, ...]'
                className="app-input w-full font-mono text-[11px] resize-none"
              />
            </div>
          )}

          {/* Validation Feedback */}
          {parseError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-[2px] text-rose-800 text-[11.5px] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{parseError}</span>
            </div>
          )}

          {parsedData && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-emerald-900 text-[11.5px] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Valid Dataset:</strong> {parsedData.length.toLocaleString()} Florida ZIP records ready to import.
                </span>
              </div>
            </div>
          )}

          {/* Import Strategy: Merge vs Replace */}
          <div className="p-3 bg-[#f3f4f6] border border-[#d8d8d8] rounded-[2px] space-y-2">
            <span className="font-bold text-[#222] block text-[11.5px]">
              Import Behavior:
            </span>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-[#333]">
                <input
                  type="radio"
                  name="importMode"
                  value="merge"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                  className="accent-[#004b91]"
                />
                <span>
                  <strong>Merge & Update</strong> (adds new ZIPs, updates existing)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[#333]">
                <input
                  type="radio"
                  name="importMode"
                  value="replace"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="accent-[#004b91]"
                />
                <span>
                  <strong>Replace Entire Database</strong> (overwrites all)
                </span>
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="qq-btn-secondary py-1.5 px-3.5 text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecuteImport}
              disabled={!parsedData || parsedData.length === 0}
              className="qq-btn-green py-1.5 px-4 text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Import Records</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
