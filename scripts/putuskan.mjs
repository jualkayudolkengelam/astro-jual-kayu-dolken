/**
 * B1 — Otak keputusan scheduler harian (natural, tanpa pola mesin).
 * Output:
 *   - .scheduler-plan.json   : daftar tugas utk scripts/generate.mjs
 *   - .scheduler-plan.txt    : ringkasan manusia utk pesan commit
 *   - GITHUB_OUTPUT tasks=N  : dibaca workflow
 */
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { TOPIK_LOKAL, MAKS_BLOK } from './topik.mjs';

const rnd = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rnd(arr.length)];

// --- 1. Kumpulkan semua file konten yang bisa diperbarui ---
function listDir(dir) {
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => `${dir}/${f}`) : [];
}
const files = [...listDir('src/data/konten-kota'), ...listDir('src/content/tutorial')];
if (files.length === 0) {
  console.error('Tidak ada file konten sama sekali.');
  process.exit(1);
}

// --- 2. Umur tiap file dari git (detik epoch commit terakhir; belum pernah = 0 = terlama) ---
const age = new Map(files.map((f) => {
  let t = 0;
  try {
    t = parseInt(execSync(`git log -1 --format=%ct -- "${f}"`, { encoding: 'utf8' }).trim() || '0', 10);
  } catch { /* file baru belum dicommit */ }
  return [f, t];
}));

// --- 3. Keputusan natural hari ini ---
// Libur acak ±12%
if (Math.random() < 0.12) {
  console.log('Keputusan: hari ini LIBUR acak (pola natural).');
  console.log('tasks=0');
  process.exit(0);
}

// Jumlah item 1–3, rata-rata ≈ 2  (35% satu, 45% dua, 20% tiga)
const roll = Math.random();
const jumlah = roll < 0.35 ? 1 : roll < 0.8 ? 2 : 3;

// Pilih N file dengan commit TERLAMA
const target = [...age.entries()].sort((a, b) => a[1] - b[1]).slice(0, jumlah);

// Jenis update bergilir — untuk kota, diputuskan dari isi file:
//   konteks < 8 blok → 70% tambah topik yang belum ada; sisanya aksi klasik
//   konteks penuh    → 60% segarkan blok terlama (indeks 0), sisanya klasik
const AKSI_KOTA = ['tulis-ulang intro', 'tambah FAQ baru', 'perkaya paragraf lokal'];
const AKSI_TUTORIAL = ['perluas artikel', 'perbarui bagian usang'];

function aksiKota(file) {
  let kontens = [];
  try {
    kontens = JSON.parse(readFileSync(file, 'utf8')).konteks ?? [];
  } catch { /* file rusak? perlakukan kosong */ }
  const topikAda = new Set(kontens.map((b) => b.topik));

  if (kontens.length >= MAKS_BLOK) {
    return Math.random() < 0.6
      ? 'segarkan-konteks-terlama'
      : pick(AKSI_KOTA);
  }
  if (Math.random() < 0.7) {
    const sisa = TOPIK_LOKAL.map((t) => t.id).filter((id) => !topikAda.has(id));
    if (sisa.length > 0) return `tambah-konteks:${pick(sisa)}`;
    return 'segarkan-konteks-terlama';
  }
  return pick(AKSI_KOTA);
}

const tasks = target.map(([file]) => ({
  file,
  jenis: file.includes('/tutorial/')
    ? pick(AKSI_TUTORIAL)
    : aksiKota(file),
}));

// --- 4. Tulis rencana ---
mkdirSync('.github', { recursive: true });
writeFileSync('.scheduler-plan.json', JSON.stringify(tasks, null, 2));
const ringkas = tasks.map((t) => `${t.file} (${t.jenis})`).join(', ');
writeFileSync('.scheduler-plan.txt', ringkas);
console.log(`Keputusan: ${tasks.length} item -> ${ringkas}`);

// Untuk GITHUB_OUTPUT (lokal: abaikan)
if (process.env.GITHUB_OUTPUT) {
  writeFileSync(process.env.GITHUB_OUTPUT, `tasks=${tasks.length}\n`, { flag: 'a' });
} else {
  console.log(`tasks=${tasks.length}`);
}
