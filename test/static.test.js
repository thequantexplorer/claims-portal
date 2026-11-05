import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { staticPath } from '../src/static.js';

const root = path.resolve('public');

test('serves index.html for /', () => assert.equal(staticPath(root, '/'), path.join(root, 'index.html')));
test('ignores the query string when looking up a static file', () =>
  assert.equal(staticPath(root, '/claim.html?id=42'), path.join(root, 'claim.html')));
test('keeps traversal inside public/', () => assert.equal(staticPath(root, '/../package.json'), path.join(root, 'package.json')));
test('keeps encoded traversal inside public/', () => assert.equal(staticPath(root, '/%2e%2e/package.json'), path.join(root, 'package.json')));
