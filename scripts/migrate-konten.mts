/**
 * A1: Pecah konten kota menjadi file individual src/data/konten-kota/{slug}.json
 * Pola intro mengikuti distribusi yang sedang live (idx % 3).
 * Jalankan: npx tsx scripts/migrate-konten.mts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cities } from '../src/data/cities';

const OUT_DIR = 'src/data/konten-kota';
mkdirSync(OUT_DIR, { recursive: true });

const introVariants = (city: { name: string; region: string }) => [
  `Mencari jual kayu dolken terdekat di ${city.name}? Kami melayani pengiriman ke ${city.name} dan sekitarnya. Kayu berasal dari hutan Sumatera dengan legalitas resmi dinas kehutanan — kuat, lurus, dan tahan bertahun-tahun di dalam tanah.`,
  `Butuh kayu dolken murah di ${city.name}? Telepon saja — harga paling bersaing dan bisa bayar di tempat untuk area layanan kami. Sudah banyak kontraktor dan pemilik rumah di wilayah ${city.region} yang menjadi pelanggan tetap kami.`,
  `Pesan kayu dolken gelam untuk pondasi cerucuk proyek Anda di ${city.name} sekarang. Stok selalu tersedia dalam empat ukuran diameter — jumlah kecil maupun partai besar, tim kami siap mengatur jadwal kiriman ke lokasi Anda.`,
];

let made = 0;
for (const [idx, city] of cities.entries()) {
  const isSulawesi = city.region.startsWith('Sulawesi');
  const faq = [
    {
      q: `Apakah kayu dolken bisa dikirim ke ${city.name}?`,
      a: `Bisa. ${city.name} termasuk area layanan rutin kami di ${city.region}. Cukup telepon atau WhatsApp, sebutkan jumlah dan diameternya — jadwal pengiriman langsung kami atur.`,
    },
    {
      q: `Bagaimana cara memesan kayu dolken untuk proyek di ${city.name}?`,
      a: `Telepon nomor yang tertera di halaman ini atau kirim WhatsApp. Sebutkan panjang (standar 4 meter), diameter yang dibutuhkan, dan titik lokasi — penawaran diberikan saat itu juga.`,
    },
    ...(isSulawesi
      ? [
          {
            q: `Berapa ongkos kirim kayu dolken ke ${city.name}?`,
            a: `Untuk wilayah ${city.region}, ongkir paling pas dibicarakan langsung sesuai jumlah batang dan rute — hubungi kami untuk penawaran terbaik.`,
          },
        ]
      : []),
  ];
  const payload = { intro: introVariants(city)[idx % 3]!, faq };
  writeFileSync(
    join(OUT_DIR, `${city.slug}.json`),
    JSON.stringify(payload, null, 2) + '\n',
  );
  made++;
}
console.log(`OK: ${made} file konten kota dibuat di ${OUT_DIR}/`);
