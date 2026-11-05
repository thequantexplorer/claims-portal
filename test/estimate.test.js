import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateCents, estimateClaims, estimateLabel } from '../public/estimate.js';

const claim = (id, amountCents, status, incidentDate = '2026-10-01', policyId = 'POL-1001') =>
  ({ id, policyId, amountCents, status, incidentDate });

test('estimates an open claim: deductible first, then coinsurance', () =>
  assert.equal(estimateCents({ amountCents: 300000, status: 'IN_REVIEW' }), 200000));
test('caps at the annual maximum', () => assert.equal(estimateCents({ amountCents: 5000000, status: 'SUBMITTED' }), 1000000));
test('no estimate for a claim below the deductible', () => assert.equal(estimateCents({ amountCents: 40000, status: 'SUBMITTED' }), 0));
test('no estimate once paid', () => assert.equal(estimateLabel({ amountCents: 300000, status: 'PAID' }), ''));
test('no estimate once denied', () => assert.equal(estimateLabel({ amountCents: 300000, status: 'DENIED' }), ''));

test('deductible is only applied once per plan year', () => {
  const est = estimateClaims([claim('A', 300000, 'PAID', '2026-01-10'), claim('B', 30000, 'IN_REVIEW', '2026-03-01')]);
  assert.equal(est.get('A'), 200000);
  assert.equal(est.get('B'), 24000);
});

test('deductible is shared across partially-met claims', () => {
  const est = estimateClaims([claim('A', 30000, 'APPROVED', '2026-01-10'), claim('B', 100000, 'SUBMITTED', '2026-02-01')]);
  assert.equal(est.get('A'), 0);
  assert.equal(est.get('B'), 64000);
});

test('annual maximum is shared across claims in the plan year', () => {
  const est = estimateClaims([claim('A', 5000000, 'IN_REVIEW', '2026-01-10'), claim('B', 5000000, 'SUBMITTED', '2026-02-01')]);
  assert.equal(est.get('A'), 1000000);
  assert.equal(est.get('B'), 0);
});

test('denied claims consume neither deductible nor annual maximum', () => {
  const est = estimateClaims([claim('A', 5000000, 'DENIED', '2026-01-10'), claim('B', 300000, 'SUBMITTED', '2026-02-01')]);
  assert.equal(est.has('A'), false);
  assert.equal(est.get('B'), 200000);
});

test('balances reset each plan year and are per policy', () => {
  const est = estimateClaims([
    claim('A', 5000000, 'PAID', '2025-06-01'),
    claim('B', 300000, 'SUBMITTED', '2026-02-01'),
    claim('C', 300000, 'SUBMITTED', '2026-03-01', 'POL-2002'),
  ]);
  assert.equal(est.get('B'), 200000);
  assert.equal(est.get('C'), 200000);
});

test('label uses the shared-balance estimate', () => {
  const claims = [claim('A', 5000000, 'IN_REVIEW', '2026-01-10'), claim('B', 5000000, 'SUBMITTED', '2026-02-01')];
  assert.equal(estimateLabel(claims[1], estimateClaims(claims)), 'Est. $0.00');
});
