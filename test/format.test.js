import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCents, formatDate, statusLabel } from '../src/format.js';
import { formatDate as browserFormatDate } from '../public/format.js';

test('formats cents', () => assert.equal(formatCents(1050000), '$10,500.00'));
test('labels statuses', () => assert.equal(statusLabel('IN_REVIEW'), 'In review'));

test('formats ISO dates without shifting the day in non-UTC time zones', () => {
  const originalTZ = process.env.TZ;
  process.env.TZ = 'America/Los_Angeles';
  try {
    for (const fn of [formatDate, browserFormatDate]) {
      assert.equal(fn('2026-11-03'), 'Nov 3, 2026');
      assert.equal(fn('2026-01-01'), 'Jan 1, 2026');
    }
  } finally {
    if (originalTZ === undefined) delete process.env.TZ;
    else process.env.TZ = originalTZ;
  }
});
