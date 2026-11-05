/** Case-insensitive match on claim id, type, or status. */
export function matchesQuery(claim, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [claim.id, claim.type, claim.status].some(v => String(v).toLowerCase().includes(q));
}

export function filterClaims(claims, query) {
  return claims.filter(c => matchesQuery(c, query));
}

export function describeResults(shown, total) {
  return shown === total ? `${total} claims` : `${shown} of ${total} claims`;
}
