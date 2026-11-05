import { statusLabel } from './format.js';

/** Claims matching the search box on "My claims", newest first. */
export function filterClaims(claims, query) {
  const q = query.trim().toLowerCase();
  return claims
    .filter(c => !q || c.id.includes(q) || statusLabel(c.status).toLowerCase().includes(q))
    .sort((a, b) => b.submittedAt - a.submittedAt);
}
