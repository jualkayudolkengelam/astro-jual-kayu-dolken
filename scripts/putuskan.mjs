/**
 * B1 — Otak keputusan scheduler harian (natural, tanpa pola mesin).
 * Output:
 *   - .scheduler-plan.json   : daftar tugas utk scripts/generate.mjs
 *   - .scheduler-plan.txt    : ringkasan manusia utk pesan commit
 *   - GITHUB_OUTPUT tasks=N  : dibaca workflow
 */
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

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

// Jenis update bergilir acak
const AKSI_KOTA = ['tulis-ulang intro', 'tambah FAQ baru', 'perkaya paragraf lokal'];
const AKSI_TUTORIAL = ['perluas artikel', 'perbarui bagian usang'];

const tasks = target.map(([file]) => ({
  file,
  jenis: file.includes('/tutorial/') ? pick(AKSI_TUTORIAL) : pick(AKSI_KOTA),
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
