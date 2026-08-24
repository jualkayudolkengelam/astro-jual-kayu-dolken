import { execSync } from 'node:child_process';

/**
 * Utilitas tanggal halaman dari riwayat git.
 * - created = commit pertama file (diff-filter=A)
 * - updated = commit terakhir yang menyentuh file
 * Output schema: ISO 8601 zona WIB (+07:00) apa pun timezone server.
 */

const FALLBACK_ISO = '2026-08-24T00:00:00+07:00';
const memo = new Map();

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
  const result = {
    created: c ? toWibIso(c) : FALLBACK_ISO,
    updated: u ? toWibIso(u) : FALLBACK_ISO,
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
