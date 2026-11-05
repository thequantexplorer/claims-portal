import test from 'node:test';
import assert from 'node:assert/strict';
import { estimatePayoutCents, estimateLabel, loadPolicy } from '../public/payout-estimate.js';

const policy = { deductibleCents: 50000, coveragePercent: 80 };

test('pays the coverage rate above the deductible', () =>
  assert.equal(estimatePayoutCents({ amountCents: 300000, status: 'IN_REVIEW' }, policy), 200000));

test('claims below the deductible estimate zero, not a negative payout', () =>
  assert.equal(estimatePayoutCents({ amountCents: 20000, status: 'IN_REVIEW' }, policy), 0));

test('denied and paid claims show a dash', () => {
  assert.equal(estimateLabel({ amountCents: 300000, status: 'DENIED' }, policy), '—');
  assert.equal(estimateLabel({ amountCents: 300000, status: 'PAID' }, policy), '—');
});

test('missing policy terms show a dash instead of failing', () =>
  assert.equal(estimateLabel({ amountCents: 300000, status: 'IN_REVIEW' }, null), '—'));

test('loadPolicy returns null when the policy request fails or is not JSON', async () => {
  assert.equal(await loadPolicy(async () => { throw new Error('network'); }), null);
  assert.equal(await loadPolicy(async () => new Response('<h1>503</h1>', { status: 503 })), null);
  assert.equal(await loadPolicy(async () => new Response('<html>', { status: 200 })), null);
  assert.deepEqual(await loadPolicy(async () => Response.json(policy)), policy);
});
