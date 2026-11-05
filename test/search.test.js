import test from 'node:test';
import assert from 'node:assert/strict';
import { filterClaims, describeResults } from '../public/search.js';
import { claimsCsv } from '../src/export.js';

const claims = [
  { id: 'CLM-1001', type: 'Auto', amountCents: 125000, status: 'APPROVED', submittedAt: '2026-10-02T15:00:00Z' },
  { id: 'CLM-1002', type: 'Home', amountCents: 40000, status: 'IN_REVIEW', submittedAt: '2026-10-20T09:30:00Z' },
];

test('filters by type, ignoring case', () => assert.deepEqual(filterClaims(claims, 'home').map(c => c.id), ['CLM-1002']));
test('empty query keeps every claim', () => assert.equal(filterClaims(claims, '  ').length, 2));
test('describes partial results', () => assert.equal(describeResults(1, 2), '1 of 2 claims'));
test('csv has a header and one row per claim', () => assert.equal(claimsCsv(claims).split('\n').length, 3));
