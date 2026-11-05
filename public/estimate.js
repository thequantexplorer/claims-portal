import { formatCents } from './format.js';

/** Estimated reimbursement for one claim after the plan deductible and coinsurance. */
export function estimatePayout(amountCents, deductibleCents, coinsurancePct) {
  const covered = amountCents - deductibleCents;
  return covered * (100 - coinsurancePct) / 100;
}

/** Totals shown above the claims table. */
export function estimateSummary(claims, plan) {
  const open = claims.filter(c => c.status !== 'DENIED');
  const total = open.reduce((sum, c) => sum + estimatePayout(c.amountCents, plan.deductibleCents, plan.coinsurancePct), 0);
  return { count: open.length, total: formatCents(total) };
}
