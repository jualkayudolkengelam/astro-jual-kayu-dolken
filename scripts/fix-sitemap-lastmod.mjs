/**
 * Pasca-build: pastikan <lastmod> di sitemap memakai string git asli
 * (ISO 8601 +07:00, tanpa milidetik) agar konsisten dengan JSON-LD
 * dan tanggal terlihat di halaman.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { homeDates, terdekatDates, cityPageDates } from '../src/lib/dates.js';
import { SITE_URL } from '../src/lib/site-url.js';

const FILE = 'dist/sitemap-0.xml';
const SITE = SITE_URL;

function lastmodFor(pathname) {
  if (pathname === '/') return homeDates.updated;
  if (pathname === '/jual-kayu-dolken-terdekat/') return terdekatDates.updated;
  const m = pathname.match(/^\/kayu-dolken-(.+?)\/$/);
  if (m) return cityPageDates(decodeURIComponent(m[1])).updated;
  return homeDates.updated;
}

let xml = readFileSync(FILE, 'utf8');
xml = xml.replace(/<url>(.*?)<\/url>/gs, (block, inner) => {
  const loc = inner.match(/<loc>(.*?)<\/loc>/)?.[1] ?? '';
  const path = new URL(loc).pathname;
  const lastmod = lastmodFor(path);
  const newInner = inner.includes('<lastmod>')
    ? inner.replace(/<lastmod>.*?<\/lastmod>/, `<lastmod>${lastmod}</lastmod>`)
    : `${inner}<lastmod>${lastmod}</lastmod>`;
  return `<url>${newInner}</url>`;
});
writeFileSync(FILE, xml);
console.log(`sitemap-0.xml: lastmod disamakan dgn sumber git (${homeDates.updated})`);
