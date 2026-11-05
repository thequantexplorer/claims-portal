export function formatCents(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  return `${sign}$${Math.floor(abs / 100).toLocaleString('en-US')}.${String(abs % 100).padStart(2, '0')}`;
}

export function statusLabel(status) {
  return { SUBMITTED: 'Received', IN_REVIEW: 'In review', APPROVED: 'Approved', DENIED: 'Not approved', PAID: 'Paid', NEEDS_INFO: 'Waiting on you', CLOSED: 'Closed' }[status] ?? status;
}

export function needsCustomerAction(status) {
  return status === 'NEEDS_INFO';
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function daysOpen(submittedAt, now = new Date()) {
  return Math.max(0, Math.floor((new Date(now) - new Date(submittedAt)) / DAY_MS));
}
