/**
 * Estimated payout for a claim once the remaining deductible and the
 * customer's coinsurance share are taken out. The customer's coinsurance stops
 * once they reach their out-of-pocket maximum. All amounts are in cents.
 */
export function estimateReimbursement({ amountCents, deductibleRemainingCents, coinsurancePct, outOfPocketRemainingCents = Infinity }) {
  const afterDeductible = Math.max(amountCents - deductibleRemainingCents, 0);
  const uncappedPayableCents = Math.round(afterDeductible * (100 - coinsurancePct) / 100);
  const coinsuranceCents = Math.min(afterDeductible - uncappedPayableCents, outOfPocketRemainingCents);
  return {
    deductibleCents: Math.min(deductibleRemainingCents, amountCents),
    coinsuranceCents,
    payableCents: afterDeductible - coinsuranceCents,
  };
}

const PAYOUT_BUSINESS_DAYS = 10;

/** We pay approved claims within ten business days of approval. */
export function expectedPaymentDate(approvedAt) {
  if (!approvedAt) return null;
  const d = new Date(approvedAt);
  if (Number.isNaN(d.getTime())) return null;
  let added = 0;
  while (added < PAYOUT_BUSINESS_DAYS) {
    d.setUTCDate(d.getUTCDate() + 1);
    const day = d.getUTCDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d.toISOString().slice(0, 10);
}

export function hasPayoutEstimate(claim) {
  return claim.status === 'APPROVED';
}
