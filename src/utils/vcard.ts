import { MortgageRecord } from '../types/mortgage';
import { buildMortgageeClause } from './formatters';

/**
 * Exports a single Mortgagee Record as a vCard (.vcf) contact file for Outlook / Apple Contacts
 */
export function downloadVCard(record: MortgageRecord) {
  if (!record) return;

  const lenderName = record.Name || 'Mortgage Lender';
  const isaoa = record.Name2 || 'ISAOA / ATIMA';
  const address = record.Address || '';
  const city = record.City || '';
  const state = record.State || 'FL';
  const zip = record.ZIP || '';
  const phone = record.Telephone || record.Telephone2 || '';
  const fax = record.FAX || '';
  const email = record.email || '';
  const website = record.Online || '';
  const notes = record.Notes || '';

  const clauseText = buildMortgageeClause(record).replace(/\n/g, '\\n');

  const vcardLines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${lenderName}`,
    `ORG:${lenderName};${isaoa}`,
    'TITLE:Mortgagee / Loss Payee',
    phone ? `TEL;TYPE=WORK,VOICE:${phone}` : '',
    fax ? `TEL;TYPE=WORK,FAX:${fax}` : '',
    email ? `EMAIL;TYPE=WORK:${email}` : '',
    website ? `URL:${website}` : '',
    `ADR;TYPE=WORK:;;${address};${city};${state};${zip};USA`,
    `NOTE:ISAOA/ATIMA: ${isaoa}\\nClause:\\n${clauseText}${notes ? `\\nNotes: ${notes}` : ''}`,
    'END:VCARD'
  ].filter(Boolean);

  const vcardContent = vcardLines.join('\r\n');
  const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName = lenderName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  link.href = url;
  link.setAttribute('download', `${safeName}_mortgagee.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports the full Mortgagee Directory dataset as a downloadable CSV file
 */
export function exportMortgageesCsv(records: MortgageRecord[], filename = 'FL_InsureBase_Mortgagee_Directory.csv') {
  if (!records || records.length === 0) return;

  const headers = [
    'Lender Name',
    'ISAOA / ATIMA / Name2',
    'Address',
    'City',
    'State',
    'ZIP',
    'Telephone',
    'Telephone2',
    'FAX',
    'Email',
    'Online Portal',
    'Notes',
    'Last Updated'
  ];

  const escapeCsv = (val: string | null | undefined) => {
    if (!val) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows = [headers.join(',')];

  for (const r of records) {
    const row = [
      escapeCsv(r.Name),
      escapeCsv(r.Name2),
      escapeCsv(r.Address),
      escapeCsv(r.City),
      escapeCsv(r.State),
      escapeCsv(r.ZIP),
      escapeCsv(r.Telephone),
      escapeCsv(r.Telephone2),
      escapeCsv(r.FAX),
      escapeCsv(r.email),
      escapeCsv(r.Online),
      escapeCsv(r.Notes),
      escapeCsv(r.LastUpdated)
    ];
    csvRows.push(row.join(','));
  }

  const csvContent = csvRows.join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
