// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { homeDates, terdekatDates, hargaPerBatangDates, cityPageDates } from './src/lib/dates.js';

// Muat .env eksplisit utk config file — baca LANGSUNG (bukan via import SITE_URL,
// karena import ES module di-hoist & jalan sebelum kode ini dieksekusi).
function resolveSiteUrl() {
  const env = loadEnv('production', process.cwd(), '');
  const explicit = env.SITE_URL || process.env.SITE_URL;
  if (explicit) return explicit;
  if (process.env.VERCEL) return 'https://www.jualdolkenkayu.com';
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return 'http://192.168.18.17:8088';
}

const SITE_URL = resolveSiteUrl();

// Pemetaan lastmod per halaman dari sumber git.
function lastmodFor(pathname) {
  if (pathname === '/') return homeDates.updated;
  if (pathname === '/jual-kayu-dolken-terdekat/') return terdekatDates.updated;
  if (pathname === '/harga-kayu-dolken-per-batang/') return hargaPerBatangDates.updated;
  const m = pathname.match(/^\/kayu-dolken-(.+?)\/$/);
  if (m) return cityPageDates(decodeURIComponent(m[1])).updated;
  return homeDates.updated;
}

export default defineConfig({
  site: SITE_URL,
  integrations: [
    sitemap({
      serialize(item) {
        return { ...item, lastmod: lastmodFor(new URL(item.url).pathname) };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});


