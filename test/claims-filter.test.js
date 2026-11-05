import test from 'node:test';
import assert from 'node:assert/strict';
import { filterClaims } from '../src/claims-filter.js';

const claims = [
  { id: 'CLM-1041', status: 'PAID', submittedAt: '2026-09-02T10:00:00Z' },
  { id: 'CLM-1042', status: 'IN_REVIEW', submittedAt: '2026-10-14T09:30:00Z' },
];

test('matches by status label', () => assert.deepEqual(filterClaims(claims, 'review').map(c => c.id), ['CLM-1042']));
test('empty query returns every claim', () => assert.equal(filterClaims(claims, '  ').length, 2));
