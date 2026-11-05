/**
 * Production-grade Clipboard Copy Utility with Fallbacks
 * Supports modern Navigator Clipboard API with fallback to Document execCommand
 * for unsecure contexts (HTTP), permission-restricted iframes, or legacy webviews.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text || !text.trim()) return false;

  const trimmed = text.trim();

  // 1. Primary path: Navigator Clipboard API (if available and in secure context)
  if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(trimmed);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard.writeText failed, executing fallback:', err);
    }
  }

  // 2. Secondary fallback: Document execCommand('copy') with hidden textarea
  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = trimmed;
      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';
      textarea.style.top = '-999999px';
      textarea.style.opacity = '0';
      textarea.setAttribute('readonly', '');
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, 999999); // Mobile Safari support
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (successful) return true;
    } catch (err) {
      console.error('execCommand copy fallback failed:', err);
    }
  }

  return false;
}
