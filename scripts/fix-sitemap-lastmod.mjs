/**
 * Pasca-build: pastikan <lastmod> di sitemap memakai string git asli
 * (ISO 8601 +07:00, tanpa milidetik) agar konsisten dengan JSON-LD
 * dan tanggal terlihat di halaman.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { homeDates, cityDates } from '../src/lib/dates.js';

const FILE = 'dist/sitemap-0.xml';
const SITE = process.env.PUBLIC_SITE_URL ?? 'http://kayudolken.lan';

let xml = readFileSync(FILE, 'utf8');
xml = xml.replace(/<url>(.*?)<\/url>/gs, (block, inner) => {
  const loc = inner.match(/<loc>(.*?)<\/loc>/)?.[1] ?? '';
  const path = new URL(loc).pathname;
  const lastmod = (path === '/' ? homeDates : cityDates).updated;
  const newInner = inner.includes('<lastmod>')
    ? inner.replace(/<lastmod>.*?<\/lastmod>/, `<lastmod>${lastmod}</lastmod>`)
    : `${inner}<lastmod>${lastmod}</lastmod>`;
  return `<url>${newInner}</url>`;
});
writeFileSync(FILE, xml);
console.log(`sitemap-0.xml: lastmod disamakan dgn sumber git (${cityDates.updated})`);
