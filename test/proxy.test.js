import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { Readable } from 'node:stream';
import { toUpstreamInit, responseHeaders, proxyRequest } from '../src/proxy.js';

async function listen(t, handler) {
  const server = http.createServer(handler);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
    server.closeAllConnections();
  }));
  return `http://127.0.0.1:${server.address().port}`;
}

test('GET and HEAD preserve the method and fixed customer identity without a body', () => {
  for (const method of ['GET', 'HEAD']) {
    const init = toUpstreamInit({ method, headers: {} });
    assert.equal(init.method, method);
    assert.equal(init.body, undefined);
    assert.deepEqual(init.headers, { 'X-User-Id': 'cust-ana', 'X-User-Role': 'CUSTOMER' });
  }
});

test('POST streams the original body and allows only content headers from the client', () => {
  const req = Readable.from(['upload']);
  req.method = 'POST';
  req.headers = {
    'content-type': 'multipart/form-data; boundary=test', 'content-length': '6',
    'x-user-id': 'attacker', 'x-user-role': 'ADJUSTER', 'x-user-name': 'spoofed',
    authorization: 'Bearer spoofed', cookie: 'identity=spoofed',
  };
  const init = toUpstreamInit(req);
  assert.equal(init.method, 'POST');
  assert.equal(init.body, req);
  assert.equal(init.duplex, 'half');
  assert.deepEqual(init.headers, {
    'X-User-Id': 'cust-ana', 'X-User-Role': 'CUSTOMER',
    'content-type': req.headers['content-type'], 'content-length': '6',
  });
});

test('response headers preserve download metadata and the existing JSON default', () => {
  assert.deepEqual(responseHeaders(new Response(null)), { 'Content-Type': 'application/json' });
  assert.deepEqual(responseHeaders(new Response(null, { headers: {
    'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="receipt.pdf"',
    'X-Upstream-Private': 'hidden',
  } })), {
    'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="receipt.pdf"',
  });
});

test('proxy forwards multipart bytes, URL, method and fixed identity over HTTP', async t => {
  let received;
  const api = await listen(t, async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    received = { method: req.method, url: req.url, headers: req.headers, body: Buffer.concat(chunks) };
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end('{"id":"attachment-1"}');
  });
  const portal = await listen(t, (req, res) => proxyRequest(req, res, api));
  const body = Buffer.from('--test\r\nContent-Disposition: form-data; name="file"; filename="a.pdf"\r\n\r\n%PDF-\x00\xff\r\n--test--\r\n', 'latin1');
  const response = await fetch(`${portal}/api/claims/1/attachments?source=portal`, {
    method: 'POST', body, headers: {
      'Content-Type': 'multipart/form-data; boundary=test',
      'X-User-Id': 'attacker', 'X-User-Role': 'ADJUSTER', 'X-User-Name': 'spoofed',
    },
  });
  assert.equal(response.status, 201);
  assert.equal(response.headers.get('content-type'), 'application/json');
  assert.deepEqual(await response.json(), { id: 'attachment-1' });
  assert.equal(received.method, 'POST');
  assert.equal(received.url, '/api/claims/1/attachments?source=portal');
  assert.deepEqual(received.body, body);
  assert.equal(received.headers['content-type'], 'multipart/form-data; boundary=test');
  assert.equal(received.headers['content-length'], String(body.length));
  assert.equal(received.headers['x-user-id'], 'cust-ana');
  assert.equal(received.headers['x-user-role'], 'CUSTOMER');
  assert.equal(received.headers['x-user-name'], undefined);
});

test('proxy downloads preserve status, bytes, Content-Type and Content-Disposition', async t => {
  const bytes = Buffer.from([0, 255, 37, 80, 68, 70]);
  const api = await listen(t, (req, res) => {
    assert.equal(req.method, 'GET');
    res.writeHead(200, {
      'Content-Type': 'application/pdf', 'Content-Disposition': "attachment; filename*=UTF-8''receipt.pdf",
    });
    res.end(bytes);
  });
  const portal = await listen(t, (req, res) => proxyRequest(req, res, api));
  const response = await fetch(`${portal}/api/claims/1/attachments/1`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'application/pdf');
  assert.equal(response.headers.get('content-disposition'), "attachment; filename*=UTF-8''receipt.pdf");
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes);
});

test('proxy handles empty POST bodies and empty upstream responses', async t => {
  const api = await listen(t, async (req, res) => {
    let size = 0;
    for await (const chunk of req) size += chunk.length;
    assert.equal(req.method, 'POST');
    assert.equal(size, 0);
    res.writeHead(204);
    res.end();
  });
  const portal = await listen(t, (req, res) => proxyRequest(req, res, api));
  const response = await fetch(`${portal}/api/claims/1/attachments`, { method: 'POST' });
  assert.equal(response.status, 204);
  assert.equal(await response.text(), '');
});

test('proxy preserves upstream error status, content type and body', async t => {
  const api = await listen(t, (req, res) => {
    res.writeHead(415, { 'Content-Type': 'application/problem+json' });
    res.end('{"detail":"Unsupported file type"}');
  });
  const portal = await listen(t, (req, res) => proxyRequest(req, res, api));
  const response = await fetch(`${portal}/api/claims/1/attachments`);
  assert.equal(response.status, 415);
  assert.equal(response.headers.get('content-type'), 'application/problem+json');
  assert.deepEqual(await response.json(), { detail: 'Unsupported file type' });
});

test('proxy returns 502 when the upstream connection fails', async t => {
  const api = await listen(t, req => req.socket.destroy());
  const portal = await listen(t, (req, res) => proxyRequest(req, res, api));
  const response = await fetch(`${portal}/api/claims`);
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { error: 'Upstream service unavailable' });
});
