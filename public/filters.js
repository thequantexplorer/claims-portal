/** Client-side search and status filter for the My claims table. */
export function filterClaims(rows, { query = '', status = '' }) {
  const q = query.trim().toLowerCase();
  return rows.filter(c =>
    (!q || c.id.toLowerCase().includes(q) || c.type.toLowerCase().includes(q)) &&
    (!status || c.status === status));
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}
