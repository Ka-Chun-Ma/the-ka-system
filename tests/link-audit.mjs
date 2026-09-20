import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name.startsWith('package-') || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(root);

const failures = [];
const htmlByFile = new Map(htmlFiles.map(file => [file, fs.readFileSync(file, 'utf8')]));
const publicHosts = new Set(['github.com', 'www.linkedin.com']);

for (const [file, html] of htmlByFile) {
  const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]));
  for (const match of html.matchAll(/href=["']([^"']+)["']/g)) {
    const href = match[1];
    if (href === '#' || href.startsWith('javascript:')) failures.push(`${file}: meaningless href ${href}`);
    if (/^https?:\/\//.test(href)) {
      const url = new URL(href);
      if (url.hostname === 'github.com' && url.pathname === '/') failures.push(`${file}: generic GitHub URL`);
      if (url.hostname === 'www.linkedin.com' && url.pathname === '/') failures.push(`${file}: generic LinkedIn URL`);
      continue;
    }
    const [target, hash] = href.split('#');
    if (!target && hash && !ids.has(hash)) failures.push(`${file}: missing same-page target #${hash}`);
    if (target) {
      const targetPath = target.endsWith('/') ? path.join(path.dirname(file), target, 'index.html') : path.join(path.dirname(file), target);
      if (!fs.existsSync(targetPath)) failures.push(`${file}: missing route ${href}`);
      else if (hash) {
        const targetHtml = fs.readFileSync(targetPath, 'utf8');
        const targetIds = new Set([...targetHtml.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]));
        if (!targetIds.has(hash)) failures.push(`${file}: missing target ${href}`);
      }
    }
  }
}

const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const homepage = htmlByFile.get(path.join(root, 'index.html'));
for (const match of homepage.matchAll(/data-branch="([^"]+)"/g)) {
  if (!new RegExp(`${match[1]}:\\s*\\{`).test(script)) failures.push(`index.html: button branch has no mapping: ${match[1]}`);
}

if (failures.length) {
  console.error(`LINK_AUDIT_FAIL (${failures.length})`);
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`LINK_AUDIT_PASS: ${htmlFiles.length} HTML pages, internal routes, anchors and branch buttons checked.`);
