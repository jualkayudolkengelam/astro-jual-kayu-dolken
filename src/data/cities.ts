export interface City {
  slug: string;
  name: string;
  region: Region;
}

export type Region =
  | 'Banten'
  | 'Jakarta & Sekitarnya'
  | 'Jawa Barat'
  | 'Jawa Tengah'
  | 'DI Yogyakarta'
  | 'Jawa Timur'
  | 'Sulawesi Selatan'
  | 'Sulawesi Tengah'
  | 'Sulawesi Tenggara';

export const regions: { name: Region; blurb: string }[] = [
  {
    name: 'Banten',
    blurb:
      'Pengiriman paling sigap ke seluruh wilayah Banten — order pagi sering bisa tiba di hari yang sama.',
  },
  {
    name: 'Jakarta & Sekitarnya',
    blurb:
      'Melayani lima kota administrasi Jakarta serta Bogor, Depok, Tangerang, dan Bekasi dengan armada rutin setiap hari.',
  },
  {
    name: 'Jawa Barat',
    blurb:
      'Pengiriman terjadwal ke koridor Jabar dari Cikarang hingga Cirebon dan Tasikmalaya.',
  },
  {
    name: 'Jawa Tengah',
    blurb:
      'Rute rutin pantura (Cirebon–Semarang–Kudus) maupun jalur selatan (Purwokerto–Yogyakarta).',
  },
  {
    name: 'DI Yogyakarta',
    blurb:
      'Melayani Yogyakarta dan sekitarnya termasuk Boyolali, Klaten, Solo, dan Sragen.',
  },
  {
    name: 'Jawa Timur',
    blurb:
      'Sampai Surabaya untuk order dalam jumlah besar — hubungi kami untuk jadwal kiriman terdekat.',
  },
  {
    name: 'Sulawesi Selatan',
    blurb:
      'Melayani Makassar dan kota-kota Sulawesi Selatan lainnya — hubungi kami untuk harga & jadwal kiriman terbaik.',
  },
  {
    name: 'Sulawesi Tengah',
    blurb:
      'Palu, Luwuk, Poso, dan sekitarnya masuk jadwal kiriman kami — detail ongkos kirim dibicarakan langsung.',
  },
  {
    name: 'Sulawesi Tenggara',
    blurb:
      'Kendari, Bau-Bau, dan sekitarnya — telepon atau WhatsApp untuk penawaran kayu dolken paling pas.',
  },
];

