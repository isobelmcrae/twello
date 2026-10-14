import { cp, mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
const source = process.cwd();
const destination = process.argv[2] || await mkdtemp(join(tmpdir(), 'twello-preview-'));
const excluded = new Set(['node_modules', '.next', '.audit', 'artifacts']);
await cp(source, destination, {
  recursive: true,
  filter: path => {
    const parts = relative(source, path).split('/');
    return !parts.some(part => excluded.has(part) || (part.startsWith('.env') && part !== '.env.example') || part.endsWith('.tsbuildinfo'));
  },
});
await mkdir(destination, { recursive: true });
await writeFile(join(destination, '.env.local'), `BETTER_AUTH_SECRET=${randomBytes(48).toString('base64url')}\nZENITH_PREVIEW=true\nPGHOST=db\nPGPORT=5432\nPGUSER=twello\nPGDATABASE=twello\nSMTP_HOST=mail\nSMTP_PORT=1025\nSMTP_FROM="Twello <hello@twello.local>"\nSMTP_SECURE=false\nPREVIEW_EMAIL_INBOX=true\n`, { mode: 0o600 });
process.stdout.write(`${destination}\n`);
