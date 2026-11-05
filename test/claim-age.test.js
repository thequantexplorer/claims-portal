import test from 'node:test';
import assert from 'node:assert/strict';
import { ageBadge, sortOldestFirst } from '../public/claim-age.js';

test('shows plain age for a recent claim', () =>
  assert.equal(ageBadge({ filedOn: '2026-10-01T12:00:00Z', status: 'IN_REVIEW' }, new Date('2026-10-11T12:00:00Z')), '10 days'));
test('flags open claims older than 30 days', () =>
  assert.equal(ageBadge({ filedOn: '2026-09-01T12:00:00Z', status: 'IN_REVIEW' }, new Date('2026-10-11T12:00:00Z')), 'Overdue · 40 days'));
test('does not flag old denied claims as overdue', () =>
  assert.equal(ageBadge({ filedOn: '2026-09-01T12:00:00Z', status: 'DENIED' }, new Date('2026-10-11T12:00:00Z')), '40 days'));
test('does not flag old paid claims as overdue', () =>
  assert.equal(ageBadge({ filedOn: '2026-09-01T12:00:00Z', status: 'PAID' }, new Date('2026-10-11T12:00:00Z')), '40 days'));
test('sorts claims oldest first', () =>
  assert.deepEqual(
    sortOldestFirst([{ id: 'b', filedOn: '2026-03-01' }, { id: 'c', filedOn: '2026-02-01' }, { id: 'a', filedOn: '2026-01-01' }]).map(c => c.id),
    ['a', 'c', 'b']));
