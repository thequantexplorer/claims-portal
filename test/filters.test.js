import test from 'node:test';
import assert from 'node:assert/strict';
import { filterClaims, escapeHtml } from '../public/filters.js';

const rows = [
  { id: 'CLM-1001', type: 'auto', status: 'PAID' },
  { id: 'CLM-1002', type: 'home', status: 'IN_REVIEW' },
];

test('matches on claim id', () => assert.equal(filterClaims(rows, { query: '1002' }).length, 1));
test('no filters returns everything', () => assert.equal(filterClaims(rows, {}).length, 2));
test('status filter uses stored status codes', () => {
  assert.deepEqual(filterClaims(rows, { status: 'PAID' }).map(c => c.id), ['CLM-1001']);
});
test('search is case-insensitive', () => {
  assert.deepEqual(filterClaims(rows, { query: 'clm-1001' }).map(c => c.id), ['CLM-1001']);
  assert.deepEqual(filterClaims(rows, { query: 'Auto' }).map(c => c.id), ['CLM-1001']);
});
test('escapeHtml neutralizes markup', () =>
  assert.equal(escapeHtml('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'));
