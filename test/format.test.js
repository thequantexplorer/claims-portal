import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCents, statusLabel } from '../src/format.js';

test('formats cents', () => assert.equal(formatCents(1050000), '$10,500.00'));
test('labels statuses', () => assert.equal(statusLabel('IN_REVIEW'), 'In review'));
