export function statusLabel(status) {
  return { SUBMITTED: 'Received', IN_REVIEW: 'In review', APPROVED: 'Approved', DENIED: 'Not approved', PAID: 'Paid' }[status] ?? status;
}
