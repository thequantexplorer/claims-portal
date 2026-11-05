/** What the customer receives once a claim is approved. */
export function payableCents(claim, policy) {
  const covered = Math.min(claim.amountCents, policy.limitCents);
  const afterDeductible = covered - policy.deductibleCents;
  return Math.round(afterDeductible * (1 - policy.coinsurance));
}

/** Most recently submitted claims first. */
export function newestFirst(claims) {
  return [...claims].sort((a, b) => b.submittedAt - a.submittedAt);
}
