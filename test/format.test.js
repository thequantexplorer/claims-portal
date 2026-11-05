import test from 'node:test';
import assert from 'node:assert/strict';
import { statusLabel } from '../src/format.js';

test('labels statuses', () => assert.equal(statusLabel('IN_REVIEW'), 'In review'));
