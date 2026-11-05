import { formatCents } from './format.js';

/** Estimated payout for an open claim: amount above the deductible, times the policy's coverage rate. */
export function estimatePayoutCents(claim, policy) {
  const covered = Math.max(0, claim.amountCents - policy.deductibleCents);
  return Math.round(covered * policy.coveragePercent / 100);
}

/** Text for the "Estimated payout" column; closed claims, or missing policy terms, show a dash. */
export function estimateLabel(claim, policy) {
  if (claim.status === 'PAID' || claim.status === 'DENIED' || !policy) return '—';
  return formatCents(estimatePayoutCents(claim, policy));
}

/** Policy terms from `/api/policy`, or null if they cannot be loaded. */
export async function loadPolicy(fetchFn = fetch) {
  try {
    const res = await fetchFn('/api/policy');
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
