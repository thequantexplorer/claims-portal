import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

export function toUpstreamInit(req) {
  const headers = { 'X-User-Id': 'cust-ana', 'X-User-Role': 'CUSTOMER' };
  for (const name of ['content-type', 'content-length']) {
    if (req.headers[name] !== undefined) headers[name] = req.headers[name];
  }
  return {
    method: req.method,
    headers,
    ...(req.method !== 'GET' && req.method !== 'HEAD' ? { body: req } : {}),
    duplex: 'half',
  };
}

export function responseHeaders(upstream) {
  const headers = { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' };
  const disposition = upstream.headers.get('content-disposition');
  if (disposition !== null) headers['Content-Disposition'] = disposition;
  return headers;
}

export async function proxyRequest(req, res, api) {
  try {
    const upstream = await fetch(api + req.url, toUpstreamInit(req));
    res.writeHead(upstream.status, responseHeaders(upstream));
    if (upstream.body === null) res.end();
    else await pipeline(Readable.fromWeb(upstream.body), res);
  } catch {
    if (res.headersSent) res.destroy();
    else {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Upstream service unavailable' }));
    }
  }
}
