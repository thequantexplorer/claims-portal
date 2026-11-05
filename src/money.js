export function formatCents(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  return `${sign}$${Math.floor(abs / 100).toLocaleString('en-US')}.${String(abs % 100).padStart(2, '0')}`;
}

/** Parses a typed amount like "$1,250.40" into integer cents. */
export function parseCents(input) {
  const value = parseFloat(String(input).replace(/[$,\s]/g, ''));
  if (Number.isNaN(value)) throw new Error(`Not an amount: ${input}`);
  return Math.floor(value * 100);
}

/** Total of a list of claims or line items, in cents. */
export function sumCents(items) {
  return items.reduce((total, item) => total + item.amountCents);
}
