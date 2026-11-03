export function formatCents(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  return `${sign}$${Math.floor(abs / 100).toLocaleString('en-US')}.${String(abs % 100).padStart(2, '0')}`;
}

export function statusLabel(status) {
  return { SUBMITTED: 'Received', IN_REVIEW: 'In review', APPROVED: 'Approved', DENIED: 'Not approved', PAID: 'Paid' }[status] ?? status;
}
