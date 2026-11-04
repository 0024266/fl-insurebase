import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Building2 } from 'lucide-react';
import { MortgageRecord } from '../types/mortgage';
import { getRecordId } from '../utils/formatters';
import { validateMortgageForm } from '../utils/validation';

interface MortgageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<MortgageRecord, '_id' | 'LastUpdated'>) => void;
  initialData?: MortgageRecord | null;
  isDuplicate?: boolean;
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'PR'
];

const CLAUSE_PRESETS = [
  'ISAOA / ATIMA',
  'ISAOA',
  'Its Successors and/or Assigns',
  'Loss Payee',
  'ISAOA ATIMA'
];

export function MortgageFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isDuplicate = false
}: MortgageFormModalProps) {
  const isEditing = Boolean(initialData) && !isDuplicate;

  const [formData, setFormData] = useState({
    Name: '',
    Name2: '',
    Address: '',
    City: '',
    State: '',
    ZIP: '',
    Telephone: '',
    Telephone2: '',
    FAX: '',
    email: '',
    Online: '',
    Notes: ''
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
    if (initialData) {
      setFormData({
        Name: initialData.Name || '',
        Name2: initialData.Name2 || '',
        Address: initialData.Address || '',
        City: initialData.City || '',
        State: initialData.State || '',
        ZIP: initialData.ZIP || '',
        Telephone: initialData.Telephone || '',
        Telephone2: initialData.Telephone2 || '',
        FAX: initialData.FAX || '',
        email: initialData.email || '',
        Online: initialData.Online || '',
        Notes: initialData.Notes || ''
      });
    } else {
      setFormData({
        Name: '',
        Name2: 'ISAOA / ATIMA',
        Address: '',
        City: '',
        State: '',
        ZIP: '',
        Telephone: '',
        Telephone2: '',
        FAX: '',
        email: '',
        Online: '',
        Notes: 'Mortgagee'
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const { isValid, errors: validationErrors } = validateMortgageForm({
      Name: formData.Name,
      ZIP: formData.ZIP,
      Online: formData.Online,
      email: formData.email
    });

    if (formData.State.trim() && formData.State.trim().length > 3) {
      validationErrors.State = 'Use standard 2-letter state code (e.g. FL, SC, CA)';
    }

    setErrors(validationErrors);
    return isValid && Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      Name: formData.Name.trim(),
      Name2: formData.Name2.trim() || null,
      Address: formData.Address.trim() || null,
      City: formData.City.trim() || null,
      State: formData.State.trim().toUpperCase() || null,
      ZIP: formData.ZIP.trim() || null,
      Telephone: formData.Telephone.trim() || null,
      Telephone2: formData.Telephone2.trim() || null,
      FAX: formData.FAX.trim() || null,
      email: formData.email.trim() || null,
      Online: formData.Online.trim() || null,
      Notes: formData.Notes.trim() || null
    });

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mortgage-form-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white border border-[#a8b3c0] rounded-[8px] w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-[#222]">
        {/* Modal Header Bar with Nested Close Button */}
        <div className="qq-modal-header px-4 py-2.5 flex items-center justify-between text-white shadow-xs shrink-0 select-none">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-[3px] bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-white" />
            </div>
            <h3 id="mortgage-form-modal-title" className="text-sm font-bold text-white tracking-wide truncate">
              {isDuplicate
                ? 'Duplicate & Edit Mortgagee Account'
                : isEditing
                ? 'Editing Mortgagee Account'
                : 'Adding A New Mortgagee Contact'}
            </h3>
            {isEditing && !isDuplicate && (
              <span className="text-[11px] text-white/80 font-mono hidden sm:inline">
                ({getRecordId(initialData!)})
              </span>
            )}
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

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-5 space-y-3.5 text-[12px] bg-[#fbfcfd]">
          {/* Primary Name */}
          <div>
            <label className="block text-[#222] font-semibold mb-1">
              Institution / Mortgagee Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.Name}
              onChange={(e) => {
                setFormData({ ...formData, Name: e.target.value });
                if (errors.Name) setErrors({ ...errors, Name: '' });
              }}
              placeholder="e.g. WELLS FARGO BANK, N.A. #708"
              className={`app-input w-full ${errors.Name ? 'border-rose-500 bg-rose-50/50' : ''}`}
            />
            {errors.Name && (
              <p className="text-rose-600 mt-1 flex items-center gap-1 text-[11px] font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.Name}</span>
              </p>
            )}
          </div>

          {/* Name2 / ISAOA Clause */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[#222] font-semibold">
                Clause Qualifier / Sub-title (Name 2)
              </label>
              <div className="flex items-center gap-1 text-[11px] text-[#666]">
                <span>Presets:</span>
                {CLAUSE_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setFormData({ ...formData, Name2: preset })}
                    className="text-[#004b91] hover:underline cursor-pointer ml-1"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={formData.Name2}
              onChange={(e) => setFormData({ ...formData, Name2: e.target.value })}
              placeholder="e.g. ISAOA / ATIMA, Its Successors and/or Assigns"
              className="app-input w-full"
            />
          </div>

          {/* Address, City, State, ZIP Row */}
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-2.5">
            <div className="sm:col-span-3">
              <label className="block text-[#222] font-semibold mb-1">Street Address / PO Box</label>
              <input
                type="text"
                value={formData.Address}
                onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                placeholder="e.g. P.O. BOX 202028"
                className="app-input w-full"
              />
            </div>

            <div className="sm:col-span-1.5">
              <label className="block text-[#222] font-semibold mb-1">City</label>
              <input
                type="text"
                value={formData.City}
                onChange={(e) => setFormData({ ...formData, City: e.target.value })}
                placeholder="e.g. Florence"
                className="app-input w-full"
              />
            </div>

            <div className="sm:col-span-0.75">
              <label className="block text-[#222] font-semibold mb-1">State</label>
              <input
                type="text"
                maxLength={3}
                value={formData.State}
                onChange={(e) => setFormData({ ...formData, State: e.target.value.toUpperCase() })}
                placeholder="SC"
                list="state-list-form"
                className={`app-input w-full uppercase font-mono ${errors.State ? 'border-rose-500 bg-rose-50/50' : ''}`}
              />
              <datalist id="state-list-form">
                {US_STATES.map((st) => (
                  <option key={st} value={st} />
                ))}
              </datalist>
              {errors.State && <p className="text-rose-600 mt-1 text-[10.5px]">{errors.State}</p>}
            </div>

            <div className="sm:col-span-0.75">
              <label className="block text-[#222] font-semibold mb-1">ZIP</label>
              <input
                type="text"
                value={formData.ZIP}
                onChange={(e) => {
                  setFormData({ ...formData, ZIP: e.target.value });
                  if (errors.ZIP) setErrors({ ...errors, ZIP: '' });
                }}
                placeholder="29502"
                maxLength={10}
                className={`app-input w-full font-mono ${errors.ZIP ? 'border-rose-500 bg-rose-50/50' : ''}`}
              />
              {errors.ZIP && <p className="text-rose-600 mt-1 text-[10.5px] font-medium">{errors.ZIP}</p>}
            </div>
          </div>

          {/* Phone Numbers & FAX */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[#222] font-semibold mb-1">Telephone 1 (Primary)</label>
              <input
                type="text"
                value={formData.Telephone}
                onChange={(e) => setFormData({ ...formData, Telephone: e.target.value })}
                placeholder="800-223-6527"
                className="app-input w-full font-mono"
              />
            </div>

            <div>
              <label className="block text-[#222] font-semibold mb-1">Telephone 2 (Alt / Toll-Free)</label>
              <input
                type="text"
                value={formData.Telephone2}
                onChange={(e) => setFormData({ ...formData, Telephone2: e.target.value })}
                placeholder="866-242-7514"
                className="app-input w-full font-mono"
              />
            </div>

            <div>
              <label className="block text-[#222] font-semibold mb-1">FAX Number</label>
              <input
                type="text"
                value={formData.FAX}
                onChange={(e) => setFormData({ ...formData, FAX: e.target.value })}
                placeholder="843-413-7133"
                className="app-input w-full font-mono"
              />
            </div>
          </div>

          {/* Email and Online Portal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[#222] font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="insurance@domain.com"
                className={`app-input w-full ${errors.email ? 'border-rose-500 bg-rose-50/50' : ''}`}
              />
              {errors.email && <p className="text-rose-600 mt-1 text-[11px] font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[#222] font-semibold mb-1 flex items-center justify-between">
                <span>Online Portal URL</span>
                <span className="text-[10px] text-[#777] font-mono">https://...</span>
              </label>
              <input
                type="url"
                value={formData.Online}
                onChange={(e) => {
                  setFormData({ ...formData, Online: e.target.value });
                  if (errors.Online) setErrors({ ...errors, Online: '' });
                }}
                placeholder="https://mycoverageinfo.com/..."
                className={`app-input w-full font-mono text-[11.5px] ${errors.Online ? 'border-rose-500 bg-rose-50/50' : ''}`}
              />
              {errors.Online && <p className="text-rose-600 mt-1 text-[11px] font-medium">{errors.Online}</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[#222] font-semibold mb-1">Internal Notes & Loan Instructions</label>
            <textarea
              rows={3}
              value={formData.Notes}
              onChange={(e) => setFormData({ ...formData, Notes: e.target.value })}
              placeholder="Include specific subject lines, borrower verification instructions, or servicing notes..."
              className="app-input w-full resize-none"
            />
          </div>

          {/* Modal Actions */}
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
              <span>{isDuplicate ? 'Duplicate & Save Contact ✎' : isEditing ? 'Save Changes ✎' : 'Add Contact ✎'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
