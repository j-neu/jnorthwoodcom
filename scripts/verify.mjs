import { readFileSync, existsSync } from 'node:fs';

const file = 'dist/index.html';
if (!existsSync(file)) {
  console.error('dist/index.html not found — run npm run build first.');
  process.exit(1);
}

const html = readFileSync(file, 'utf8');
const required = [
  'Jonathan Northwood',
  'Cognitive Dismantling',
  'procrastitype.jnorthwood.com',
  'cognitivedismantling.com',
  'Cognitive Construction',
  'info@jnorthwood.com',
];
const missing = required.filter((s) => !html.includes(s));
if (missing.length) {
  console.error('Missing content in built HTML:', missing.join(', '));
  process.exit(1);
}
console.log('Built HTML contains all required content.');
