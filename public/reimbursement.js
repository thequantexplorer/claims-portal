/**
 * Estimated payout for a claim once the remaining deductible and the
 * customer's coinsurance share are taken out. All amounts are in cents.
 */
export function estimateReimbursement({ amountCents, deductibleRemainingCents, coinsurancePct }) {
  const afterDeductible = Math.max(amountCents - deductibleRemainingCents, 0);
  const payableCents = Math.round(afterDeductible * (100 - coinsurancePct) / 100);
  return {
    deductibleCents: Math.min(deductibleRemainingCents, amountCents),
    coinsuranceCents: afterDeductible - payableCents,
    payableCents,
  };
}
