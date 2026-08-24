import { execSync } from 'node:child_process';

/**
 * Utilitas tanggal halaman dari riwayat git.
 * - created = commit pertama file (diff-filter=A)
 * - updated = commit terakhir yang menyentuh file
 * Output schema: ISO 8601 zona WIB (+07:00) apa pun timezone server.
 */

const memo = new Map();

/** Tanggal commit HEAD — dipakai bila riwayat git file tak tersedia (mis. shallow clone). */
function tanggalHead() {
  if (!memo.has('__head__')) {
    try {
      const out = execSync('git show -s --format=%aI HEAD', {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      const ms = Date.parse(out);
      memo.set('__head__', Number.isNaN(ms) ? Date.now() : ms);
    } catch {
      memo.set('__head__', Date.now());
    }
  }
  return memo.get('__head__');
}

function toWibIso(epochMs) {
  const shifted = new Date(epochMs + 7 * 3600 * 1000);
  return shifted.toISOString().replace(/\.\d{3}Z$/, '+07:00');
}

function gitEpoch(file, mode) {
  try {
    // NOTE: "-n1 --reverse" di git menghasilkan commit TERBARU (bukan terlama),
    // maka untuk 'first' ambil baris terakhir dari seluruh log.
    const args =
      mode === 'first'
        ? '--follow --diff-filter=A --reverse --format=%aI'
        : '-1 --format=%aI';
    const out = execSync(`git log ${args} -- "${file}"`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const line = mode === 'first' ? out.split('\n').pop() : out;
    const ms = Date.parse(line ?? '');
    return Number.isNaN(ms) ? null : ms;
  } catch {
    return null;
  }
}

/**
 * @param {string} relPath path relatif dari root repo, mis. "src/pages/index.astro"
 * @returns {{ created: string, updated: string }}
 */
export function pageDates(relPath) {
  if (memo.has(relPath)) return memo.get(relPath);

  const c = gitEpoch(relPath, 'first');
  const u = gitEpoch(relPath, 'last');
  const cadangan = tanggalHead();
  const result = {
    created: toWibIso(c ?? cadangan),
    updated: toWibIso(u ?? cadangan),
  };
  memo.set(relPath, result);
  return result;
}

const BULAN_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

/** Format tampilan Indonesia: "24 Agustus 2026" */
export function formatTanggalId(iso) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return `${d} ${BULAN_ID[m - 1]} ${y}`;
}

export const homeDates = pageDates('src/pages/index.astro');
export const terdekatDates = pageDates('src/pages/jual-kayu-dolken-terdekat.astro');

/** Tanggal halaman kota = tanggal file kontennya sendiri (bisa beda tiap kota). */
export function cityPageDates(slug) {
  return pageDates(`src/data/konten-kota/${slug}.json`);
}
