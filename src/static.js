import path from 'node:path';

export function staticPath(root, url) {
  const { pathname } = new URL(url, 'http://localhost');
  const file = path.join(root, pathname === '/' ? 'index.html' : pathname);
  return file.startsWith(root + path.sep) ? file : null;
}
