/**
 * URL situs tunggal sumber untuk canonical, JSON-LD, sitemap, robots.txt.
 *
 * Prioritas:
 *  1. SITE_URL                        → set manual (domain produksi/beli, mis. https://example.com)
 *  2. VERCEL_PROJECT_PRODUCTION_URL   → otomatis dari Vercel (mis. project.vercel.app)
 *  3. Fallback lokal aaPanel          → http://192.168.18.17:8088
 */
export const SITE_URL =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://192.168.18.17:8088');
