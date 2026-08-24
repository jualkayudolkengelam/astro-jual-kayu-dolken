# Jual Kayu Dolken Gelam — Murah, Bayar di Tempat

Kayu dolken (juga dikenal sebagai **kayu gelam** atau **kayu putih**) adalah kayu terbaik untuk
pondasi cerucuk dan konstruksi. Berasal dari hutan Sumatera dengan legalitas resmi dinas kehutanan.

**Kenapa kayu dolken kami?**
- Tahan busuk & anti jamur — terbukti awet di dalam tanah, bahkan di lahan gambut
- Tahan air & cuaca — habitat aslinya di rawa, sering dipakai material perahu
- Bayar di tempat (COD) — barang sampai dulu, baru bayar
- Gratis ongkos kirim Pulau Jawa — Sulawesi bisa dinegosiasikan langsung
- Harga termurah dengan kualitas terbaik

## Harga per Batang (panjang 4 meter)

| Diameter | Harga |
|---|---|
| 4 – 6 cm | Rp15.000 |
| 6 – 8 cm | Rp25.000 |
| 8 – 10 cm | Rp35.000 *(terlaris)* |
| 10 – 12 cm | Rp45.000 |

## Hubungi Kami

**Amirudin Abdul Karim**

Telepon / WhatsApp:

# 📞 0813-1140-0177
# 📞 0878-0567-2256
# 💬 https://wa.me/6281311400177

English speaker: 0818-60-8883

Order perusahaan (Persero)? Tersedia sistem invoice & penagihan.

## Alamat

- **Kantor:** Kompleks Bumi Agung Permai 1, Blok I3 No. 5 Unyur, Kota Serang, Banten 42191
- **Workshop:** Jl. Raya Banten KM 7, Kasunyatan, Kasemen, Kota Serang, Banten 42191

## Area Layanan

Seluruh kota besar **Pulau Jawa** (Banten, DKI Jakarta, Jawa Barat, Jawa Tengah, DIY, Jawa Timur)
dan kini melayani juga **Sulawesi** (Makassar, Palu, Kendari, dan sekitarnya).
Daftar lengkap 84+ kota ada di situs.

---

# Panduan Pengelolaan Situs (untuk Admin)

Situs ini dibangun dengan [Astro](https://astro.build) — hasilnya berupa file HTML statis,
bisa dibuka cepat dari mana saja. Anda tidak perlu jadi programmer untuk mengelolanya.

### Mengubah isi situs

Semua teks penting ada di dua file saja:

| Mau mengubah… | Edit file |
|---|---|
| Nomor telepon, alamat, harga produk | `src/data/site.ts` |
| Daftar kota layanan | `src/data/cities.ts` |
| Keterangan foto galeri | `src/data/gallery.ts` |

Setelah selesai edit, jalankan:

```bash
npm install     # hanya sekali di awal
npm run build   # membuat versi terbaru ke folder dist/
```

Lalu salin isi `dist/` ke folder publik server (`/www/wwwroot/kayudolken.lan/`) dan situs langsung terbarui.
Tanggal "Terakhir diperbarui" di halaman & sitemap otomatis ikut berganti sesuai waktu commit git terakhir.

### Menambah foto galeri

Letakkan file foto (jpg/png/webp) di `src/assets/gallery/` lalu tambahkan keterangannya di
`src/data/gallery.ts`. Untuk halaman kota, foto otomatis diambil dari `public/images/kota/<nama-kota>/`.

### Catatan teknis singkat

- Setiap kota punya halaman sendiri (`/kayu-dolken-bekasi/`, dst) agar mudah ditemukan di Google
- Sitemap & tanggal mengikuti standar Google (sudah lolos uji otomatis)
- Hosting saat ini: server aaPanel sendiri (`kayudolken.lan`, port 8088 via IP) — siap dipindah ke Vercel/domain produksi kapan saja karena outputnya HTML statis murni

---

© Jual Kayu Dolken Gelam — Amirudin Abdul Karim
