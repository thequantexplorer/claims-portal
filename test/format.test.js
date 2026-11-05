process.env.TZ = 'America/Los_Angeles';
import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCents, statusLabel, formatFiledDate, byNewestFiled } from '../src/format.js';

test('formats cents', () => assert.equal(formatCents(1050000), '$10,500.00'));
test('labels statuses', () => assert.equal(statusLabel('IN_REVIEW'), 'In review'));
test('formats filed dates', () => assert.equal(formatFiledDate('2026-11-03T15:00:00Z'), 'Nov 3, 2026'));
test('formats date-only filed dates west of UTC', () => assert.equal(formatFiledDate('2026-11-03'), 'Nov 3, 2026'));
test('sorts claims newest filed first', () => {
  const rows = [{ id: 'a', filedAt: '2026-09-14' }, { id: 'b', filedAt: '2026-11-03' }, { id: 'c', filedAt: '2026-10-01' }];
  assert.deepEqual(rows.sort(byNewestFiled).map(r => r.id), ['b', 'c', 'a']);
});
