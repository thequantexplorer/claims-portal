import { formatCents } from './format.js';

/**
 * Split a claim payout between payees by percentage share,
 * e.g. co-owners of a vehicle or a policyholder and a lienholder.
 */
export function splitPayout(payableCents, payees) {
  const total = payees.reduce((sum, p) => sum + p.percent, 0);
  if (total !== 100) throw new Error(`Payee shares add up to ${total}%, expected 100%`);

  return payees.map(p => {
    const cents = Math.round((payableCents * p.percent) / 100);
    return { name: p.name, percent: p.percent, cents, amount: formatCents(cents) };
  });
}

/** One line per payee for the claim summary, e.g. "Ana Lima (60%): $6,300.00". */
export function splitSummary(rows) {
  return rows.map(r => `${r.name} (${r.percent}%): ${r.amount}`).join('\n');
}
