import test from 'node:test';
import assert from 'node:assert/strict';
import { requiredDocuments, canWithdraw } from '../public/documents.js';

test('theft claims need proof of ownership', () =>
  assert.deepEqual(requiredDocuments({ type: 'THEFT', status: 'SUBMITTED', amountCents: 50000 }),
    ['claim form', 'photo of damage', 'police report', 'receipt or proof of ownership']));
test('large claims need two estimates', () =>
  assert.ok(requiredDocuments({ type: 'PROPERTY', status: 'IN_REVIEW', amountCents: 2500000 }).includes('two repair estimates')));
test('open claims can be withdrawn', () => assert.equal(canWithdraw({ status: 'IN_REVIEW' }), true));
test('paid claims cannot be withdrawn', () => assert.equal(canWithdraw({ status: 'PAID' }), false));
test('decided claims need no documents', () => {
  for (const status of ['APPROVED', 'DENIED', 'PAID'])
    assert.deepEqual(requiredDocuments({ type: 'PROPERTY', status, amountCents: 50000 }), []);
});
