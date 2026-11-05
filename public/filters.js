/** Client-side search and status filter for the My claims table. */
export function filterClaims(rows, { query = '', status = '' }) {
  return rows.filter(c =>
    (!query || c.id.includes(query) || c.type.includes(query)) &&
    (!status || c.status === status));
}
