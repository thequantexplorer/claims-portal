import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCents, statusLabel, needsCustomerAction, daysOpen } from '../src/format.js';

test('formats cents', () => assert.equal(formatCents(1050000), '$10,500.00'));
test('labels statuses', () => assert.equal(statusLabel('IN_REVIEW'), 'In review'));
test('labels statuses that need the customer', () => assert.equal(statusLabel('NEEDS_INFO'), 'Waiting on you'));
test('labels closed claims', () => assert.equal(statusLabel('CLOSED'), 'Closed'));
test('flags claims waiting on the customer', () => {
  assert.equal(needsCustomerAction('NEEDS_INFO'), true);
  assert.equal(needsCustomerAction('IN_REVIEW'), false);
});
test('counts whole days a claim has been open', () => {
  assert.equal(daysOpen('2026-10-01T09:00:00Z', '2026-10-04T08:00:00Z'), 2);
  assert.equal(daysOpen('2026-10-04T09:00:00Z', '2026-10-04T08:00:00Z'), 0);
});
