import fs from 'fs';
import path from 'path';
import { INITIAL_DATASET } from '../src/data/initialRecords';
import { INITIAL_FLORIDA_PERMIT_DATASET } from '../src/data/initialPermitRecords';

function getMortgageId(record: any): string {
  if (!record) return '';
  if (typeof record._id === 'string') return record._id;
  if (record._id && typeof record._id === 'object' && '$oid' in record._id) {
    return record._id.$oid;
  }
  return '';
}

function getPermitId(record: any): string {
  if (!record) return '';
  if (typeof record._id === 'object' && record._id !== null && '$oid' in record._id) {
    return record._id.$oid;
  }
  if (typeof record._id === 'string') return record._id;
  return String(record.zip || '');
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSitemapAndNoscript() {
  const baseUrl = 'https://menna.pro/agencydirectoryportal/';
  const today = new Date().toISOString().split('T')[0];

  const urls: string[] = [];

  // Base URLs
  urls.push(`  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

  urls.push(`  <url>
    <loc>${baseUrl}#tab=mortgages</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);

  urls.push(`  <url>
    <loc>${baseUrl}#tab=property</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`);

  // Mortgage URLs
  for (const record of INITIAL_DATASET) {
    const id = getMortgageId(record);
    if (id) {
      const safeId = encodeURIComponent(id);
      urls.push(`  <url>
    <loc>${baseUrl}#tab=mortgages&amp;id=${safeId}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
    }
  }

  // Permit / Property URLs
  for (const record of INITIAL_FLORIDA_PERMIT_DATASET) {
    const id = getPermitId(record);
    if (id) {
      const safeId = encodeURIComponent(id);
      urls.push(`  <url>
    <loc>${baseUrl}#tab=property&amp;id=${safeId}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
    }
  }

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  const publicSitemapPath = path.resolve('public/sitemap.xml');
  fs.writeFileSync(publicSitemapPath, xmlContent, 'utf8');
  console.log(`Generated public/sitemap.xml with ${urls.length} URLs.`);

  const distDir = path.resolve('dist');
  if (fs.existsSync(distDir)) {
    const distSitemapPath = path.resolve('dist/sitemap.xml');
    fs.writeFileSync(distSitemapPath, xmlContent, 'utf8');
    console.log(`Generated dist/sitemap.xml with ${urls.length} URLs.`);
  }

  // Generate crawler fallback <noscript> links for top 200 mortgage lenders & Florida counties
  const top200Mortgages = INITIAL_DATASET.slice(0, 200);
  const topMortgageLis = top200Mortgages.map((rec) => {
    const id = getMortgageId(rec);
    const name = escapeXml(rec.Name || 'Lender');
    const city = escapeXml(rec.City || '');
    const state = escapeXml(rec.State || 'FL');
    const zip = escapeXml(rec.ZIP || '');
    return `        <li><a href="#tab=mortgages&amp;id=${encodeURIComponent(id)}"><strong>${name}</strong> - ${city}, ${state} ${zip} Mortgagee Clause</a></li>`;
  }).join('\n');

  const permitLis = INITIAL_FLORIDA_PERMIT_DATASET.map((rec) => {
    const id = getPermitId(rec);
    const city = escapeXml(rec.City || 'Florida Jurisdiction');
    const county = escapeXml(rec.County || '');
    const zip = escapeXml(String(rec.zip || ''));
    return `        <li><a href="#tab=property&amp;id=${encodeURIComponent(id)}"><strong>${city}</strong> (${county} County, FL ${zip}) Property Appraiser &amp; Permits</a></li>`;
  }).join('\n');

  const noscriptHtml = `    <!-- Static Crawler Pre-Rendering Fallback for SEO Indexing -->
    <noscript>
      <div style="padding: 24px; max-width: 900px; margin: 0 auto; font-family: sans-serif; line-height: 1.5; color: #222;">
        <h1>FL InsureBase - Florida Agent Operations Hub</h1>
        <p>FL InsureBase provides Florida insurance agents with instant lookup for mortgagee ISAOA/ATIMA loss payee clauses, county property appraiser folios, municipal building permits, and guest carrier credit card payment fee rules.</p>
        
        <h2>Top 200 Mortgage Loss Payees &amp; ISAOA Clauses</h2>
        <ul style="max-height: 400px; overflow-y: auto; padding-left: 20px;">
${topMortgageLis}
        </ul>

        <h2>Florida County Property Appraisers &amp; Building Permit Portals</h2>
        <ul style="max-height: 400px; overflow-y: auto; padding-left: 20px;">
${permitLis}
        </ul>
      </div>
    </noscript>`;

  // Update index.html noscript section
  const indexHtmlPath = path.resolve('index.html');
  if (fs.existsSync(indexHtmlPath)) {
    let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    indexHtml = indexHtml.replace(
      /<!-- Static Crawler Pre-Rendering Fallback for SEO Indexing -->[\s\S]*?<\/noscript>/,
      noscriptHtml
    );
    fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
    console.log('Updated index.html <noscript> crawler pre-rendering block.');
  }
}

generateSitemapAndNoscript();
