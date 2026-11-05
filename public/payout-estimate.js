import { formatCents } from './format.js';

/** Estimated payout for an open claim: amount above the deductible, times the policy's coverage rate. */
export function estimatePayoutCents(claim, policy) {
  const covered = Math.max(0, claim.amountCents - policy.deductibleCents);
  return Math.round(covered * policy.coveragePercent / 100);
}

/** Text for the "Estimated payout" column; closed claims show a dash. */
export function estimateLabel(claim, policy) {
  if (claim.status === 'PAID' || claim.status === 'DENIED') return '—';
  return formatCents(estimatePayoutCents(claim, policy));
}
