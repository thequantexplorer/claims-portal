import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml } from '../public/html.js';

test('escapes markup and attribute quotes in claim ids', () =>
  assert.equal(escapeHtml(`x"><img src=x onerror=alert(1)>'`),
    'x&quot;&gt;&lt;img src=x onerror=alert(1)&gt;&#39;'));
test('escapes non-string values', () => assert.equal(escapeHtml(42), '42'));
