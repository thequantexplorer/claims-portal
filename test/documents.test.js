import test from 'node:test';
import assert from 'node:assert/strict';
import { requiredDocuments, canWithdraw, withdrawClaim } from '../public/documents.js';

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
test('withdrawClaim encodes the claim id and POSTs', async t => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, opts) => { calls.push([url, opts.method, opts.headers['X-Requested-With']]); return { ok: true }; });
  await withdrawClaim('a/b');
  assert.deepEqual(calls, [['/api/claims/a%2Fb/withdraw', 'POST', 'claims-portal']]);
});
test('withdrawClaim throws on a failed response', async t => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: false, status: 409 }));
  await assert.rejects(withdrawClaim('1'), /409/);
});
