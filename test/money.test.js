import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCents, parseCents } from '../src/money.js';

test('formats cents', () => assert.equal(formatCents(1050000), '$10,500.00'));
test('parses typed amounts', () => assert.equal(parseCents('$1,250.50'), 125050));
