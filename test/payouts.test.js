import test from 'node:test';
import assert from 'node:assert/strict';
import { installmentRows } from '../src/payouts.js';

test('builds monthly rows', () => {
  const rows = installmentRows(300000, 3, '2026-11-01');
  assert.equal(rows.length, 3);
  assert.equal(rows[2].due, '2027-01-01');
});
