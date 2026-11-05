import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateReimbursement, expectedPaymentDate, hasPayoutEstimate } from '../public/reimbursement.js';

test('takes out the deductible and coinsurance', () => {
  const e = estimateReimbursement({ amountCents: 150000, deductibleRemainingCents: 50000, coinsurancePct: 20 });
  assert.deepEqual(e, { deductibleCents: 50000, coinsuranceCents: 20000, payableCents: 80000 });
});

test('pays nothing when the claim is under the remaining deductible', () => {
  const e = estimateReimbursement({ amountCents: 30000, deductibleRemainingCents: 50000, coinsurancePct: 20 });
  assert.deepEqual(e, { deductibleCents: 30000, coinsuranceCents: 0, payableCents: 0 });
});

test('shows the payout estimate only for approved claims', () => {
  assert.equal(hasPayoutEstimate({ status: 'APPROVED' }), true);
  assert.equal(hasPayoutEstimate({ status: 'IN_REVIEW' }), false);
});

test('stops coinsurance at the out-of-pocket maximum', () => {
  const e = estimateReimbursement({ amountCents: 100000, deductibleRemainingCents: 0, coinsurancePct: 20, outOfPocketRemainingCents: 5000 });
  assert.deepEqual(e, { deductibleCents: 0, coinsuranceCents: 5000, payableCents: 95000 });
});

test('expected payment date skips weekends', () => {
  // Friday 2026-11-06 + 10 business days lands on Friday 2026-11-20.
  assert.equal(expectedPaymentDate('2026-11-06T15:00:00Z'), '2026-11-20');
});
