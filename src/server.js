import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { claimsCsv, csvFilename } from './csv.js';

const root = path.resolve('public');
const api = process.env.CLAIMS_API ?? 'http://localhost:8080';

http.createServer(async (req, res) => {
  if (req.url === '/claims.csv') {
    const r = await fetch(api + '/api/claims', { headers: { 'X-User-Id': 'cust-ana', 'X-User-Role': 'CUSTOMER' } });
    const claims = await r.json();
    res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${csvFilename()}"` });
    res.end(claimsCsv(claims));
    return;
  }
  if (req.url.startsWith('/api/')) {
    const r = await fetch(api + req.url, { headers: { 'X-User-Id': 'cust-ana', 'X-User-Role': 'CUSTOMER' } });
    res.writeHead(r.status, { 'Content-Type': r.headers.get('content-type') ?? 'application/json' });
    res.end(Buffer.from(await r.arrayBuffer()));
    return;
  }
  const file = path.join(root, req.url === '/' ? 'index.html' : req.url);
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200); fs.createReadStream(file).pipe(res);
}).listen(3000, () => console.log('claims-portal on http://localhost:3000'));
