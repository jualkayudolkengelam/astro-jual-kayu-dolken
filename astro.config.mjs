// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { homeDates, cityDates } from './src/lib/dates.js';
import { SITE_URL } from './src/lib/site-url.js';

export default defineConfig({
  site: SITE_URL,
  integrations: [
    sitemap({
      serialize(item) {
        // lastmod dari git: beranda & halaman kota punya tanggal masing-masing.
        const isHome = new URL(item.url).pathname === '/';
        return { ...item, lastmod: (isHome ? homeDates : cityDates).updated };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
