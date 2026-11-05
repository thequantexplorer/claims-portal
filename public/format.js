export function formatCents(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  return `${sign}$${Math.floor(abs / 100).toLocaleString('en-US')}.${String(abs % 100).padStart(2, '0')}`;
}

export function statusLabel(status) {
  return { SUBMITTED: 'Received', IN_REVIEW: 'In review', APPROVED: 'Approved', DENIED: 'Not approved', PAID: 'Paid' }[status] ?? status;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(iso) {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}
