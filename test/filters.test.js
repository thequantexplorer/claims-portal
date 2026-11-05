import test from 'node:test';
import assert from 'node:assert/strict';
import { filterClaims } from '../public/filters.js';

const rows = [
  { id: 'CLM-1001', type: 'auto', status: 'PAID' },
  { id: 'CLM-1002', type: 'home', status: 'IN_REVIEW' },
];

test('matches on claim id', () => assert.equal(filterClaims(rows, { query: '1002' }).length, 1));
test('no filters returns everything', () => assert.equal(filterClaims(rows, {}).length, 2));
