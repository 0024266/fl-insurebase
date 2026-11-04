import { MortgageRecord } from '../types/mortgage';
import { FloridaZipRecord } from '../types/permits';
import { DirectoryMode } from '../types/permits';
import { formatZipCode } from './permitFormatters';
import { getRecordId } from './formatters';
import { getPermitRecordId } from './permitFormatters';

/**
 * Updates dynamic head meta tags, Open Graph cards, Twitter cards, canonical link,
 * robots meta rules, Schema.org JSON-LD entity data, and BreadcrumbList structured data.
 */
export function updateDynamicSeo(
  activeTab: DirectoryMode,
  selectedMortgageRecord: MortgageRecord | null,
  selectedPermitRecord: FloridaZipRecord | null
) {
  if (typeof document === 'undefined') return;

  const currentUrl = window.location.href;
  const baseUrl = 'https://menna.pro/agencydirectoryportal';

  // 1. Robots Meta Tag (Excludes Carriers tab from search indexing)
  let robotsMeta = document.getElementById('seo-robots-meta');
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta');
    robotsMeta.id = 'seo-robots-meta';
    robotsMeta.setAttribute('name', 'robots');
    document.head.appendChild(robotsMeta);
  }

  if (activeTab === 'carriers') {
    robotsMeta.setAttribute('content', 'noindex, follow');
  } else {
    robotsMeta.setAttribute('content', 'index, follow');
  }

  let title = '';
  let description = '';
  let jsonLdData: any = null;
  let breadcrumbLdData: any = null;

  if (activeTab === 'mortgages' && selectedMortgageRecord) {
    const rec = selectedMortgageRecord;
    const lenderName = rec.Name || 'Mortgage Lender';
    const recId = getRecordId(rec);
    title = `${lenderName} Mortgagee Clause & ISAOA / ATIMA Address | FL InsureBase`;
    description = `Official mortgagee clause, loss payee ISAOA/ATIMA mailing address, loan servicing phone, fax, and hazard insurance tracking portal for ${lenderName}.`;

    jsonLdData = {
      '@context': 'https://schema.org',
      '@type': 'FinancialService',
      'name': lenderName,
      'alternateName': rec.Name2 || undefined,
      'description': description,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': rec.Address || '',
        'addressLocality': rec.City || '',
        'addressRegion': rec.State || 'FL',
        'postalCode': rec.ZIP || ''
      },
      'telephone': rec.Telephone || rec.Telephone2 || '',
      'faxNumber': rec.FAX || '',
      'email': rec.email || ''
    };

    breadcrumbLdData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': baseUrl
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Mortgagee Directory',
          'item': `${baseUrl}/mortgages`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': lenderName,
          'item': `${baseUrl}/mortgages/${recId}`
        }
      ]
    };
  } else if (activeTab === 'property' && selectedPermitRecord) {
    const rec = selectedPermitRecord;
    const city = rec.City || 'Florida Jurisdiction';
    const county = rec.County || '';
    const zip = formatZipCode(rec.zip);
    const recId = getPermitRecordId(rec);
    title = `${city} (${county} County) Property Appraiser & Building Permits | FL InsureBase`;
    description = `Official property appraiser folio search, municipal building permit portal, inspection contact info, and jurisdiction lookup for ${city}, FL (${zip}).`;

    jsonLdData = {
      '@context': 'https://schema.org',
      '@type': 'GovernmentOrganization',
      'name': `${city} Building Department & Property Appraiser`,
      'description': description,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': city,
        'addressRegion': 'FL',
        'postalCode': zip
      },
      'url': rec.PermitByCity || rec.PermitByCounty || rec.PAlink || ''
    };

    breadcrumbLdData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': baseUrl
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Florida Property Records',
          'item': `${baseUrl}/property`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': `${city} (${county} County)`,
          'item': `${baseUrl}/property/${recId}`
        }
      ]
    };
  } else if (activeTab === 'mortgages') {
    title = 'FL InsureBase | Mortgagee Clauses & Loss Payee Lookup';
    description = 'Free searchable operational directory for Florida insurance agents. Instant lookup for 1,000+ mortgagee ISAOA/ATIMA clauses, county property appraiser folios, permit links, and guest carrier credit card payment fee rules.';

    breadcrumbLdData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': baseUrl
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Mortgagee Directory',
          'item': `${baseUrl}/mortgages`
        }
      ]
    };
  } else if (activeTab === 'property') {
    title = 'FL InsureBase | Florida County Property Appraisers & Permits';
    description = 'Official property appraiser folio search, municipal building permit portal, inspection contact info, and jurisdiction lookup for Florida counties.';

    breadcrumbLdData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': baseUrl
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Florida Property Records',
          'item': `${baseUrl}/property`
        }
      ]
    };
  } else if (activeTab === 'carriers') {
    title = 'FL InsureBase | Florida Carrier Portals, Claims & CC Fees';
    description = 'Florida insurance carrier portals, claims contact info, and guest credit card payment fee rules.';
  } else {
    title = 'FL InsureBase | Legal Disclaimer & Directory Terms';
    description = 'Legal disclaimer and directory terms for FL InsureBase.';
  }

  // Update Document Title
  document.title = title;

  // Helper to update or create meta tags
  const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', currentUrl);

  // Set Standard Meta Tags
  setMetaTag('meta[name="description"]', 'name', 'description', description);
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl);
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);

  // Dynamic JSON-LD Entity script block
  let scriptEl = document.getElementById('dynamic-jsonld');
  if (jsonLdData) {
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'dynamic-jsonld';
      scriptEl.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLdData, null, 2);
  } else if (scriptEl) {
    scriptEl.remove();
  }

  // Dynamic BreadcrumbList JSON-LD script block
  let breadcrumbScriptEl = document.getElementById('dynamic-breadcrumb-jsonld');
  if (breadcrumbLdData) {
    if (!breadcrumbScriptEl) {
      breadcrumbScriptEl = document.createElement('script');
      breadcrumbScriptEl.id = 'dynamic-breadcrumb-jsonld';
      breadcrumbScriptEl.setAttribute('type', 'application/ld+json');
      document.head.appendChild(breadcrumbScriptEl);
    }
    breadcrumbScriptEl.textContent = JSON.stringify(breadcrumbLdData, null, 2);
  } else if (breadcrumbScriptEl) {
    breadcrumbScriptEl.remove();
  }
}
