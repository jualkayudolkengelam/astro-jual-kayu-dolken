# Astro — Jual Kayu Dolken Gelam

Situs penjualan kayu dolken gelam (Serang, Banten). Dibangun dengan [Astro](https://astro.build) + Tailwind CSS v4.

- **67 halaman kota** untuk SEO lokal (`/kayu-dolken-bekasi/`, dst) digenerate otomatis dari data
- Sitemap + robots.txt + JSON-LD LocalBusiness
- Deploy: build statis murni → bisa di-hosting di mana saja

## Struktur Penting

| Path | Fungsi |
|---|---|
| `src/data/site.ts` | Kontak, harga produk, keunggulan, FAQ |
| `src/data/cities.ts` | Daftar kota layanan (tambah kota = tambah baris) |
| `src/assets/gallery/` | Foto produk/workshop — galeri terisi otomatis |
| `src/pages/kayu-dolken-[kota].astro` | Template halaman per kota |

## Perintah

```bash
npm install        # sekali
npm run dev        # development
npm run build      # produksi -> dist/
```

## Kontak Bisnis

Amirudin Abdul Karim · 0813-1140-0177 · 0878-0567-2256
