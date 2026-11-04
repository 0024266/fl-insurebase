import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Landmark, Wind } from 'lucide-react';
import { FloridaZipRecord } from '../types/permits';
import { formatZipCode } from '../utils/permitFormatters';
import { validatePermitForm } from '../utils/validation';

interface PermitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recordData: Omit<FloridaZipRecord, '_id'>) => void;
  editingRecord: FloridaZipRecord | null;
  isDuplicate?: boolean;
}

export function PermitFormModal({
  isOpen,
  onClose,
  onSave,
  editingRecord,
  isDuplicate = false
}: PermitFormModalProps) {
  const isEditing = Boolean(editingRecord) && !isDuplicate;

  const [formData, setFormData] = useState({
    zip: '',
    City: '',
    County: '',
    State: 'FL',
    PAlink: '',
    PermitByCounty: '',
    PermitByCity: '',
    lat: '',
    long: '',
    Terrain: 'B'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        zip: formatZipCode(editingRecord.zip),
        City: editingRecord.City || '',
        County: editingRecord.County || '',
        State: editingRecord.State || 'FL',
        PAlink: editingRecord.PAlink || '',
        PermitByCounty: editingRecord.PermitByCounty || '',
        PermitByCity: editingRecord.PermitByCity || '',
        lat: editingRecord.lat !== undefined ? String(editingRecord.lat) : '',
        long: editingRecord.long !== undefined ? String(editingRecord.long) : '',
        Terrain: editingRecord.Terrain || 'B'
      });
    } else {
      setFormData({
        zip: '',
        City: '',
        County: '',
        State: 'FL',
        PAlink: '',
        PermitByCounty: '',
        PermitByCity: '',
        lat: '',
        long: '',
        Terrain: 'B'
      });
    }
    setErrors({});
  }, [editingRecord, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const { isValid, errors: validationErrors } = validatePermitForm({
      zip: formData.zip,
      City: formData.City,
      County: formData.County,
      PAlink: formData.PAlink,
      PermitByCounty: formData.PermitByCounty,
      PermitByCity: formData.PermitByCity
    });

    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const latNum = formData.lat.trim() ? parseFloat(formData.lat) : undefined;
    const longNum = formData.long.trim() ? parseFloat(formData.long) : undefined;

    onSave({
      zip: formatZipCode(formData.zip.trim()),
      City: formData.City.trim(),
      County: formData.County.trim().toUpperCase(),
      State: formData.State.trim().toUpperCase() || 'FL',
      PAlink: formData.PAlink.trim() || null,
      PermitByCounty: formData.PermitByCounty.trim() || null,
      PermitByCity: formData.PermitByCity.trim() || null,
      lat: Number.isNaN(latNum) ? undefined : latNum,
      long: Number.isNaN(longNum) ? undefined : longNum,
      Terrain: formData.Terrain.trim().toUpperCase() || 'B'
    });

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="permit-form-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white border border-[#a8b3c0] rounded-[8px] w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-[#222]">
        {/* Header Bar with Fully Visible Nested Close Button */}
        <div className="qq-modal-header px-4 py-2.5 flex items-center justify-between gap-2 text-white shadow-xs shrink-0 select-none">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-[3px] bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Landmark className="w-3.5 h-3.5 text-white" />
            </div>
            <h3 id="permit-form-modal-title" className="text-sm font-bold text-white tracking-wide truncate">
              {isDuplicate
                ? 'Duplicate & Edit Florida Jurisdiction Record'
                : isEditing
                ? 'Editing Florida Jurisdiction & Permit Record'
                : 'Adding A New Florida Jurisdiction Record'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5 text-[12px] bg-[#fbfcfd]">
          {/* Row 1: ZIP, City, County */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#222] font-semibold mb-1">
                ZIP Code <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="e.g. 34432"
                maxLength={5}
                className={`app-input w-full font-mono font-bold text-[13px] ${
                  errors.zip ? 'border-rose-500 bg-rose-50/50' : ''
                }`}
              />
              {errors.zip && (
                <p className="text-rose-600 text-[10.5px] mt-0.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.zip}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#222] font-semibold mb-1">
                City / Municipality <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="City"
                value={formData.City}
                onChange={handleChange}
                placeholder="e.g. DUNNELLON"
                className={`app-input w-full uppercase ${
                  errors.City ? 'border-rose-500 bg-rose-50/50' : ''
                }`}
              />
              {errors.City && (
                <p className="text-rose-600 text-[10.5px] mt-0.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.City}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#222] font-semibold mb-1">
                County <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="County"
                value={formData.County}
                onChange={handleChange}
                placeholder="e.g. MARION"
                className={`app-input w-full uppercase ${
                  errors.County ? 'border-rose-500 bg-rose-50/50' : ''
                }`}
              />
              {errors.County && (
                <p className="text-rose-600 text-[10.5px] mt-0.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.County}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Wind Terrain & Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white border border-[#d2d9e2] rounded-[4px] shadow-2xs">
            <div>
              <label className="block text-[#333] font-semibold mb-1 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-[#555]" />
                Wind Terrain Exposure
              </label>
              <select
                name="Terrain"
                value={formData.Terrain}
                onChange={handleChange}
                className="app-input w-full font-semibold"
              >
                <option value="B">Terrain B (Inland / Suburban)</option>
                <option value="C">Terrain C (Coastal / Open / High Wind)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#555] font-semibold mb-1">
                Latitude (Optional)
              </label>
              <input
                type="text"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                placeholder="29.0494"
                className="app-input w-full font-mono"
              />
            </div>

            <div>
              <label className="block text-[#555] font-semibold mb-1">
                Longitude (Optional)
              </label>
              <input
                type="text"
                name="long"
                value={formData.long}
                onChange={handleChange}
                placeholder="-82.4609"
                className="app-input w-full font-mono"
              />
            </div>
          </div>

          {/* Row 3: Official Links with Validation Feedback */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-[#222] font-semibold mb-1 flex items-center justify-between">
                <span>Property Appraiser (PA) Portal URL</span>
                <span className="text-[10.5px] text-[#666] font-normal font-mono">https://...</span>
              </label>
              <input
                type="url"
                name="PAlink"
                value={formData.PAlink}
                onChange={handleChange}
                placeholder="https://www.pa.marion.fl.us/"
                className={`app-input w-full font-mono text-[11.5px] ${
                  errors.PAlink ? 'border-rose-500 bg-rose-50/50' : ''
                }`}
              />
              {errors.PAlink && (
                <p className="text-rose-600 text-[10.5px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.PAlink}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#222] font-semibold mb-1 flex items-center justify-between">
                <span>County Building Department / Permit Portal URL</span>
                <span className="text-[10.5px] text-[#666] font-normal font-mono">https://...</span>
              </label>
              <input
                type="url"
                name="PermitByCounty"
                value={formData.PermitByCounty}
                onChange={handleChange}
                placeholder="https://www.marionfl.org/departments/building-safety"
                className={`app-input w-full font-mono text-[11.5px] ${
                  errors.PermitByCounty ? 'border-rose-500 bg-rose-50/50' : ''
                }`}
              />
              {errors.PermitByCounty && (
                <p className="text-rose-600 text-[10.5px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.PermitByCounty}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#222] font-semibold mb-1 flex items-center justify-between">
                <span>City / Municipal Building Department URL (Optional)</span>
                <span className="text-[10.5px] text-[#666] font-normal font-mono">https://...</span>
              </label>
              <input
                type="url"
                name="PermitByCity"
                value={formData.PermitByCity}
                onChange={handleChange}
                placeholder="https://www.dunnellon.org/building (leave empty if county serviced)"
                className={`app-input w-full font-mono text-[11.5px] ${
                  errors.PermitByCity ? 'border-rose-500 bg-rose-50/50' : ''
                }`}
              />
              {errors.PermitByCity && (
                <p className="text-rose-600 text-[10.5px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.PermitByCity}
                </p>
              )}
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-3 border-t border-[#d8e0e8] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="qq-btn-secondary py-1.5 px-4 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="qq-btn-green py-1.5 px-5 text-xs flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <span>{isDuplicate ? 'Duplicate & Save Record ✎' : isEditing ? 'Save Record ✎' : 'Add Record ✎'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