const raw: [string, Region][] = [
  // Banten
  ['Serang', 'Banten'],
  ['Anyer', 'Banten'],
  ['Merak', 'Banten'],
  ['Cilegon', 'Banten'],
  ['Petir', 'Banten'],
  ['Ciomas', 'Banten'],
  ['Pandeglang', 'Banten'],
  ['Lebak', 'Banten'],
  ['Rangkasbitung', 'Banten'],
  ['Balaraja', 'Banten'],
  // Jabodetabek
  ['Jakarta Pusat', 'Jakarta & Sekitarnya'],
  ['Jakarta Barat', 'Jakarta & Sekitarnya'],
  ['Jakarta Timur', 'Jakarta & Sekitarnya'],
  ['Jakarta Utara', 'Jakarta & Sekitarnya'],
  ['Jakarta Selatan', 'Jakarta & Sekitarnya'],
  ['Bogor', 'Jakarta & Sekitarnya'],
  ['Depok', 'Jakarta & Sekitarnya'],
  ['Tangerang', 'Jakarta & Sekitarnya'],
  ['Bekasi', 'Jakarta & Sekitarnya'],
  // Jawa Barat
  ['Cikarang', 'Jawa Barat'],
  ['Karawang', 'Jawa Barat'],
  ['Purwakarta', 'Jawa Barat'],
  ['Subang', 'Jawa Barat'],
  ['Sukabumi', 'Jawa Barat'],
  ['Bandung', 'Jawa Barat'],
  ['Cianjur', 'Jawa Barat'],
  ['Ciamis', 'Jawa Barat'],
  ['Indramayu', 'Jawa Barat'],
  ['Cirebon', 'Jawa Barat'],
  ['Kuningan', 'Jawa Barat'],
  ['Garut', 'Jawa Barat'],
  ['Majalengka', 'Jawa Barat'],
  ['Tasikmalaya', 'Jawa Barat'],
  // Jawa Tengah
  ['Brebes', 'Jawa Tengah'],
  ['Tegal', 'Jawa Tengah'],
  ['Slawi', 'Jawa Tengah'],
  ['Pemalang', 'Jawa Tengah'],
  ['Pekalongan', 'Jawa Tengah'],
  ['Batang', 'Jawa Tengah'],
  ['Kendal', 'Jawa Tengah'],
  ['Semarang', 'Jawa Tengah'],
  ['Ungaran', 'Jawa Tengah'],
  ['Salatiga', 'Jawa Tengah'],
  ['Demak', 'Jawa Tengah'],
  ['Jepara', 'Jawa Tengah'],
  ['Kudus', 'Jawa Tengah'],
  ['Pati', 'Jawa Tengah'],
  ['Rembang', 'Jawa Tengah'],
  ['Blora', 'Jawa Tengah'],
  ['Purwodadi', 'Jawa Tengah'],
  ['Purwokerto', 'Jawa Tengah'],
  ['Banyumas', 'Jawa Tengah'],
  ['Purbalingga', 'Jawa Tengah'],
  ['Banjarnegara', 'Jawa Tengah'],
  ['Cilacap', 'Jawa Tengah'],
  ['Kebumen', 'Jawa Tengah'],
  ['Wonosobo', 'Jawa Tengah'],
  ['Temanggung', 'Jawa Tengah'],
  ['Magelang', 'Jawa Tengah'],
  ['Purworejo', 'Jawa Tengah'],
  ['Wonogiri', 'Jawa Tengah'],
  ['Sragen', 'Jawa Tengah'],
  ['Klaten', 'Jawa Tengah'],
  ['Solo', 'Jawa Tengah'],
  ['Boyolali', 'Jawa Tengah'],
  // DIY
  ['Yogyakarta', 'DI Yogyakarta'],
  // Jawa Timur
  ['Surabaya', 'Jawa Timur'],
  // Sulawesi Selatan
  ['Makassar', 'Sulawesi Selatan'],
  ['Parepare', 'Sulawesi Selatan'],
  ['Palopo', 'Sulawesi Selatan'],
  ['Gowa', 'Sulawesi Selatan'],
  ['Maros', 'Sulawesi Selatan'],
  ['Bone', 'Sulawesi Selatan'],
  ['Bulukumba', 'Sulawesi Selatan'],
  // Sulawesi Tengah
  ['Palu', 'Sulawesi Tengah'],
  ['Poso', 'Sulawesi Tengah'],
  ['Donggala', 'Sulawesi Tengah'],
  ['Luwuk', 'Sulawesi Tengah'],
  ['Morowali', 'Sulawesi Tengah'],
  // Sulawesi Tenggara
  ['Kendari', 'Sulawesi Tenggara'],
  ['Bau-Bau', 'Sulawesi Tenggara'],
  ['Kolaka', 'Sulawesi Tenggara'],
  ['Raha', 'Sulawesi Tenggara'],
  ['Buton', 'Sulawesi Tenggara'],
];

export const cities: City[] = raw.map(([name, region]) => ({
  slug: name.toLowerCase().replace(/\s+/g, '-'),
  name,
  region,
}));

export function neighborsOf(city: City, count = 3): City[] {
  const same = cities.filter((c) => c.region === city.region && c.slug !== city.slug);
  const idx = cities.findIndex((c) => c.slug === city.slug);
  return [...same.slice(idx % Math.max(same.length - count, 1)), ...same].slice(0, count);
}
