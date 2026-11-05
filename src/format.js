export function formatCents(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  return `${sign}$${Math.floor(abs / 100).toLocaleString('en-US')}.${String(abs % 100).padStart(2, '0')}`;
}

export function statusLabel(status) {
  return { SUBMITTED: 'Received', IN_REVIEW: 'In review', APPROVED: 'Approved', DENIED: 'Not approved', PAID: 'Paid' }[status] ?? status;
}

/** "Nov 3, 2026" for a claim's filed date (ISO yyyy-mm-dd). */
export function formatFiledDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

/** Sort comparator: newest filedAt (ISO date string) first. */
export function byNewestFiled(a, b) {
  return Date.parse(b.filedAt) - Date.parse(a.filedAt);
}
