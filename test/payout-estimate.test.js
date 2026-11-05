import test from 'node:test';
import assert from 'node:assert/strict';
import { estimatePayoutCents } from '../public/payout-estimate.js';

const policy = { deductibleCents: 50000, coveragePercent: 80 };

test('pays the coverage rate above the deductible', () =>
  assert.equal(estimatePayoutCents({ amountCents: 300000, status: 'IN_REVIEW' }, policy), 200000));
