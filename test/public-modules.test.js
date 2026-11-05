import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const pub = path.resolve('public');
const read = (...p) => fs.readFileSync(path.join(...p), 'utf8');
const imports = (src) => [...src.matchAll(/from\s+'([^']+)'/g)].map((m) => m[1]);

test('every module imported by index.html is served from public', () => {
  for (const spec of imports(read(pub, 'index.html'))) {
    assert.ok(fs.existsSync(path.join(pub, spec)), `${spec} is not in public/`);
  }
});

test('browser modules in public match their src counterparts', () => {
  for (const name of fs.readdirSync(pub).filter((f) => f.endsWith('.js'))) {
    assert.equal(read(pub, name), read('src', name), `public/${name} is out of sync with src/${name}`);
  }
});
