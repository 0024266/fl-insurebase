import React, { useState, useEffect } from 'react';
import { Lock, X, AlertCircle, ShieldCheck, Loader2, Database } from 'lucide-react';
import { fetchAuthStatus, loginAdminPasscode, setupAdminPasscode } from '../utils/api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsCheckingStatus(true);
    setError(null);
    fetchAuthStatus()
      .then((status) => {
        setIsConfigured(status.configured);
        setDbConnected(status.dbConnected);
      })
      .finally(() => {
        setIsCheckingStatus(false);
      });
  }, [isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim() || isVerifying) return;

    if (!isConfigured) {
      if (passcode.trim().length < 4) {
        setError('Passcode must be at least 4 characters.');
        return;
      }
      if (passcode.trim() !== confirmPasscode.trim()) {
        setError('Passcodes do not match.');
        return;
      }
    }

    setIsVerifying(true);
    setError(null);

    const result = isConfigured
      ? await loginAdminPasscode(passcode.trim())
      : await setupAdminPasscode(passcode.trim());

    setIsVerifying(false);

    if (result.token) {
      setError(null);
      setPasscode('');
      setConfirmPasscode('');
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Invalid admin passcode. Please check credentials and try again.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white border border-[#a8b3c0] rounded-[8px] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-[#222]">
        {/* Modal Header Bar with Nested Close Button */}
        <div className="qq-modal-header px-4 py-2.5 flex items-center justify-between text-white shadow-xs shrink-0 select-none">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-[3px] bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-white" />
            </div>
            <h3 id="admin-login-title" className="text-sm font-bold text-white tracking-wide truncate">
              {isConfigured ? 'Admin Authentication' : 'First-Run Admin Setup'}
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 text-xs bg-[#fbfcfd]">
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#e2e8f0]">
            <p className="text-neutral-600 text-xs leading-relaxed">
              {isConfigured
                ? 'Enter your administrative passcode to unlock shared MongoDB record editing and management.'
                : 'Claim your initial Admin passcode. It will be securely hashed on the server and saved to MongoDB.'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-[3px] border bg-[#f4f6f8] border-[#d0d7de] text-[#333]">
            <Database className={`w-3.5 h-3.5 ${dbConnected ? 'text-emerald-600' : 'text-amber-600'}`} />
            <span>
              {dbConnected
                ? 'MongoDB Cloud Connected (fl_insurebase)'
                : 'Configure MONGODB_URI in Secrets for Cloud Sync'}
            </span>
          </div>

          {isCheckingStatus ? (
            <div className="py-4 flex items-center justify-center gap-2 text-neutral-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking security configuration...</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-neutral-800 font-bold mb-1">
                  {isConfigured ? 'Admin Passcode / PIN' : 'Create Admin Passcode'}
                </label>
                <input
                  type="password"
                  autoFocus
                  disabled={isVerifying}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={isConfigured ? 'Enter passcode...' : 'Choose a passcode (4+ chars)...'}
                  className={`app-input w-full font-mono text-sm py-2 px-3 tracking-widest ${
                    error ? 'border-rose-500 bg-rose-50/50' : ''
                  }`}
                />
              </div>

              {!isConfigured && (
                <div>
                  <label className="block text-neutral-800 font-bold mb-1">
                    Confirm Admin Passcode
                  </label>
                  <input
                    type="password"
                    disabled={isVerifying}
                    value={confirmPasscode}
                    onChange={(e) => {
                      setConfirmPasscode(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Re-enter passcode..."
                    className="app-input w-full font-mono text-sm py-2 px-3 tracking-widest"
                  />
                </div>
              )}

              {error && (
                <p className="text-rose-600 mt-1.5 flex items-center gap-1 font-semibold text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </p>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-[#e2e8f0] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="qq-btn-secondary py-1.5 px-4 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying || isCheckingStatus || !passcode.trim()}
              className={`qq-btn-green py-1.5 px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                isVerifying || isCheckingStatus || !passcode.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isConfigured ? 'Unlock Admin' : 'Claim & Unlock Admin'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

