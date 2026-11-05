import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { createServer } from '../src/server.js';

test('proxy forwards method and body to claims-service', async t => {
  let seen;
  const upstream = http.createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    seen = { method: req.method, url: req.url, body, role: req.headers['x-user-role'] };
    res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{}');
  }).listen(0);
  await once(upstream, 'listening');
  const portal = createServer(`http://localhost:${upstream.address().port}`).listen(0);
  await once(portal, 'listening');
  t.after(() => { upstream.close(); portal.close(); });

  const r = await fetch(`http://localhost:${portal.address().port}/api/claims/123/withdraw`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"reason":"mistake"}' });
  assert.equal(r.status, 200);
  assert.deepEqual(seen, { method: 'POST', url: '/api/claims/123/withdraw', body: '{"reason":"mistake"}', role: 'CUSTOMER' });
});
