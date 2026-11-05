// Mirrors claims-service DocumentChecklist, plus proof of ownership for theft (new claims ops rule).
const BY_TYPE = {
  AUTO: ['police report or accident report'],
  THEFT: ['police report', 'receipt or proof of ownership'],
  WATER_DAMAGE: ['plumber or contractor report'],
  PROPERTY: [],
};

const OPEN_STATUSES = ['SUBMITTED', 'IN_REVIEW'];

export function requiredDocuments(claim) {
  if (!OPEN_STATUSES.includes(claim.status)) return [];
  const docs = ['claim form', 'photo of damage', ...(BY_TYPE[claim.type] ?? [])];
  if (claim.amountCents > 1000000) docs.push('two repair estimates');
  return docs;
}

export function canWithdraw(claim) {
  return OPEN_STATUSES.includes(claim.status);
}

export async function withdrawClaim(id) {
  const r = await fetch(`/api/claims/${encodeURIComponent(id)}/withdraw`, { method: 'POST', headers: { 'X-Requested-With': 'claims-portal' } });
  if (!r.ok) throw new Error(`withdraw failed: ${r.status}`);
}
