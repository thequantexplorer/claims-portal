import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { createServer } from '../src/server.js';

async function startPair(t) {
  const state = {};
  state.upstream = http.createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    state.seen = { method: req.method, url: req.url, body, role: req.headers['x-user-role'] };
    res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{}');
  }).listen(0);
  await once(state.upstream, 'listening');
  const portal = createServer(`http://localhost:${state.upstream.address().port}`).listen(0);
  await once(portal, 'listening');
  t.after(() => { state.upstream.close(); portal.close(); });
  state.base = `http://localhost:${portal.address().port}`;
  state.port = portal.address().port;
  return state;
}

test('proxy forwards method and body to claims-service', async t => {
  const s = await startPair(t);

  const r = await fetch(`${s.base}/api/claims/123/withdraw`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"reason":"mistake"}' });
  assert.equal(r.status, 200);
  assert.deepEqual(s.seen, { method: 'POST', url: '/api/claims/123/withdraw', body: '{"reason":"mistake"}', role: 'CUSTOMER' });
});

test('proxy rejects cross-site writes', async t => {
  const s = await startPair(t);
  const r = await fetch(`${s.base}/api/claims/123/withdraw`, { method: 'POST', headers: { Origin: 'https://evil.example' } });
  assert.equal(r.status, 403);
  assert.equal(s.seen, undefined);
});

test('portal survives a client aborting mid-upload', async t => {
  const s = await startPair(t);
  const req = http.request({ port: s.port, path: '/api/claims/123/withdraw', method: 'POST', headers: { 'Content-Length': '100' } });
  req.on('error', () => {});
  req.write('partial');
  await new Promise(r => setTimeout(r, 50));
  req.destroy();
  await new Promise(r => setTimeout(r, 50));
  const r = await fetch(`${s.base}/api/claims`);
  assert.equal(r.status, 200);
});
