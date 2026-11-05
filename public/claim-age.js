/** Whole days since the claim was filed, for the "Age" column on My claims. */
export function daysSinceFiled(filedOn, today = new Date()) {
  const filed = new Date(filedOn);
  return Math.floor((today - filed) / 86400000);
}

/** Age badge text; open claims older than 30 days are flagged so customers know to call us. */
export function ageBadge(claim, today) {
  const days = daysSinceFiled(claim.filedOn, today);
  if (days > 30 && claim.status !== 'PAID') return `Overdue · ${days} days`;
  return days === 1 ? '1 day' : `${days} days`;
}
