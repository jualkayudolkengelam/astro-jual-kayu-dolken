# PLAN.md — Rencana Kerja Situs Jual Kayu Dolken Gelam
> Diperbarui 24 Agu 2026 · Repo publik astro-jual-dolken · Live: Vercel (auto-deploy dari push)

## Keputusan Desain (hasil diskusi 24 Agu 2026)
- Scheduler = GitHub Actions (BUKAN cron server) — gratis, tahan reboot,
  riwayat audit di web, tombol uji manual
- Kunci LLM: Secret repo bernama AI_API_KEY (dipasang pemilik situs sendiri)
- Tanggal halaman = tanggal git file konten masing-masing item (jujur & akurat)
- Zona waktu: Actions memakai UTC; jendela 08–20 WIB ≡ cron 3 1-13 * * *
  (delay jitter bawaan Actions + keputusan acak script = pola natural)
- SEMUA jumlah bersifat DINAMIS — scheduler mengikuti daftar file yang ada,
  bukan angka tetap (kota bisa bertambah kapan saja)

## Fakta Pendukung (hasil investigasi 24 Agu 2026)
- Saat ini terdaftar 84 kota di src/data/cities.ts (67 Jawa+Banten, 17 Sulawesi);
  penambahan kota cukup edit cities.ts + buat file kontennya
- Zona waktu server aaPanel: Asia/Jakarta; server TIDAK dipakai untuk scheduler
- Belum ada crontab user/root — tidak ada konflik apa pun
- opencode run tersedia lokal, tapi eksekusi harian resmi = Actions runner
- Kredensial push GitHub tertanam di remote origin (dipasang pemilik situs)

## A. Fondasi Konten Per-Kota ✅ (24 Agu)
1. [x] Pecah konten kota → src/data/konten-kota/{slug}.json
2. [x] dates.js & sitemap lastmod per-file git

## A+. Konteks Lokal Bertumbuh ✅ desain disepakati 24 Agu
- Field baru per kota: "konteks": [{topik, teks}] — maks 8 blok/kota
- 8 topik bergilir: ekonomi · wisata · pendidikan · infrastruktur ·
  perumahan · proyek besar · iklim · akses jalan
- Tiap kunjungan bot tambah SATU blok (2–3 kalimat); penuh 8 →
  segarkan blok terlama (siklus tak berujung = halaman selalu muda)
- Pagar relevansi: tiap blok wajib nyambung ke bangunan/konstruksi;
  DILARANG statistik angka; hanya fakta umum yang terkenal luas
- Render: seksi "Catatan Kota {Nama}" sebelum FAQ

## B. Mesin Harian GitHub Actions "Natural"
1. [ ] scripts/putuskan.mjs — otak keputusan:
       skip hari ini ±12% · pilih 1–3 item TERLAMA lintas jenis
       (kota & tutorial digabung satu antrean umur) · output slug+aksi
2. [ ] scripts/generate.mjs — tulis konten via API LLM (Secret AI_API_KEY).
       ATURAN TERKUNCI: bahasa Indonesia natural gaya penjual · dilarang kata
       'gudang/Serang/Banten' di copy publik · wajib nilai unik baru —
       DILARANG bump tanggal tanpa isi · JSON valid sesuai skema file tujuan
3. [ ] .github/workflows/konten-harian.yml:
       schedule jam-an 01–13 UTC + workflow_dispatch · fetch-depth: 0 ·
       permissions contents:write · concurrency group · npm ci → putuskan
       → generate → npm run build HARUS lulus → commit "Konten harian: …"
       sebagai bot-dolken → push → Vercel deploy otomatis
4. [ ] Uji perdana manual (Run workflow) setelah Secret terpasang,
       pantau 3–5 run terjadwal sebelum dinyatakan stabil

## C. Konten Tutorial Kayu Dolken (baru)
1. [ ] Route /tutorial/[slug].astro + indeks /tutorial/ (kartu artikel,
       tanggal dari git file, JSON-LD Article)
2. [ ] Seed artikel awal (dibuat manual berkualitas, bukan hasil bot):
       - Cara Memasang Pondasi Cerucuk Kayu Dolken yang Benar
       - Dolken Gelam vs Dolken Putih: Mana yang Cocok untuk Anda?
       - Tips Memilih Diameter Dolken (Rumah, Pagar, Jembatan, Gazebo)
       - Kayu Dolken vs Pondasi Beton: Perbandingan Jujur Biaya & Umur
       - Cara Menghitung Kebutuhan Dolken untuk Proyek Anda
       - Merawat Kayu Dolken agar Awet Puluhan Tahun
3. [ ] Daftar topik cadangan (backlog-topik.json) untuk artikel baru bot
4. [ ] Internal linking: tutorial → halaman induk Terdekat → kota;
       kota → tutorial terkait (blok "Baca juga")

## D. Menyusul (backlog)
- [ ] Verifikasi Search Console + submit sitemap-index.xml (menunggu domain)
- [ ] Set SITE_URL=https://domain… saat domain produksi terpasang
- [ ] Foto dokumentasi per kota ditambah bertahap lewat siklus yang sama
- [ ] Mirror lokal aaPanel: git pull manual bila diperlukan

## Urutan Eksekusi
A1 → A2 → B1 → B2 → B3 → build & verifikasi lokal → commit+push →
**pemilik pasang Secret AI_API_KEY** → uji Run workflow manual → pantau.
Konten tutorial (C) menyusul setelah mesin harian stabil.
