import { formatCents } from './format.js';

// Standard Northwind Silver plan terms.
const PLAN = { deductibleCents: 50000, coinsurance: 0.8, annualMaxCents: 1000000 };

const NO_ESTIMATE = new Set(['PAID', 'DENIED']);

/** Reimbursement for one claim given the deductible and annual benefit still remaining. */
export function estimateCents(claim, plan = PLAN, remaining = {}) {
  const deductibleLeft = remaining.deductibleCents ?? plan.deductibleCents;
  const benefitLeft = remaining.annualMaxCents ?? plan.annualMaxCents;
  const afterDeductible = Math.max(claim.amountCents - deductibleLeft, 0);
  const covered = Math.round(afterDeductible * plan.coinsurance);
  return Math.min(covered, Math.max(benefitLeft, 0));
}

/**
 * Estimates for every claim, keyed by claim id. Claims on the same policy and plan year
 * (calendar year of the incident) share one deductible and one annual maximum, consumed in
 * incident order. Denied claims consume neither.
 */
export function estimateClaims(claims, plan = PLAN) {
  const balances = new Map();
  const estimates = new Map();
  const ordered = [...claims].sort((a, b) =>
    String(a.incidentDate).localeCompare(String(b.incidentDate)) || String(a.id).localeCompare(String(b.id)));
  for (const claim of ordered) {
    if (claim.status === 'DENIED') continue;
    const key = `${claim.policyId}|${String(claim.incidentDate).slice(0, 4)}`;
    const left = balances.get(key) ?? { deductibleCents: plan.deductibleCents, annualMaxCents: plan.annualMaxCents };
    const cents = estimateCents(claim, plan, left);
    balances.set(key, {
      deductibleCents: Math.max(left.deductibleCents - claim.amountCents, 0),
      annualMaxCents: left.annualMaxCents - cents,
    });
    estimates.set(claim.id, cents);
  }
  return estimates;
}

export function estimateLabel(claim, estimates) {
  if (NO_ESTIMATE.has(claim.status)) return '';
  const cents = estimates?.get(claim.id) ?? estimateCents(claim);
  return `Est. ${formatCents(cents)}`;
}
