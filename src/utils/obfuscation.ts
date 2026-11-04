/**
 * Anti-Bot & Email Obfuscation Utilities
 *
 * Protects email addresses from automated web scrapers, crawlers, and search engine indexers
 * while maintaining 100% seamless usability, copying, and 1-click mailto dispatch for human users.
 */

// Base64 encoded admin email channel
export const ADMIN_ENCODED_EMAIL = 'bG1lbm5hMEBnbWFpbC5jb20=';

/**
 * Decodes a base64 encoded email address on-demand
 */
export function decodeEmail(encoded: string): string {
  try {
    return atob(encoded);
  } catch {
    return '';
  }
}

/**
 * Encodes an email address to base64
 */
export function encodeEmail(email: string): string {
  try {
    return btoa(email.trim());
  } catch {
    return '';
  }
}

/**
 * Retrieves the directory administrator email dynamically
 */
export function getAdminEmail(): string {
  return decodeEmail(ADMIN_ENCODED_EMAIL);
}

/**
 * Splits an email into user and domain parts for anti-bot DOM splitting
 */
export function splitEmail(email: string): { user: string; domain: string } {
  if (!email || !email.includes('@')) {
    return { user: email || '', domain: '' };
  }
  const parts = email.split('@');
  return {
    user: parts[0],
    domain: parts.slice(1).join('@')
  };
}

/**
 * Constructs a mailto link dynamically at execution time (avoids static HTML mailto scrapers)
 */
export function createMailtoUrl(to: string, subject?: string, body?: string): string {
  const cleanTo = to.trim();
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  
  const query = params.length > 0 ? `?${params.join('&')}` : '';
  return `mailto:${cleanTo}${query}`;
}

/**
 * Safely dispatches a mailto intent dynamically upon human user interaction
 */
export function openMailClient(to: string, subject?: string, body?: string): void {
  const url = createMailtoUrl(to, subject, body);
  
  // Using location.href or hidden temporary trigger ensures bots don't index static mailto anchors
  try {
    const link = document.createElement('a');
    link.href = url;
    link.rel = 'nofollow noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  } catch {
    window.location.href = url;
  }
}
