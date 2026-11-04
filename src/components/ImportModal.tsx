import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { MortgageRecord } from '../types/mortgage';
import { generateObjectId, formatCurrentTimestamp } from '../utils/formatters';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (records: MortgageRecord[], mode: 'merge' | 'replace') => void;
}

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState<MortgageRecord[] | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const parseJsonContent = (text: string): MortgageRecord[] => {
    const raw = JSON.parse(text);
    if (!Array.isArray(raw)) {
      throw new Error('File content must be a JSON array of mortgage records.');
    }

    return raw
      .filter((item: any) => item && (item.Name || item.name))
      .map((item: any) => ({
        _id: item._id || { $oid: generateObjectId() },
        Name: String(item.Name || item.name || '').trim(),
        Name2: item.Name2 ? String(item.Name2).trim() : (item.clause ? String(item.clause).trim() : null),
        Address: item.Address ? String(item.Address).trim() : (item.address ? String(item.address).trim() : null),
        City: item.City ? String(item.City).trim() : (item.city ? String(item.city).trim() : null),
        State: item.State ? String(item.State).trim().toUpperCase() : (item.state ? String(item.state).trim().toUpperCase() : null),
        ZIP: item.ZIP ? String(item.ZIP).trim() : (item.zip ? String(item.zip).trim() : null),
        Telephone: item.Telephone ? String(item.Telephone).trim() : (item.telephone ? String(item.telephone).trim() : (item.phone ? String(item.phone).trim() : null)),
        Telephone2: item.Telephone2 ? String(item.Telephone2).trim() : null,
        FAX: item.FAX ? String(item.FAX).trim() : (item.fax ? String(item.fax).trim() : null),
        email: item.email ? String(item.email).trim() : null,
        Online: item.Online ? String(item.Online).trim() : (item.online ? String(item.online).trim() : null),
        Notes: item.Notes ? String(item.Notes).trim() : (item.notes ? String(item.notes).trim() : null),
        LastUpdated: item.LastUpdated || formatCurrentTimestamp()
      }));
  };

  const parseCsvContent = (text: string): MortgageRecord[] => {
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      throw new Error('CSV file must have a header line and at least one data row.');
    }

    const parseCsvLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const header = parseCsvLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
    
    const nameIdx = header.findIndex(h => h.includes('name') && !h.includes('2') && !h.includes('clause'));
    const name2Idx = header.findIndex(h => h.includes('name2') || h.includes('clause') || h.includes('isaoa'));
    const addrIdx = header.findIndex(h => h.includes('address') || h.includes('street'));
    const cityIdx = header.findIndex(h => h.includes('city'));
    const stateIdx = header.findIndex(h => h.includes('state') || h.includes('st'));
    const zipIdx = header.findIndex(h => h.includes('zip') || h.includes('postal'));
    const phoneIdx = header.findIndex(h => h.includes('telephone') || h.includes('phone'));
    const phone2Idx = header.findIndex(h => h.includes('telephone2') || h.includes('phone2') || h.includes('alt'));
    const faxIdx = header.findIndex(h => h.includes('fax'));
    const emailIdx = header.findIndex(h => h.includes('email') || h.includes('mail'));
    const onlineIdx = header.findIndex(h => h.includes('online') || h.includes('portal') || h.includes('web') || h.includes('url'));
    const notesIdx = header.findIndex(h => h.includes('note') || h.includes('remark'));

    const records: MortgageRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCsvLine(lines[i]);
      const name = nameIdx !== -1 ? cols[nameIdx] : cols[0];
      if (!name || !name.trim() || name.toLowerCase() === 'delete') continue;

      records.push({
        _id: { $oid: generateObjectId() },
        Name: name.trim(),
        Name2: name2Idx !== -1 && cols[name2Idx] ? cols[name2Idx].trim() : null,
        Address: addrIdx !== -1 && cols[addrIdx] ? cols[addrIdx].trim() : null,
        City: cityIdx !== -1 && cols[cityIdx] ? cols[cityIdx].trim() : null,
        State: stateIdx !== -1 && cols[stateIdx] ? cols[stateIdx].trim().toUpperCase() : null,
        ZIP: zipIdx !== -1 && cols[zipIdx] ? cols[zipIdx].trim() : null,
        Telephone: phoneIdx !== -1 && cols[phoneIdx] ? cols[phoneIdx].trim() : null,
        Telephone2: phone2Idx !== -1 && cols[phone2Idx] ? cols[phone2Idx].trim() : null,
        FAX: faxIdx !== -1 && cols[faxIdx] ? cols[faxIdx].trim() : null,
        email: emailIdx !== -1 && cols[emailIdx] ? cols[emailIdx].trim() : null,
        Online: onlineIdx !== -1 && cols[onlineIdx] ? cols[onlineIdx].trim() : null,
        Notes: notesIdx !== -1 && cols[notesIdx] ? cols[notesIdx].trim() : null,
        LastUpdated: formatCurrentTimestamp()
      });
    }

    return records;
  };

  const processFile = (file: File) => {
    setErrorMsg(null);
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        let records: MortgageRecord[] = [];

        if (file.name.endsWith('.json') || text.trim().startsWith('[') || text.trim().startsWith('{')) {
          records = parseJsonContent(text);
        } else {
          records = parseCsvContent(text);
        }

        if (records.length === 0) {
          throw new Error('No valid mortgage records found in file.');
        }

        setParsedData(records);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Failed to parse file.');
        setParsedData(null);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read file from disk.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (parsedData && parsedData.length > 0) {
      onImport(parsedData, importMode);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mortgage-import-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white border border-[#a8b3c0] rounded-[8px] w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-[#222]">
        {/* Modal Header Bar with Nested Close Button */}
        <div className="qq-modal-header px-4 py-2.5 flex items-center justify-between gap-2 text-white shadow-xs select-none">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-[3px] bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Upload className="w-3.5 h-3.5 text-white" />
            </div>
            <h3 id="mortgage-import-title" className="text-sm font-bold text-white tracking-wide truncate">
              Import Mortgagee & Loss Payee Dataset
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

        {/* Modal Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Upload Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-[3px] p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
              dragActive
                ? 'border-[#0066c0] bg-[#e8f1fb] text-[#004b91]'
                : 'border-[#b8b8b8] hover:border-[#888] bg-white text-[#555]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.csv,application/json,text/csv"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="w-10 h-10 rounded-full bg-[#f0f4f9] border border-[#d0dbe8] flex items-center justify-center text-[#004b91]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-[#222] text-[13px]">
                Click to browse or drop your JSON / CSV file here
              </p>
              <p className="text-[11px] text-[#777] mt-0.5">
                Compatible with any 700+ record dataset, MongoDB exports, or agency spreadsheets
              </p>
            </div>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-[2px] flex items-start gap-2 text-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[12px]">Failed to parse file</p>
                <p className="text-[11px] text-rose-700 mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Parsed File Preview & Stats */}
          {parsedData && (
            <div className="p-3 bg-white border border-[#d8d8d8] rounded-[3px] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#004b91]" />
                  <span className="font-bold text-[#222]">{fileName}</span>
                  <span className="text-[#777] text-[11px]">({fileSize})</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[#2f6f1c] font-bold text-[11.5px] px-2 py-0.5 rounded bg-[#edf7eb] border border-[#bce2b6]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{parsedData.length} records detected</span>
                </span>
              </div>

              {/* Sample list */}
              <div className="bg-[#f9f9f9] border border-[#e8e8e8] rounded-[2px] p-2 max-h-28 overflow-y-auto divide-y divide-[#eee] text-[11px]">
                <p className="text-[10px] text-[#777] font-bold uppercase tracking-wider mb-1">
                  Sample Data (First 3 entries):
                </p>
                {parsedData.slice(0, 3).map((r, i) => (
                  <div key={i} className="py-1 flex items-center justify-between text-[#333]">
                    <span className="font-medium truncate max-w-[240px]">{r.Name}</span>
                    <span className="text-[#777] font-mono text-[10.5px]">
                      {r.City ? `${r.City}, ${r.State || ''}` : 'Location N/A'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Merge vs Replace Mode */}
              <div className="pt-2 border-t border-[#eee] space-y-1.5">
                <label className="block text-[#333] font-bold text-[11.5px]">Import Mode:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setImportMode('merge')}
                    className={`p-2 rounded-[2px] border text-left transition-all ${
                      importMode === 'merge'
                        ? 'bg-[#e8f1fb] border-[#0066c0] text-[#004b91]'
                        : 'bg-white border-[#d0d0d0] text-[#555] hover:bg-[#fafafa]'
                    }`}
                  >
                    <p className="font-bold text-[11.5px]">Merge & Update</p>
                    <p className="text-[10px] text-[#666] mt-0.5">Combine new records with existing directory</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImportMode('replace')}
                    className={`p-2 rounded-[2px] border text-left transition-all ${
                      importMode === 'replace'
                        ? 'bg-[#fff5e6] border-[#d97706] text-[#b45309]'
                        : 'bg-white border-[#d0d0d0] text-[#555] hover:bg-[#fafafa]'
                    }`}
                  >
                    <p className="font-bold text-[11.5px]">Replace Entirely</p>
                    <p className="text-[10px] text-[#666] mt-0.5">Overwrite directory with only this file</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
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
              disabled={!parsedData || parsedData.length === 0}
              onClick={handleConfirmImport}
              className="qq-btn-green py-1.5 px-4 text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Import {parsedData ? `${parsedData.length} Records` : 'Dataset'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
