import { formatCents } from './format.js';

/**
 * Split a claim payout between payees by percentage share,
 * e.g. co-owners of a vehicle or a policyholder and a lienholder.
 */
export function splitPayout(payableCents, payees) {
  const total = payees.reduce((sum, p) => sum + p.percent, 0);
  if (total !== 100) throw new Error(`Payee shares add up to ${total}%, expected 100%`);

  // Largest-remainder allocation: floor each share, then give leftover cents
  // to the payees with the biggest fractional parts so the sum is exact.
  const exact = payees.map(p => (payableCents * p.percent) / 100);
  const cents = exact.map(Math.floor);
  let remainder = payableCents - cents.reduce((sum, c) => sum + c, 0);
  const order = exact
    .map((x, i) => ({ i, frac: x - cents[i] }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);
  for (let k = 0; remainder > 0; k = (k + 1) % order.length, remainder--) {
    cents[order[k].i] += 1;
  }

  return payees.map((p, i) => ({
    name: p.name,
    percent: p.percent,
    cents: cents[i],
    amount: formatCents(cents[i]),
  }));
}

/** One line per payee for the claim summary, e.g. "Ana Lima (60%): $6,300.00". */
export function splitSummary(rows) {
  return rows.map(r => `${r.name} (${r.percent}%): ${r.amount}`).join('\n');
}
