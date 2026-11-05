import test from 'node:test';
import assert from 'node:assert/strict';
import { payableCents } from '../public/settlement.js';

const policy = { limitCents: 2000000, deductibleCents: 50000, coinsurance: 0.2 };

test('applies deductible and coinsurance', () => {
  assert.equal(payableCents({ amountCents: 1050000 }, policy), 800000);
});

test('caps at the policy limit', () => {
  assert.equal(payableCents({ amountCents: 5000000 }, policy), 1560000);
});
