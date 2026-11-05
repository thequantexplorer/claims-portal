import test from 'node:test';
import assert from 'node:assert/strict';
import { daysOpen, openClaims } from '../src/claims.js';

test('counts whole days open', () =>
  assert.equal(daysOpen('2026-11-01T00:00:00Z', new Date('2026-11-04T12:00:00Z')), 3));

test('drops paid and denied claims', () =>
  assert.deepEqual(openClaims([{ status: 'PAID' }, { status: 'DENIED' }, { status: 'SUBMITTED' }]), [{ status: 'SUBMITTED' }]));
