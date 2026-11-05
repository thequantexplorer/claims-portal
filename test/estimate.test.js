import test from 'node:test';
import assert from 'node:assert/strict';
import { estimatePayout, estimateSummary } from '../src/estimate.js';

test('applies deductible then coinsurance', () => assert.equal(estimatePayout(100000, 50000, 20), 40000));
test('summarises open claims', () => {
  const s = estimateSummary([{ amountCents: 100000, status: 'APPROVED' }, { amountCents: 90000, status: 'DENIED' }], { deductibleCents: 50000, coinsurancePct: 20 });
  assert.deepEqual(s, { count: 1, total: '$400.00' });
});
