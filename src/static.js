import fs from 'node:fs';
import path from 'node:path';

export function staticPath(root, url) {
  const { pathname } = new URL(url, 'http://localhost');
  const realRoot = fs.realpathSync(root);
  let file;
  try {
    file = fs.realpathSync(path.join(root, pathname === '/' ? 'index.html' : pathname));
  } catch {
    return null;
  }
  return file.startsWith(realRoot + path.sep) && fs.statSync(file).isFile() ? file : null;
}
