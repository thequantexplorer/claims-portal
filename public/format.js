export function formatCents(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  return `${sign}$${Math.floor(abs / 100).toLocaleString('en-US')}.${String(abs % 100).padStart(2, '0')}`;
}

export function statusLabel(status) {
  return { SUBMITTED: 'Received', IN_REVIEW: 'In review', APPROVED: 'Approved', DENIED: 'Not approved', PAID: 'Paid' }[status] ?? status;
}

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => HTML_ESCAPES[ch]);
}

export function isOpenStatus(status) {
  return status === 'SUBMITTED' || status === 'IN_REVIEW';
}

export function uploadError(status) {
  return {
    400: 'The file was empty or missing. Please choose a file.',
    403: 'You are not allowed to add files to this claim.',
    404: 'We could not find this claim.',
    409: 'This claim is no longer open, so files cannot be added.',
    413: 'The file is larger than 10 MB, or this claim already has the maximum number of files.',
    415: 'Only JPEG, PNG or PDF files can be uploaded.',
  }[status] ?? 'Something went wrong uploading the file. Please try again.';
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
