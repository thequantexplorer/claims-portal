import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCents, statusLabel, formatFiledDate } from '../src/format.js';

test('formats cents', () => assert.equal(formatCents(1050000), '$10,500.00'));
test('labels statuses', () => assert.equal(statusLabel('IN_REVIEW'), 'In review'));
test('formats filed dates', () => assert.equal(formatFiledDate('2026-11-03T15:00:00Z'), 'Nov 3, 2026'));
