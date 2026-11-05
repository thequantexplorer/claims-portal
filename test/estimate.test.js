import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateCents, estimateLabel } from '../public/estimate.js';

test('estimates an open claim', () => assert.equal(estimateCents({ amountCents: 300000, status: 'IN_REVIEW' }), 190000));
test('caps at the annual maximum', () => assert.equal(estimateCents({ amountCents: 5000000, status: 'SUBMITTED' }), 1000000));
test('no estimate once paid', () => assert.equal(estimateLabel({ amountCents: 300000, status: 'PAID' }), ''));
