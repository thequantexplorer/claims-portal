import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCents, formatDate, statusLabel } from '../src/format.js';

test('formats cents', () => assert.equal(formatCents(1050000), '$10,500.00'));
test('labels statuses', () => assert.equal(statusLabel('IN_REVIEW'), 'In review'));
test('formats filed dates', () => assert.equal(formatDate('2026-11-03T15:00:00Z'), 'Nov 3, 2026'));
test('formats dates in UTC so they do not shift a day', () => {
  assert.equal(formatDate('2026-11-03'), 'Nov 3, 2026');
  assert.equal(formatDate('2026-11-03T00:30:00Z'), 'Nov 3, 2026');
  assert.equal(formatDate('2026-11-03T23:30:00Z'), 'Nov 3, 2026');
});
