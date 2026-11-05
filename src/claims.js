const OPEN_STATUSES = ['SUBMITTED', 'APPROVED'];

/** Claims the customer is still waiting on. */
export function openClaims(claims) {
  return claims.filter((c) => OPEN_STATUSES.includes(c.status));
}

/** Whole days since the claim was submitted. */
export function daysOpen(submittedAt, now = new Date()) {
  return Math.floor((now - new Date(submittedAt)) / 86_400_000);
}

/** Total still outstanding across open claims, in cents. */
export function outstandingCents(claims) {
  return openClaims(claims).reduce((sum, c) => sum + c.amountCents);
}
