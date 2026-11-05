import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml } from '../public/format.js';

test('escapes markup in claim fields', () =>
  assert.equal(escapeHtml(`<img src=x onerror="alert('x')">&`), '&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;&amp;'));
test('renders missing fields as empty', () => assert.equal(escapeHtml(undefined), ''));
