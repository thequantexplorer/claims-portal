import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCents, formatDate, statusLabel } from '../src/format.js';

test('formats cents', () => assert.equal(formatCents(1050000), '$10,500.00'));
test('labels statuses', () => assert.equal(statusLabel('IN_REVIEW'), 'In review'));
test('formats submitted dates', () => {
  assert.equal(formatDate('2026-11-04'), 'Nov 4, 2026');
  assert.equal(formatDate('2026-01-31T23:30:00Z'), 'Jan 31, 2026');
});
