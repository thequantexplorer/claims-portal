import { formatCents } from './format.js';

const CLOSED_STATUSES = new Set(['PAID', 'DENIED']);

/** Header line for My claims: how many claims are still open and what they add up to. */
export function openClaimsSummary(rows) {
  const open = rows.filter(c => !CLOSED_STATUSES.has(c.status));
  const total = open.reduce((sum, c) => sum + c.amountCents, 0);
  return `${open.length} open · ${formatCents(total)} pending`;
}
