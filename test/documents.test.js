import test from 'node:test';
import assert from 'node:assert/strict';
import { requiredDocuments, canWithdraw } from '../public/documents.js';

test('theft claims need proof of ownership', () =>
  assert.deepEqual(requiredDocuments({ type: 'THEFT', status: 'SUBMITTED', amountCents: 50000 }),
    ['claim form', 'photo of damage', 'police report', 'receipt or proof of ownership']));
test('large claims need two estimates', () =>
  assert.ok(requiredDocuments({ type: 'PROPERTY', status: 'IN_REVIEW', amountCents: 2500000 }).includes('two repair estimates')));
test('claims of exactly $10,000 need two estimates, matching claims-service', () =>
  assert.ok(requiredDocuments({ type: 'PROPERTY', status: 'SUBMITTED', amountCents: 1000000 }).includes('two repair estimates')));
for (const status of ['APPROVED', 'DENIED', 'PAID']) {
  test(`${status} claims need no more documents`, () =>
    assert.deepEqual(requiredDocuments({ type: 'PROPERTY', status, amountCents: 50000 }), []));
}
test('open claims can be withdrawn', () => assert.equal(canWithdraw({ status: 'IN_REVIEW' }), true));
test('paid claims cannot be withdrawn', () => assert.equal(canWithdraw({ status: 'PAID' }), false));
