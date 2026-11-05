import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateReimbursement, estimateLabel } from '../src/estimate.js';

test('pays the amount above the deductible minus coinsurance', () => {
  assert.equal(estimateReimbursement(100000, 20000, 20), 64000);
});

test('denied claims show no estimate', () => {
  assert.equal(estimateLabel({ status: 'DENIED', amountCents: 5000 }), '—');
});
