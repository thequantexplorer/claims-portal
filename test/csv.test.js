import test from 'node:test';
import assert from 'node:assert/strict';
import { claimsCsv } from '../src/csv.js';

test('writes a header and one row per claim', () => {
  const csv = claimsCsv([{ id: 'CLM-1', type: 'Dental', amountCents: 4500, status: 'PAID', submittedAt: '2026-10-02T09:00:00Z' }]);
  assert.equal(csv, 'Claim,Type,Amount,Status,Submitted\r\nCLM-1,Dental,$45.00,Paid,2026-10-02\r\n');
});
