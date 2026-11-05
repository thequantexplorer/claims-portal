import test from 'node:test';
import assert from 'node:assert/strict';
import { openClaimsSummary } from '../public/summary.js';

test('summarizes open claims', () => assert.equal(
  openClaimsSummary([
    { status: 'SUBMITTED', amountCents: 10000 },
    { status: 'IN_REVIEW', amountCents: 2550 },
    { status: 'PAID', amountCents: 99900 },
  ]),
  '2 open · $125.50 pending'));

test('summary handles no claims', () => assert.equal(openClaimsSummary([]), '0 open · $0.00 pending'));

test('summary handles all claims closed', () => assert.equal(
  openClaimsSummary([{ status: 'PAID', amountCents: 5000 }]),
  '0 open · $0.00 pending'));

test('summary excludes denied claims', () => assert.equal(
  openClaimsSummary([
    { status: 'APPROVED', amountCents: 20000 },
    { status: 'DENIED', amountCents: 75000 },
  ]),
  '1 open · $200.00 pending'));
