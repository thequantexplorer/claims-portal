import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { staticPath } from '../src/static.js';

const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'portal-static-')));
const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'portal-outside-'));
fs.writeFileSync(path.join(root, 'index.html'), '');
fs.writeFileSync(path.join(root, 'claim.html'), '');
fs.writeFileSync(path.join(outside, 'secret.txt'), '');
fs.symlinkSync(path.join(outside, 'secret.txt'), path.join(root, 'leak.txt'));
after(() => {
  fs.rmSync(root, { recursive: true, force: true });
  fs.rmSync(outside, { recursive: true, force: true });
});

test('serves index.html for /', () => assert.equal(staticPath(root, '/'), path.join(root, 'index.html')));
test('ignores the query string when looking up a static file', () =>
  assert.equal(staticPath(root, '/claim.html?id=42'), path.join(root, 'claim.html')));
test('returns null for missing files', () => assert.equal(staticPath(root, '/nope.html'), null));
test('keeps traversal inside the root', () => assert.equal(staticPath(root, '/../secret.txt'), null));
test('refuses symlinks that point outside the root', () => assert.equal(staticPath(root, '/leak.txt'), null));
test('returns null when the root does not exist', () =>
  assert.equal(staticPath(path.join(root, 'missing'), '/'), null));
