import { formatCents, statusLabel } from './format.js';
import { filterClaims } from '../public/search.js';

const header = ['Claim', 'Type', 'Amount', 'Status', 'Submitted'];

/** Builds the CSV a customer downloads from "Export". */
export function claimsCsv(claims, query = '') {
  const rows = filterClaims(claims, query).map(c => [
    c.id, c.type, formatCents(c.amountCents), statusLabel(c.status), c.submittedAt.slice(0, 10),
  ]);
  return [header, ...rows].map(r => r.join(',')).join('\n');
}
