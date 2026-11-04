import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, X, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Salted cryptographic SHA-256 verification (no plaintext password stored in source)
const AUTH_SALT = 'agency_portal_secure_fl_2026_salt_9xK';
const EXPECTED_HASH = '8fa7ae3dd9168a7c528cf0c8224e7938154068fc05621671a8a68c4458d4c51c';

async function verifyPasscode(enteredPasscode: string): Promise<boolean> {
  try {
    const combined = `${AUTH_SALT}:${enteredPasscode.trim()}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex === EXPECTED_HASH;
  } catch (err) {
    console.error('Cryptographic verification error:', err);
    return false;
  }
}

export function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

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

    setIsVerifying(true);
    setError(null);

    const isValid = await verifyPasscode(passcode);
    setIsVerifying(false);

    if (isValid) {
      setError(null);
      setPasscode('');
      onSuccess();
      onClose();
    } else {
      setError('Invalid admin passcode. Please check credentials and try again.');
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
              Admin Authentication
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
          <p className="text-neutral-600 text-xs leading-relaxed border-b border-[#e2e8f0] pb-2.5">
            Enter your administrative passcode to unlock record editing, additions, deletions, and bulk link updates.
          </p>

          <div>
            <label className="block text-neutral-800 font-bold mb-1">
              Admin Passcode / PIN
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
              placeholder="Enter passcode..."
              className={`app-input w-full font-mono text-sm py-2 px-3 tracking-widest ${
                error ? 'border-rose-500 bg-rose-50/50' : ''
              }`}
            />
            {error && (
              <p className="text-rose-600 mt-1.5 flex items-center gap-1 font-semibold text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

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
              disabled={isVerifying || !passcode.trim()}
              className={`qq-btn-green py-1.5 px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                isVerifying || !passcode.trim() ? 'opacity-50 cursor-not-allowed' : ''
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
                  <span>Unlock Admin</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
