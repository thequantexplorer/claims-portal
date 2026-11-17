import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  formatCents, statusLabel, escapeHtml, isOpenStatus, uploadError, formatBytes, MAX_UPLOAD_BYTES, ACCEPTED_TYPES,
} from '../src/format.js';

test('formats cents', () => assert.equal(formatCents(1050000), '$10,500.00'));
test('labels statuses', () => assert.equal(statusLabel('IN_REVIEW'), 'In review'));

test('escapes HTML in user-supplied file names', () => {
  assert.equal(escapeHtml('<img src=x onerror=alert(1)>.png'), '&lt;img src=x onerror=alert(1)&gt;.png');
  assert.equal(escapeHtml(`a&b "q" 's'`), 'a&amp;b &quot;q&quot; &#39;s&#39;');
});

test('escapeHtml handles null, undefined and non-strings', () => {
  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml(undefined), '');
  assert.equal(escapeHtml(42), '42');
});

test('only SUBMITTED and IN_REVIEW claims are open', () => {
  assert.equal(isOpenStatus('SUBMITTED'), true);
  assert.equal(isOpenStatus('IN_REVIEW'), true);
  for (const s of ['APPROVED', 'DENIED', 'PAID', undefined]) assert.equal(isOpenStatus(s), false, String(s));
});

test('maps upload error statuses to distinct readable messages', () => {
  const codes = [400, 403, 404, 409, 413, 415];
  const messages = codes.map(uploadError);
  assert.equal(new Set(messages).size, codes.length);
  assert.match(uploadError(409), /no longer open/);
  assert.match(uploadError(413), /10 MB/);
  assert.match(uploadError(415), /JPEG, PNG or PDF/);
  assert.match(uploadError(500), /Something went wrong/);
  for (const m of messages) assert.doesNotMatch(m, /Something went wrong/);
});

test('formats byte sizes', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(1023), '1023 B');
  assert.equal(formatBytes(1024), '1.0 KB');
  assert.equal(formatBytes(1536), '1.5 KB');
  assert.equal(formatBytes(1024 * 1024), '1.0 MB');
  assert.equal(formatBytes(MAX_UPLOAD_BYTES), '10.0 MB');
});

test('upload limits match the API contract', () => {
  assert.equal(MAX_UPLOAD_BYTES, 10 * 1024 * 1024);
  assert.deepEqual(ACCEPTED_TYPES, ['image/jpeg', 'image/png', 'application/pdf']);
});

test('public/format.js is an exact copy of src/format.js', () => {
  const src = fs.readFileSync(new URL('../src/format.js', import.meta.url), 'utf8');
  const pub = fs.readFileSync(new URL('../public/format.js', import.meta.url), 'utf8');
  assert.equal(pub, src, 'public/format.js is served to the browser; keep it identical to src/format.js');
});
