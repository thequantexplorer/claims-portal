import { formatCents } from './format.js';

// Standard Northwind Silver plan terms.
const PLAN = { deductibleCents: 50000, coinsurance: 0.8, annualMaxCents: 1000000 };

/** Estimated reimbursement for a claim that hasn't been paid yet. */
export function estimateCents(claim, plan = PLAN) {
  const covered = Math.round(claim.amountCents * plan.coinsurance) - plan.deductibleCents;
  return Math.min(Math.max(covered, 0), plan.annualMaxCents);
}

export function estimateLabel(claim) {
  if (claim.status === 'PAID') return '';
  return `Est. ${formatCents(estimateCents(claim))}`;
}
