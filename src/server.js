import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const docsRoot = path.resolve(process.env.CLAIM_DOCS_DIR ?? 'claim-docs');
const api = process.env.CLAIMS_API ?? 'http://localhost:8080';

http.createServer(async (req, res) => {
  if (req.url.startsWith('/api/')) {
    const r = await fetch(api + req.url, { headers: { 'X-User-Id': 'cust-ana', 'X-User-Role': 'CUSTOMER' } });
    res.writeHead(r.status, { 'Content-Type': r.headers.get('content-type') ?? 'application/json' });
    res.end(Buffer.from(await r.arrayBuffer()));
    return;
  }
  if (req.url.startsWith('/documents')) {
    const url = new URL(req.url, 'http://localhost');
    const claimId = url.searchParams.get('claim');
    const name = url.searchParams.get('file');
    if (!claimId || !name) { res.writeHead(400); res.end(); return; }
    const doc = path.join(docsRoot, claimId, name);
    if (!fs.existsSync(doc)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': contentType(doc), 'Content-Disposition': `inline; filename="${path.basename(doc)}"` });
    fs.createReadStream(doc).pipe(res);
    return;
  }
  const file = path.join(root, req.url === '/' ? 'index.html' : req.url);
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200); fs.createReadStream(file).pipe(res);
}).listen(3000, () => console.log('claims-portal on http://localhost:3000'));

function contentType(file) {
  return { '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg' }[path.extname(file)] ?? 'application/octet-stream';
}
