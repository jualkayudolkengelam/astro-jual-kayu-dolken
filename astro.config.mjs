// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { homeDates, terdekatDates, cityPageDates } from './src/lib/dates.js';
import { SITE_URL } from './src/lib/site-url.js';

// Pemetaan lastmod per halaman dari sumber git.
function lastmodFor(pathname) {
  if (pathname === '/') return homeDates.updated;
  if (pathname === '/jual-kayu-dolken-terdekat/') return terdekatDates.updated;
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
