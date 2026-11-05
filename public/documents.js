// Mirrors claims-service DocumentChecklist, plus proof of ownership for theft (new claims ops rule).
const BY_TYPE = {
  AUTO: ['police report or accident report'],
  THEFT: ['police report', 'receipt or proof of ownership'],
  WATER_DAMAGE: ['plumber or contractor report'],
  PROPERTY: [],
};

export function requiredDocuments(claim) {
  const docs = ['claim form', 'photo of damage', ...(BY_TYPE[claim.type] ?? [])];
  if (claim.amountCents > 1000000) docs.push('two repair estimates');
  return docs;
}

export function canWithdraw(claim) {
  return claim.status === 'SUBMITTED' || claim.status === 'IN_REVIEW';
}

export async function withdrawClaim(id) {
  const r = await fetch(`/api/claims/${id}/withdraw`, { method: 'POST' });
  if (!r.ok) throw new Error(`withdraw failed: ${r.status}`);
}
