import test from 'node:test';
import assert from 'node:assert/strict';
import { ageBadge } from '../public/claim-age.js';

test('shows plain age for a recent claim', () =>
  assert.equal(ageBadge({ filedOn: '2026-10-01T12:00:00Z', status: 'IN_REVIEW' }, new Date('2026-10-11T12:00:00Z')), '10 days'));
test('flags open claims older than 30 days', () =>
  assert.equal(ageBadge({ filedOn: '2026-09-01T12:00:00Z', status: 'IN_REVIEW' }, new Date('2026-10-11T12:00:00Z')), 'Overdue · 40 days'));
