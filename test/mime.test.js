import test from 'node:test';
import assert from 'node:assert/strict';
import { contentType } from '../src/mime.js';

test('ES module scripts are served with a JavaScript MIME type so the browser runs them', () => {
  assert.equal(contentType('/srv/public/format.js'), 'text/javascript; charset=utf-8');
});

test('HTML and unknown static files get explicit content types', () => {
  assert.equal(contentType('/srv/public/index.html'), 'text/html; charset=utf-8');
  assert.equal(contentType('/srv/public/LOGO.PNG'), 'image/png');
  assert.equal(contentType('/srv/public/data.bin'), 'application/octet-stream');
});
