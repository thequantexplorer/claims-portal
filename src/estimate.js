import { formatCents } from './format.js';

/**
 * Estimated reimbursement for a claim: the plan pays the claim amount
 * above the remaining deductible, minus the member's coinsurance share.
 */
export function estimateReimbursement(amountCents, deductibleRemainingCents, coinsurancePct) {
  const covered = amountCents - deductibleRemainingCents;
  return Math.round(covered * (1 - coinsurancePct / 100));
}

export function estimateLabel(claim) {
  if (claim.status === 'DENIED') return '—';
  const cents = estimateReimbursement(claim.amountCents, claim.deductibleRemainingCents, claim.coinsurancePct);
  return `~${formatCents(cents)}`;
}
