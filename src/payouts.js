import { formatCents } from './format.js';

/** Monthly installments shown on the claim page. */
export function installmentRows(payableCents, installments, firstPayment) {
  const each = Math.round(payableCents / installments);
  return Array.from({ length: installments }, (_, i) => {
    const due = new Date(firstPayment);
    due.setMonth(due.getMonth() + i);
    return { number: i + 1, due: due.toISOString().slice(0, 10), amount: formatCents(each) };
  });
}

export function payoutCsvUrl(claimId) {
  return `/api/claims/${claimId}/payouts.csv`;
}
