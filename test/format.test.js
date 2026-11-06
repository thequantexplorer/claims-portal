import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCents, formatDate, statusLabel } from '../src/format.js';

test('formats cents', () => assert.equal(formatCents(1050000), '$10,500.00'));
test('labels statuses', () => assert.equal(statusLabel('IN_REVIEW'), 'In review'));
test('formats filed dates without shifting the day', (t) => {
  const tz = process.env.TZ;
  process.env.TZ = 'America/Los_Angeles';
  t.after(() => { if (tz === undefined) delete process.env.TZ; else process.env.TZ = tz; });
  assert.equal(formatDate('2026-11-03'), 'Nov 3, 2026');
  assert.equal(formatDate('2026-01-31T23:30:00Z'), 'Jan 31, 2026');
  assert.equal(formatDate('2026-03-01T00:00:00Z'), 'Mar 1, 2026');
});
