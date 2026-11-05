/** Whole days since the claim was filed, for the "Age" column on My claims. */
export function daysSinceFiled(filedOn, today = new Date()) {
  const filed = new Date(filedOn);
  return Math.floor((today - filed) / 86400000);
}

const FINAL_STATUSES = ['PAID', 'DENIED'];

/** Age badge text; open claims older than 30 days are flagged so customers know to call us. */
export function ageBadge(claim, today) {
  const days = daysSinceFiled(claim.filedOn, today);
  if (days > 30 && !FINAL_STATUSES.includes(claim.status)) return `Overdue · ${days} days`;
  return days === 1 ? '1 day' : `${days} days`;
}

/** Claims ordered oldest filed first. */
export function sortOldestFirst(claims) {
  return [...claims].sort((a, b) => new Date(a.filedOn) - new Date(b.filedOn));
}
