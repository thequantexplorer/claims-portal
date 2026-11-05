import test from 'node:test';
import assert from 'node:assert/strict';
import { claimsCsv, csvFilename } from '../src/csv.js';

test('writes a header and one row per claim', () => {
  const csv = claimsCsv([{ id: 'CLM-1', type: 'Dental', amountCents: 4500, status: 'PAID', submittedAt: '2026-10-02T09:00:00Z' }]);
  assert.equal(csv, 'Claim,Type,Amount,Status,Submitted\r\nCLM-1,Dental,$45.00,Paid,2026-10-02\r\n');
});

test('names the file with the calendar month', () => {
  assert.equal(csvFilename(new Date(2026, 10, 4)), 'claims-2026-11-04.csv');
});

test('quotes values that contain commas or quotes', () => {
  const csv = claimsCsv([{ id: 'CLM-2', type: 'Vision, "premium"', amountCents: 123456, status: 'APPROVED' }]);
  assert.equal(csv.split('\r\n')[1], 'CLM-2,"Vision, ""premium""","$1,234.56",Approved,');
});

test('quotes values that contain line breaks', () => {
  const csv = claimsCsv([{ id: 'CLM-3', type: 'Dental\r\ncleaning', amountCents: 1050000, status: 'PAID' }]);
  assert.equal(csv.split('\r\n').slice(1, 3).join('\r\n'), 'CLM-3,"Dental\r\ncleaning","$10,500.00",Paid,');
});

test('neutralizes cells that a spreadsheet would run as formulas', () => {
  const csv = claimsCsv([{ id: '@CLM-4', type: '=HYPERLINK("http://x","y")', amountCents: 100, status: '+1', submittedAt: '-2+3' }]);
  assert.equal(csv.split('\r\n')[1], `'@CLM-4,"'=HYPERLINK(""http://x"",""y"")",$1.00,'+1,'-2+3`);
});

test('keeps negative amounts as plain numbers', () => {
  const csv = claimsCsv([{ id: 'CLM-5', type: 'Refund', amountCents: -4500, status: 'PAID' }]);
  assert.equal(csv.split('\r\n')[1], 'CLM-5,Refund,-$45.00,Paid,');
});

test('leaves missing fields empty', () => {
  const csv = claimsCsv([{ id: 'CLM-6', type: null, amountCents: 100 }]);
  assert.equal(csv.split('\r\n')[1], 'CLM-6,,$1.00,,');
});
