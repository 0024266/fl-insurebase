import React, { useState, useEffect } from 'react';
import { X, Building2, AlertCircle } from 'lucide-react';
import { CarrierRecord } from '../types/carrier';

interface CarrierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<CarrierRecord, 'id' | 'LastUpdated'>) => void;
  editingRecord: CarrierRecord | null;
  isDuplicate?: boolean;
}

export function CarrierFormModal({
  isOpen,
  onClose,
  onSave,
  editingRecord,
  isDuplicate = false
}: CarrierFormModalProps) {
  const isEditing = Boolean(editingRecord) && !isDuplicate;

  const [formData, setFormData] = useState({
    Carrier: '',
    OtherNames: '',
    AgentPortalLogin: '',
    Payments: '',
    PublicWebsite: '',
    ForAgents: '',
    CustomerServicePhone: '',
    CustomerServiceEmail: '',
    ClaimsPhone: '',
    ClaimsEmail: '',
    CC_Fee: 'No fee',
    Notes: '',
    Personal: true,
    Commercial: false,
    Auto: false,
    Home: true,
    Liability: false,
    Health: false,
    Flood: false,
    CitizensTakeout: false
  });

  const [error, setError] = useState<string>('');

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
        Carrier: isDuplicate
          ? `${editingRecord.Carrier} (Copy)`
          : editingRecord.Carrier || '',
        OtherNames: editingRecord.OtherNames || '',
        AgentPortalLogin: editingRecord.AgentPortalLogin || '',
        Payments: editingRecord.Payments || '',
        PublicWebsite: editingRecord.PublicWebsite || '',
        ForAgents: editingRecord.ForAgents || '',
        CustomerServicePhone: editingRecord.CustomerServicePhone || '',
        CustomerServiceEmail: editingRecord.CustomerServiceEmail || '',
        ClaimsPhone: editingRecord.ClaimsPhone || '',
        ClaimsEmail: editingRecord.ClaimsEmail || '',
        CC_Fee: editingRecord.CC_Fee || 'No fee',
        Notes: (editingRecord.Notes || '').replace(/<br\s*\/?>/gi, '\n'),
        Personal: Boolean(editingRecord.Personal),
        Commercial: Boolean(editingRecord.Commercial),
        Auto: Boolean(editingRecord.Auto),
        Home: Boolean(editingRecord.Home),
        Liability: Boolean(editingRecord.Liability),
        Health: Boolean(editingRecord.Health),
        Flood: Boolean(editingRecord.Flood),
        CitizensTakeout: Boolean(editingRecord.CitizensTakeout)
      });
    } else {
      setFormData({
        Carrier: '',
        OtherNames: '',
        AgentPortalLogin: '',
        Payments: '',
        PublicWebsite: '',
        ForAgents: '',
        CustomerServicePhone: '',
        CustomerServiceEmail: '',
        ClaimsPhone: '',
        ClaimsEmail: '',
        CC_Fee: 'No fee',
        Notes: '',
        Personal: true,
        Commercial: false,
        Auto: false,
        Home: true,
        Liability: false,
        Health: false,
        Flood: false,
        CitizensTakeout: false
      });
    }
    setError('');
  }, [editingRecord, isDuplicate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Carrier.trim()) {
      setError('Carrier Name is required.');
      return;
    }

    onSave({
      ...formData,
      Carrier: formData.Carrier.trim(),
      OtherNames: formData.OtherNames.trim(),
      AgentPortalLogin: formData.AgentPortalLogin.trim(),
      Payments: formData.Payments.trim(),
      PublicWebsite: formData.PublicWebsite.trim(),
      ForAgents: formData.ForAgents.trim(),
      CustomerServicePhone: formData.CustomerServicePhone.trim(),
      CustomerServiceEmail: formData.CustomerServiceEmail.trim(),
      ClaimsPhone: formData.ClaimsPhone.trim(),
      ClaimsEmail: formData.ClaimsEmail.trim(),
      CC_Fee: formData.CC_Fee.trim() || 'Contact carrier',
      Notes: formData.Notes.trim().replace(/\r?\n/g, '<br>')
    });

    onClose();
  };

  const toggleBool = (key: keyof typeof formData) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="carrier-form-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white border border-[#a8b3c0] rounded-[8px] w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-[#222]">
        <div className="qq-modal-header px-4 py-2.5 flex items-center justify-between text-white shadow-xs shrink-0 select-none">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-[3px] bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0">
              <Building2 className="w-3.5 h-3.5 text-white" />
            </div>
            <h3
              id="carrier-form-modal-title"
              className="text-sm font-bold text-white tracking-wide truncate"
            >
              {isDuplicate
                ? 'Duplicate & Edit Insurance Carrier'
                : isEditing
                ? 'Editing Insurance Carrier Record'
                : 'Add New Insurance Carrier Record'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog (Esc)"
            className="qq-modal-close-btn shrink-0 cursor-pointer shadow-md"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs flex-1"
        >
          {error && (
            <div className="bg-rose-50 border border-rose-300 text-rose-700 px-3 py-2 rounded flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Carrier Name & Aliases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#222] mb-1">
                Carrier Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={formData.Carrier}
                onChange={(e) => {
                  setFormData({ ...formData, Carrier: e.target.value });
                  setError('');
                }}
                placeholder="e.g., Citizens Property"
                className="app-input w-full"
              />
            </div>
            <div>
              <label className="block font-bold text-[#222] mb-1">
                Other Names / Aliases / MGA
              </label>
              <input
                type="text"
                value={formData.OtherNames}
                onChange={(e) =>
                  setFormData({ ...formData, OtherNames: e.target.value })
                }
                placeholder="e.g., Windward Risk Managers"
                className="app-input w-full"
              />
            </div>
          </div>

          {/* Portals & Payment URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#222] mb-1">
                Insured Payment URL
              </label>
              <input
                type="text"
                value={formData.Payments}
                onChange={(e) =>
                  setFormData({ ...formData, Payments: e.target.value })
                }
                placeholder="https://..."
                className="app-input w-full font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#222] mb-1">
                Agent Portal Login URL
              </label>
              <input
                type="text"
                value={formData.AgentPortalLogin}
                onChange={(e) =>
                  setFormData({ ...formData, AgentPortalLogin: e.target.value })
                }
                placeholder="https://..."
                className="app-input w-full font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#222] mb-1">
                Public Website
              </label>
              <input
                type="text"
                value={formData.PublicWebsite}
                onChange={(e) =>
                  setFormData({ ...formData, PublicWebsite: e.target.value })
                }
                placeholder="https://..."
                className="app-input w-full font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Credit Card Fee & Agent Dedicated Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#222] mb-1">
                Credit Card Fee (CC_Fee)
              </label>
              <input
                type="text"
                value={formData.CC_Fee}
                onChange={(e) =>
                  setFormData({ ...formData, CC_Fee: e.target.value })
                }
                placeholder="e.g., No fee, 2.99%, 3.50% (CC) / No fee (ACH)"
                className="app-input w-full"
              />
            </div>
            <div>
              <label className="block font-bold text-[#222] mb-1">
                Agent Dedicated Support Line (ForAgents)
              </label>
              <input
                type="text"
                value={formData.ForAgents}
                onChange={(e) =>
                  setFormData({ ...formData, ForAgents: e.target.value })
                }
                placeholder="e.g., 888-685-1555"
                className="app-input w-full"
              />
            </div>
          </div>

          {/* Customer Service & Claims Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#222] mb-1">
                Customer Service Phone
              </label>
              <input
                type="text"
                value={formData.CustomerServicePhone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    CustomerServicePhone: e.target.value
                  })
                }
                placeholder="e.g., 866-411-2742"
                className="app-input w-full"
              />
            </div>
            <div>
              <label className="block font-bold text-[#222] mb-1">
                Customer Service Email
              </label>
              <input
                type="text"
                value={formData.CustomerServiceEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    CustomerServiceEmail: e.target.value
                  })
                }
                placeholder="customerservice@carrier.com"
                className="app-input w-full"
              />
            </div>
            <div>
              <label className="block font-bold text-[#222] mb-1">
                Claims Phone
              </label>
              <input
                type="text"
                value={formData.ClaimsPhone}
                onChange={(e) =>
                  setFormData({ ...formData, ClaimsPhone: e.target.value })
                }
                placeholder="e.g., 866-411-2742"
                className="app-input w-full"
              />
            </div>
            <div>
              <label className="block font-bold text-[#222] mb-1">
                Claims Email
              </label>
              <input
                type="text"
                value={formData.ClaimsEmail}
                onChange={(e) =>
                  setFormData({ ...formData, ClaimsEmail: e.target.value })
                }
                placeholder="claims@carrier.com"
                className="app-input w-full"
              />
            </div>
          </div>

          {/* Lines of Business & Citizens Takeout Checkboxes */}
          <div>
            <label className="block font-bold text-[#222] mb-1.5">
              Active Lines of Business & Programs
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#f8fafc] border border-[#d8e0e8] rounded-[4px] p-2.5">
              {(
                [
                  { key: 'Home', label: 'Home' },
                  { key: 'Auto', label: 'Auto' },
                  { key: 'Flood', label: 'Flood' },
                  { key: 'Commercial', label: 'Commercial' },
                  { key: 'Personal', label: 'Personal' },
                  { key: 'Liability', label: 'Liability' },
                  { key: 'Health', label: 'Health' },
                  { key: 'CitizensTakeout', label: 'Citizens Takeout' }
                ] as const
              ).map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-1.5 cursor-pointer select-none font-semibold text-[#333]"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(formData[item.key])}
                    onChange={() => toggleBool(item.key)}
                    className="rounded border-slate-300 text-[#286090] focus:ring-[#286090]"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-[#222] mb-1">
              Underwriting & Agency Notes (Line breaks preserved)
            </label>
            <textarea
              rows={3}
              value={formData.Notes}
              onChange={(e) =>
                setFormData({ ...formData, Notes: e.target.value })
              }
              placeholder="Agency codes, underwriting emails, payment notes..."
              className="app-input w-full resize-none"
            />
          </div>

          {/* Footer */}
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
              className="qq-btn-green py-1.5 px-5 text-xs font-bold cursor-pointer"
            >
              {isDuplicate
                ? 'Duplicate & Save Carrier ✎'
                : isEditing
                ? 'Save Carrier Changes ✎'
                : 'Add Carrier Record ✎'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
