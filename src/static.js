import fs from 'node:fs';
import path from 'node:path';

export function staticPath(root, url) {
  const { pathname } = new URL(url, 'http://localhost');
  try {
    const realRoot = fs.realpathSync(root);
    const file = fs.realpathSync(path.join(root, pathname === '/' ? 'index.html' : pathname));
    return file.startsWith(realRoot + path.sep) && fs.statSync(file).isFile() ? file : null;
  } catch {
    return null;
  }
}
