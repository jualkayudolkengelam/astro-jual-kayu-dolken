export interface GalleryCaption {
  alt: string;
  desc: string;
}

/**
 * Peta caption galeri homepage (6 foto terkurasi).
 * Kunci = nama file di src/assets/gallery/ (tanpa ekstensi).
 */
export const galleryCaptions: Record<string, GalleryCaption> = {
  'kayu-dolken-gelam-bongkar-muat-stok-kayu-01': {
    alt: 'Stok kayu dolken gelam ditata rapi di gudang',
    desc: 'Tumpukan batang kayu dolken gelam asal Sumatera menunggu jadwal pengiriman ke berbagai kota tujuan.',
  },
  'kayu-dolken-gelam-bongkar-muat-stok-kayu-02': {
    alt: 'Pekerja memeriksa kayu dolken sebelum pengiriman',
    desc: 'Setiap batang diperiksa kondisinya agar pelanggan hanya menerima kayu yang lurus dan berkualitas.',
  },
  'kayu-dolken-muat-truk-siap-kirim-01': {
    alt: 'Proses memuat kayu dolken ke bak truk pengiriman',
    desc: 'Batang kayu dolken dimuat satu per satu ke truk untuk diantar ke lokasi proyek pelanggan.',
  },
  'kayu-dolken-muat-truk-siap-kirim-05': {
    alt: 'Bongkar muat kayu dolken untuk pengiriman pelanggan',
    desc: 'Order perusahaan maupun perorangan diproses dengan sistem bayar di tempat setelah barang tiba.',
  },
  'kayu-dolken-bongkar-kayu-lokasi-pelanggan-01': {
    alt: 'Bongkar kayu dolken di lokasi proyek pelanggan',
    desc: 'Barang tiba di lokasi, baru pembayaran dilakukan — itulah kemudahan order kayu dolken pada kami.',
  },
  'kayu-dolken-pengangkatan-batang-dolken-02': {
    alt: 'Dua pekerja mengangkat kayu dolken panjang 4 meter',
    desc: 'Ukuran standar 4 meter memudahkan pengangkatan dan pemasangan langsung ke lubang pondasi.',
  },
};
