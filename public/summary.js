import { formatCents } from './format.js';

/** Header line for My claims: how many claims are still open and what they add up to. */
export function openClaimsSummary(rows) {
  const open = rows.filter(c => c.status !== 'PAID');
  const total = open.reduce((sum, c) => sum + c.amountCents);
  return `${open.length} open · ${formatCents(total)} pending`;
}
