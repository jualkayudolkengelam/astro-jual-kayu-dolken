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
const MODEL =
  process.env.AI_MODEL || (PROVIDER === 'anthropic' ? 'claude-3-5-haiku-latest' : 'gpt-4o-mini');

const ATURAN = `
KAMU PENULIS KONTEN TOKO "Jual Kayu Dolken Gelam" (pemilik: Amirudin Abdul Karim).
ATURAN MUTLAK:
1. Bahasa Indonesia natural, hangat, gaya penjual berpengalaman. Bukan robotik.
2. DILARANG menulis kata: "gudang", "Serang", "Banten" di teks publik apa pun
   (pelanggan akan merasa jauh & tak jadi menelepon). Boleh sebut nama kota targetnya.
3. Wajib menambah NILAI UNIK BARU (sudut pandang berbeda dari konten lama):
   musim/curah hujan, jenis proyek, tips pemula, kesalahan umum, dsb.
4. DILARANG sekadar mengganti kata tanpa substansi baru.
5. Jawab HANYA JSON valid — tanpa penjelasan, tanpa blok kode.`;

function promptUntuk(file, jenis, lama) {
  const data = JSON.parse(readFileSync(file, 'utf8'));
  const isTutorial = file.includes('/tutorial/');
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

async function panggilLLM(prompt) {
  if (PROVIDER === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
    const json = await res.json();
    return json.content[0].text;
  }
  // default: kompatibel OpenAI (OpenAI, OpenRouter, Groq, dll.)
  const base = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { authorization: `Bearer ${KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.choices[0].message.content;
}

function validasi(teks, isTutorial) {
  const mulai = teks.indexOf('{');
  const akhir = teks.lastIndexOf('}');
  const obj = JSON.parse(teks.slice(mulai, akhir + 1));
  if (isTutorial) return obj;
  if (typeof obj.intro !== 'string' || obj.intro.length < 120) throw new Error('intro terlalu pendek');
  for (const kata of ['gudang', 'Serang', 'Banten']) {
    if (obj.intro.includes(kata)) throw new Error(`kata terlarang di intro: ${kata}`);
  }
  if (!Array.isArray(obj.faq) || obj.faq.length < 2 || obj.faq.length > 4) throw new Error('faq jumlah salah');
  for (const f of obj.faq) {
    if (typeof f.q !== 'string' || typeof f.a !== 'string' || !f.q || !f.a) throw new Error('faq tidak valid');
  }
  return obj;
}

let sukses = 0;
for (const tugas of plan) {
  const isTutorial = tugas.file.includes('/tutorial/');
  const lama = readFileSync(tugas.file, 'utf8');
  let hasil = null;
  for (let coba = 1; coba <= 2 && !hasil; coba++) {
    try {
      const teks = await panggilLLM(promptUntuk(tugas.file, tugas.jenis, lama));
      hasil = validasi(teks, isTutorial);
    } catch (e) {
      console.warn(`Percobaan ${coba} gagal utk ${tugas.file}: ${e.message}`);
      if (coba === 2) process.exit(1); // guardrail: gagal = run merah, jangan diam-diam
    }
  }
  writeFileSync(tugas.file, JSON.stringify(hasil, null, 2) + '\n');
  sukses++;
  console.log(`✔ ${tugas.file} (${tugas.jenis})`);
}
console.log(`Selesai: ${sukses}/${plan.length} konten diperbarui.`);
