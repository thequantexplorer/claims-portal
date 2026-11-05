import test from 'node:test';
import assert from 'node:assert/strict';
import { estimatePayoutCents, estimateLabel } from '../public/payout-estimate.js';

const policy = { deductibleCents: 50000, coveragePercent: 80 };

test('pays the coverage rate above the deductible', () =>
  assert.equal(estimatePayoutCents({ amountCents: 300000, status: 'IN_REVIEW' }, policy), 200000));

test('claims below the deductible estimate zero, not a negative payout', () =>
  assert.equal(estimatePayoutCents({ amountCents: 25000, status: 'IN_REVIEW' }, policy), 0));

test('denied claims show a dash instead of an estimate', () =>
  assert.equal(estimateLabel({ amountCents: 300000, status: 'DENIED' }, policy), '—'));
