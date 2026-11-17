import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { proxyRequest } from './proxy.js';

const root = path.resolve('public');
const api = process.env.CLAIMS_API ?? 'http://localhost:8080';

http.createServer(async (req, res) => {
  if (req.url.startsWith('/api/')) {
    await proxyRequest(req, res, api);
    return;
  }
  const file = path.join(root, req.url === '/' ? 'index.html' : req.url);
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200); fs.createReadStream(file).pipe(res);
}).listen(3000, () => console.log('claims-portal on http://localhost:3000'));
