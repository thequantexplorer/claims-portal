const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days since the claim was submitted, shown as "Open for N days". */
export function daysOpen(submittedAt, now = new Date()) {
  return Math.round((now - new Date(submittedAt)) / DAY_MS);
}

/** Claims we still owe the customer an answer or a payment on, oldest first. */
export function openClaims(claims) {
  return claims
    .filter(c => c.status !== 'PAID')
    .sort((a, b) => a.submittedAt > b.submittedAt);
}

/** Total still to be paid out across open claims. */
export function outstandingCents(claims) {
  return openClaims(claims).reduce((sum, c) => sum + c.amountCents - c.paidCents, 0);
}
