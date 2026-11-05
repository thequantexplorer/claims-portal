import test from 'node:test';
import assert from 'node:assert/strict';
import { splitPayout, splitSummary } from '../src/splits.js';

test('splits a payout by percentage', () => {
  const rows = splitPayout(1050000, [
    { name: 'Ana Lima', percent: 60 },
    { name: 'First Federal Auto', percent: 40 },
  ]);
  assert.deepEqual(rows.map(r => r.cents), [630000, 420000]);
  assert.equal(splitSummary(rows), 'Ana Lima (60%): $6,300.00\nFirst Federal Auto (40%): $4,200.00');
});

test('split cents always sum to the payable amount', () => {
  const half = splitPayout(1, [{ name: 'A', percent: 50 }, { name: 'B', percent: 50 }]);
  assert.deepEqual(half.map(r => r.cents), [1, 0]);

  const thirds = splitPayout(100, [
    { name: 'A', percent: 33 },
    { name: 'B', percent: 33 },
    { name: 'C', percent: 34 },
  ]);
  assert.equal(thirds.reduce((s, r) => s + r.cents, 0), 100);
});

test('rejects shares that do not add up to 100%', () => {
  assert.throws(() => splitPayout(100000, [{ name: 'A', percent: 50 }, { name: 'B', percent: 40 }]));
});
