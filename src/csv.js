import { formatCents, statusLabel } from './format.js';

const COLUMNS = ['Claim', 'Type', 'Amount', 'Status', 'Submitted'];

function quote(s) {
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Text from claims-service; a leading ' stops spreadsheets from evaluating it as a formula. */
function textCell(value) {
  const s = String(value ?? '');
  return quote(/^[=+\-@\t\r]/.test(s) ? `'${s}` : s);
}

/** CSV of the customer's claims, in the same order as the My claims table. */
export function claimsCsv(claims) {
  const header = COLUMNS.map(textCell).join(',');
  const rows = claims.map(c => [
    textCell(c.id),
    textCell(c.type),
    quote(formatCents(c.amountCents)),
    textCell(statusLabel(c.status)),
    textCell(c.submittedAt?.slice(0, 10)),
  ].join(','));
  return [header, ...rows].join('\r\n') + '\r\n';
}

/** e.g. claims-2026-11-04.csv */
export function csvFilename(now = new Date()) {
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `claims-${now.getFullYear()}-${mm}-${dd}.csv`;
}
