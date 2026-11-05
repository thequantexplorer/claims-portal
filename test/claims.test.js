import test from 'node:test';
import assert from 'node:assert/strict';
import { daysOpen, openClaims, outstandingCents } from '../public/claims.js';

const claims = [
  { id: 'CLM-1042', status: 'IN_REVIEW', submittedAt: '2026-10-20T15:00:00Z', amountCents: 120000, paidCents: 0 },
  { id: 'CLM-1017', status: 'PAID', submittedAt: '2026-09-02T09:30:00Z', amountCents: 45000, paidCents: 45000 },
  { id: 'CLM-1031', status: 'APPROVED', submittedAt: '2026-10-01T12:00:00Z', amountCents: 80000, paidCents: 20000 },
];

test('counts days open', () => assert.equal(daysOpen('2026-10-20T15:00:00Z', new Date('2026-10-30T15:00:00Z')), 10));
test('lists open claims', () => assert.equal(openClaims(claims).length, 2));
test('sums what is still owed', () => assert.equal(outstandingCents(claims), 180000));
