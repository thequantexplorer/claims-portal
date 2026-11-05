import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve('public');

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

export function createServer(api = process.env.CLAIMS_API ?? 'http://localhost:8080') {
  return http.createServer(async (req, res) => {
    if (req.url.startsWith('/api/')) {
      const headers = { 'X-User-Id': 'cust-ana', 'X-User-Role': 'CUSTOMER' };
      if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type'];
      const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await readBody(req);
      const r = await fetch(api + req.url, { method: req.method, headers, body });
      res.writeHead(r.status, { 'Content-Type': r.headers.get('content-type') ?? 'application/json' });
      res.end(Buffer.from(await r.arrayBuffer()));
      return;
    }
    const file = path.join(root, req.url === '/' ? 'index.html' : req.url);
    if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200); fs.createReadStream(file).pipe(res);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createServer().listen(3000, () => console.log('claims-portal on http://localhost:3000'));
}
