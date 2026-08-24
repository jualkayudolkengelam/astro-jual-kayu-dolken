/**
 * B2 — Generator konten via API LLM.
 * Input : .scheduler-plan.json  [{ file, jenis }]
 * Env   : AI_API_KEY (wajib) · AI_PROVIDER (openai|anthropic, default openai)
 *         AI_MODEL (default gpt-4o-mini / claude-3-5-haiku-latest)
 *         AI_BASE_URL (opsional, utk OpenRouter/dll yang kompatibel OpenAI)
 */
import { readFileSync, writeFileSync } from 'node:fs';

const KEY = process.env.AI_API_KEY;
if (!KEY || KEY.trim() === '') {
  console.error(
    '❌ Secret AI_API_KEY belum terpasang di repo.\n' +
      '   Settings → Secrets and variables → Actions → New repository secret\n' +
      '   Nama: AI_API_KEY · Nilai: kunci API LLM Anda.',
  );
  process.exit(1);
}

const plan = JSON.parse(readFileSync('.scheduler-plan.json', 'utf8'));
const PROVIDER = process.env.AI_PROVIDER || 'openai';
// Bisa satu model atau beberapa dipisah koma → dicoba berurutan bila gagal/rate-limit.
const MODELS = (
  process.env.AI_MODEL ||
  (PROVIDER === 'anthropic' ? 'claude-3-5-haiku-latest' : 'gpt-4o-mini')
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ATURAN = `
KAMU PENULIS KONTEN TOKO "Jual Kayu Dolken Gelam" (pemilik: Amirudin Abdul Karim).
ATURAN MUTLAK:
1. Bahasa Indonesia natural, hangat, gaya penjual berpengalaman. Bukan robotik.
2. DILARANG menulis kata: "gudang", "Serang", "Banten" di teks publik apa pun
   (pelanggan akan merasa jauh & tak jadi menelepon). Boleh sebut nama kota targetnya.
3. Wajib menambah NILAI UNIK BARU (sudut pandang berbeda dari konten lama):
   musim/curah hujan, jenis proyek, tips pemula, kesalahan umum, dsb.
4. DILARANG sekadar mengganti kata tanpa substansi baru.
5. DILARANG MENGARANG klaim bisnis apa pun yang tidak ada di daftar FAKTA.
   Tidak boleh: lapisan/pelapis anti-jamur atau anti-rayap, jasa potong sesuai
   ukuran, cicilan/angsuran, garansi, jumlah tahun pengalaman, sertifikasi,
   kapasitas stok spesifik, atau fasilitas lain di luar fakta.
6. Ejaan bahasa Indonesia baku — periksa ulang, nol toleransi kata rusak/aneh.
7. Jawab HANYA JSON valid — tanpa penjelasan, tanpa blok kode.

FAKTA SATU-SATUNYA yang boleh disebut (jangan tambah apapun):
- Kayu gelam asli hutan Sumatera, legalitas resmi dinas kehutanan
- Sifat alami tahan air/busuk/jamur karena habitat aslinya rawa
- Diameter 4–12 cm, panjang standar 4 meter
- Harga mulai Rp15.000/batang
- Bayar di tempat / COD (barang tiba dulu, baru bayar)
- Gratis ongkos kirim Pulau Jawa; Sulawesi harga & ongkir dinego langsung
- Order perusahaan tersedia sistem invoice`;

function promptUntuk(file, jenis, lama) {
  const data = JSON.parse(readFileSync(file, 'utf8'));
  const isTutorial = file.includes('/tutorial/');

  // --- Tugas konteks lokal (tambah / segarkan) ---
  if (jenis.startsWith('tambah-konteks:') || jenis === 'segarkan-konteks-terlama') {
    const tambah = jenis.startsWith('tambah-konteks:');
    const topik = tambah ? jenis.split(':')[1] : (data.konteks?.[0]?.topik ?? 'ekonomi');
    const label = { ekonomi:'ekonomi', wisata:'wisata/pariwisata', pendidikan:'pendidikan',
      infrastruktur:'sarana & infrastruktur', perumahan:'perumahan & properti',
      proyek:'proyek konstruksi besar', iklim:'iklim & curah hujan', akses:'akses jalan/transportasi' }[topik] ?? topik;
    const kota = file.split('/').pop().replace('.json','').split('-').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
    const blokLama = tambah ? '(belum ada)' : JSON.stringify(data.konteks?.[0]);
    return `${ATURAN}

Tugas: tulis SATU blok kecil "${label}" untuk halaman kota **${kota}**.
Aturan khusus blok:
- WAJIB menyebut kata "${kota}" tepat satu kali — DILARANG menyebut nama kota lain
- Isi HARUS membahas topik ${label} saja (jangan melenceng ke topik lain)
- Tepat 2–3 kalimat, tanpa angka statistik apa pun (jumlah penduduk, jumlah sekolah, dsb. dilarang)
- Hanya fakta umum yang dikenal luas tentang ${kota} — DILARANG mengarang detail spesifik
- Kalimat terakhir WAJIB menghubungkan kondisi itu dengan kebutuhan bangunan/konstruksi/kayu dolken
${tambah ? '' : `\nBlok lama yang harus diganti isinya (sudut pandang baru):\n${blokLama}\n`}
Kembalikan JSON persis: {"teks":"isi blok"}`;
  }

  if (isTutorial) {
    return `${ATURAN}

Tugas: ${jenis} untuk artikel tutorial dengan slug "${file.split('/').pop()}".
Konten saat ini:\n${JSON.stringify(data)}

Kembalikan JSON dengan SKEMA PERSIS seperti konten saat ini (field sama, isi diperbarui/diperluas).`;
  }
  const kota = file.split('/').pop().replace('.json', '');
  return `${ATURAN}

Tugas untuk halaman kota "${kota}" (${jenis}).
Intro lama:\n"${data.intro}"
FAQ lama:\n${JSON.stringify(data.faq)}

Kembalikan JSON skema persis:
{"intro":"paragraf intro baru 2-4 kalimat menyebut ${kota} secara natural","faq":[{"q":"...","a":"..."}]}
Syarat FAQ: 2-4 item; minimal satu FAQ BENAR-BENAR BARU (tidak ada di daftar lama).`;
}

async function panggilSatu(model, prompt) {
  if (PROVIDER === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
    const json = await res.json();
    return json.content[0].text;
  }
  // default: kompatibel OpenAI (OpenRouter, OpenAI, Groq, dll.)
  const base = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { authorization: `Bearer ${KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.choices[0].message.content;
}

/**
 * Coba tiap model bergiliran; rate-limit (429) → tunggu lalu lanjut.
 * Kesalahan konfigurasi fatal (401 kunci salah / 402 saldo) langsung dilempar.
 */
async function panggilLLM(prompt) {
  let kesalahanTerakhir;
  for (const model of MODELS) {
    for (let coba = 1; coba <= 3; coba++) {
      try {
        return await panggilSatu(model, prompt);
      } catch (e) {
        kesalahanTerakhir = e;
        const pesan = String(e.message);
        if (/401|402/.test(pesan)) throw e; // kunci/saldo — percuma diulang
        console.warn(`⚠ ${model} percobaan ${coba}: ${pesan.slice(0, 140)}`);
        if (coba < 3) await sleep(20000 * coba); // 20s, 40s
      }
    }
  }
  throw kesalahanTerakhir;
}

// Klaim berbahaya yang TIDAK boleh muncul di konten mana pun (anti-halusinasi).
const KLAIM_TERLARANG =
  /(anti[-\s]?(jamur|rayap)|pelapis|lapisan|cicilan|angsur|garansi|\b\d+\s*(tahun|thn)\b|pengalaman\s+\d+|memotong|dipotong|sesuai\s+ukuran|custom)/i;

function validasi(teks, isTutorial, jenis = '', file = '') {
  const mulai = teks.indexOf('{');
  const akhir = teks.lastIndexOf('}');
  const obj = JSON.parse(teks.slice(mulai, akhir + 1));

  // Tugas blok konteks: hanya butuh "teks"
  if (jenis.startsWith('tambah-konteks:') || jenis === 'segarkan-konteks-terlama') {
    if (typeof obj.teks !== 'string') throw new Error('field teks hilang');
    const t = obj.teks;
    const kota = file
      ? file.split('/').pop().replace('.json', '').split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      : '';
    if (kota && !t.includes(kota)) throw new Error(`blok tidak menyebut "${kota}"`);
    if (t.length < 80 || t.length > 600) throw new Error(`panjang blok aneh: ${t.length}`);
    for (const kata of ['gudang', 'Serang', 'Banten']) {
      if (t.includes(kata)) throw new Error(`kata terlarang di blok: ${kata}`);
    }
    const klaim = KLAIM_TERLARANG.exec(t);
    if (klaim) throw new Error(`klaim terlarang di blok: "${klaim[0]}"`);
    const statistik = /\d{3,}/.exec(t);
    if (statistik) throw new Error(`angka statistik terlarang di blok: "${statistik[0]}"`);
    return obj;
  }

  if (isTutorial) return obj;
  if (typeof obj.intro !== 'string' || obj.intro.length < 120) throw new Error('intro terlalu pendek');
  for (const kata of ['gudang', 'Serang', 'Banten']) {
    if (obj.intro.includes(kata)) throw new Error(`kata terlarang di intro: ${kata}`);
  }
  const klaim = KLAIM_TERLARANG.exec(JSON.stringify(obj));
  if (klaim) throw new Error(`klaim terlarang terdeteksi: "${klaim[0]}"`);
  if (!Array.isArray(obj.faq) || obj.faq.length < 2 || obj.faq.length > 4) throw new Error('faq jumlah salah');
  for (const f of obj.faq) {
    if (typeof f.q !== 'string' || typeof f.a !== 'string' || !f.q || !f.a) throw new Error('faq tidak valid');
    const k = KLAIM_TERLARANG.exec(f.q + ' ' + f.a);
    if (k) throw new Error(`klaim terlarang di FAQ: "${k[0]}"`);
  }
  return obj;
}

let sukses = 0;
for (const tugas of plan) {
  const isTutorial = tugas.file.includes('/tutorial/');
  const jenis = tugas.jenis ?? '';
  const lama = readFileSync(tugas.file, 'utf8');
  let hasil = null;
  for (let coba = 1; coba <= 2 && !hasil; coba++) {
    try {
      const teks = await panggilLLM(promptUntuk(tugas.file, jenis, lama));
      hasil = validasi(teks, isTutorial, jenis, tugas.file);
    } catch (e) {
      console.warn(`Percobaan ${coba} gagal utk ${tugas.file}: ${String(e.message).slice(0, 160)}`);
      if (coba === 2) process.exit(1); // guardrail: gagal = run merah, jangan diam-diam
    }
  }

  // Gabungkan hasil sesuai jenis tugas
  const dataBaru = JSON.parse(lama);
  if (jenis.startsWith('tambah-konteks:')) {
    if ((dataBaru.konteks?.length ?? 0) >= 8) throw new Error('blok sudah penuh');
    dataBaru.konteks.push({ topik: jenis.split(':')[1], teks: hasil.teks });
  } else if (jenis === 'segarkan-konteks-terlama') {
    dataBaru.konteks[0].teks = hasil.teks;
    // pindahkan ke belakang agar urutan "terlama" bergilir
    dataBaru.konteks.push(dataBaru.konteks.shift());
  } else {
    writeFileSync(tugas.file, JSON.stringify(hasil, null, 2) + '\n');
    sukses++;
    console.log(`✔ ${tugas.file} (${jenis})`);
    continue;
  }
  writeFileSync(tugas.file, JSON.stringify(dataBaru, null, 2) + '\n');
  sukses++;
  console.log(`✔ ${tugas.file} (${jenis})`);
}
console.log(`Selesai: ${sukses}/${plan.length} konten diperbarui.`);
