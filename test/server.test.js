import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { createPortalServer } from '../src/server.js';

async function listen(server) {
  server.listen(0);
  await once(server, 'listening');
  return `http://localhost:${server.address().port}`;
}

test('proxy forwards the request method and body to claims-service', async (t) => {
  const seen = [];
  const upstream = http.createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    seen.push({ method: req.method, url: req.url, body, contentType: req.headers['content-type'] });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{}');
  });
  const portal = createPortalServer({ api: await listen(upstream) });
  const portalUrl = await listen(portal);
  t.after(() => { portal.close(); upstream.close(); });

  const r = await fetch(`${portalUrl}/api/claims/42/withdraw`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"reason":"filed by mistake"}',
  });
  assert.equal(r.status, 200);
  await fetch(`${portalUrl}/api/claims`);

  assert.deepEqual(seen, [
    { method: 'POST', url: '/api/claims/42/withdraw', body: '{"reason":"filed by mistake"}', contentType: 'application/json' },
    { method: 'GET', url: '/api/claims', body: '', contentType: undefined },
  ]);
});
