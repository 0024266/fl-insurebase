/**
 * validation.ts
 * Enterprise-grade validation utilities for ZIP codes, URLs, and directory records.
 */

/**
 * Validates that a string is a valid 5-digit US ZIP code format (00000 to 99999).
 */
export function isValid5DigitZip(zip: string | number | null | undefined): boolean {
  if (zip === null || zip === undefined) return false;
  const str = String(zip).trim();
  return /^\d{5}$/.test(str);
}

/**
 * Formats or pads a ZIP code to a clean 5-digit numeric string.
 */
export function sanitize5DigitZip(zip: string | number | null | undefined): string {
  if (zip === null || zip === undefined) return '';
  const digits = String(zip).replace(/\D/g, '');
  if (digits.length <= 5) {
    return digits.padStart(5, '0');
  }
  return digits.slice(0, 5);
}

/**
 * Validates that a string is a properly formatted, valid HTTP or HTTPS URL.
 * Requires http:// or https:// and a valid domain / host name.
 */
export function isValidHttpUrl(urlString: string | null | undefined): boolean {
  if (!urlString || typeof urlString !== 'string') return false;
  const trimmed = urlString.trim();
  if (!trimmed) return false;

  // Must begin with http:// or https://
  if (!/^https?:\/\//i.test(trimmed)) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    // Protocol must be http or https
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }
    // Hostname must be valid
    if (!parsed.hostname || parsed.hostname.length < 3) {
      return false;
    }
    // Must contain a dot or be localhost / private IP
    if (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost') {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates building permit URLs.
 * If provided (non-empty), must be a properly formatted web URL.
 */
export function validatePermitUrl(url: string | null | undefined, fieldLabel: string = 'URL'): string | null {
  if (!url || !url.trim()) {
    return null; // optional URLs are allowed to be empty
  }
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `${fieldLabel} must start with https:// or http:// (e.g., https://example.gov/permits)`;
  }
  if (!isValidHttpUrl(trimmed)) {
    return `${fieldLabel} is not a properly formatted web address`;
  }
  return null;
}

/**
 * Validates Florida Jurisdiction / Permit submission form.
 */
export function validatePermitForm(data: {
  zip: string;
  City: string;
  County: string;
  PAlink?: string;
  PermitByCounty?: string;
  PermitByCity?: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // 1. ZIP Code validation (strict 5-digit)
  if (!data.zip || !data.zip.trim()) {
    errors.zip = 'ZIP code is required';
  } else if (!isValid5DigitZip(data.zip)) {
    errors.zip = 'Invalid ZIP code: must be exactly 5 numeric digits (e.g. 34432)';
  }

  // 2. City validation
  if (!data.City || !data.City.trim()) {
    errors.City = 'City / Municipality name is required';
  }

  // 3. County validation
  if (!data.County || !data.County.trim()) {
    errors.County = 'County name is required';
  }

  // 4. Property Appraiser URL validation
  const paError = validatePermitUrl(data.PAlink, 'Property Appraiser portal URL');
  if (paError) {
    errors.PAlink = paError;
  }

  // 5. County Permit Portal URL validation
  const countyPermitError = validatePermitUrl(data.PermitByCounty, 'County Permit portal URL');
  if (countyPermitError) {
    errors.PermitByCounty = countyPermitError;
  }

  // 6. City Permit Portal URL validation
  const cityPermitError = validatePermitUrl(data.PermitByCity, 'City Permit portal URL');
  if (cityPermitError) {
    errors.PermitByCity = cityPermitError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates Mortgagee / Loss Payee record submission form.
 */
export function validateMortgageForm(data: {
  Name: string;
  ZIP?: string;
  Online?: string;
  email?: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.Name || !data.Name.trim()) {
    errors.Name = 'Mortgagee / Loss Payee entity name is required';
  }

  if (data.ZIP && data.ZIP.trim()) {
    const trimmedZip = data.ZIP.trim();
    if (!/^\d{5}(-\d{4})?$/.test(trimmedZip)) {
      errors.ZIP = 'Invalid ZIP code format (use 5-digit format like 33101)';
    }
  }

  if (data.Online && data.Online.trim()) {
    const urlError = validatePermitUrl(data.Online, 'Online portal URL');
    if (urlError) {
      errors.Online = urlError;
    }
  }

  if (data.email && data.email.trim()) {
    const trimmedEmail = data.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Invalid email address format';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
