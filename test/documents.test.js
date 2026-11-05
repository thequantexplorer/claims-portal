import test from 'node:test';
import assert from 'node:assert/strict';
import { requiredDocuments, canWithdraw } from '../public/documents.js';

test('theft claims need proof of ownership', () =>
  assert.deepEqual(requiredDocuments({ type: 'THEFT', amountCents: 50000 }),
    ['claim form', 'photo of damage', 'police report', 'receipt or proof of ownership']));
test('large claims need two estimates', () =>
  assert.ok(requiredDocuments({ type: 'PROPERTY', amountCents: 2500000 }).includes('two repair estimates')));
test('open claims can be withdrawn', () => assert.equal(canWithdraw({ status: 'IN_REVIEW' }), true));
test('paid claims cannot be withdrawn', () => assert.equal(canWithdraw({ status: 'PAID' }), false));
