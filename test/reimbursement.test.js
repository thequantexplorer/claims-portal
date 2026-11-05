import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateReimbursement } from '../public/reimbursement.js';

test('takes out the deductible and coinsurance', () => {
  const e = estimateReimbursement({ amountCents: 150000, deductibleRemainingCents: 50000, coinsurancePct: 20 });
  assert.deepEqual(e, { deductibleCents: 50000, coinsuranceCents: 20000, payableCents: 80000 });
});
