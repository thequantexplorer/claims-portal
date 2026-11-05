import { formatCents, statusLabel } from './format.js';

const COLUMNS = ['Claim', 'Type', 'Amount', 'Status', 'Submitted'];

/** CSV of the customer's claims, in the same order as the My claims table. */
export function claimsCsv(claims) {
  const rows = claims.map(c => [c.id, c.type, formatCents(c.amountCents), statusLabel(c.status), c.submittedAt?.slice(0, 10) ?? '']);
  return [COLUMNS, ...rows].map(r => r.join(',')).join('\r\n') + '\r\n';
}

/** e.g. claims-2026-11-04.csv */
export function csvFilename(now = new Date()) {
  const mm = String(now.getMonth()).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `claims-${now.getFullYear()}-${mm}-${dd}.csv`;
}
