export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'STAFF';
  permissions: ('MANAGE_PROFIL' | 'MANAGE_ORGANISASI' | 'MANAGE_UMKM' | 'MANAGE_BERITA' | 'MANAGE_KONTAK')[];
  createdAt: string;
}

export interface Statistic {
  category: string;
  detail: string;
}

export interface VillageProfile {
  description: string;
  statistics: Statistic[];
  gallery: string[];
  logoUrl: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
}

export interface OrganizationDetail {
  id: string;
  orgId: string;
  positionName: string;
  personName: string;
  contact?: string;
  parentId: string | null;
  order: number;
}

export interface UMKM {
  id: string;
  ownerName: string;
  businessName: string;
  description: string;
  address: string;
  contact: string; // WhatsApp format (e.g. 628xxx)
  imageUrl: string;
  createdAt: string;
  mapsUrl?: string; // Google Maps URL (embed iframe link)
}

export interface Product {
  id: string;
  umkmId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  publishedAt: string;
  isPublished: boolean;
}

// ================= DUMMY DATA =================

export const dummyUsers: User[] = [
  {
    id: 'user-1',
    email: 'superadmin@sambeng.desa.id',
    name: 'Budi Santoso (Dukuh)',
    role: 'SUPER_ADMIN',
    permissions: ['MANAGE_PROFIL', 'MANAGE_ORGANISASI', 'MANAGE_UMKM', 'MANAGE_BERITA'],
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-2',
    email: 'profil.staff@sambeng.desa.id',
    name: 'Siti Aminah',
    role: 'STAFF',
    permissions: ['MANAGE_PROFIL'],
    createdAt: '2026-02-15T09:30:00Z',
  },
  {
    id: 'user-3',
    email: 'umkm.staff@sambeng.desa.id',
    name: 'Joko Widodo',
    role: 'STAFF',
    permissions: ['MANAGE_UMKM'],
    createdAt: '2026-03-01T10:15:00Z',
  },
  {
    id: 'user-4',
    email: 'berita.staff@sambeng.desa.id',
    name: 'Rian Hidayat',
    role: 'STAFF',
    permissions: ['MANAGE_BERITA', 'MANAGE_ORGANISASI'],
    createdAt: '2026-03-10T14:20:00Z',
  }
];

export const dummyProfile: VillageProfile = {
  description: `Padukuhan Sambeng terletak di Kelurahan Ngalang, Kapanewon Gedangsari, Kabupaten Gunungkidul, Daerah Istimewa Yogyakarta. Dikenal dengan keasrian alam dan kearifan lokalnya, Padukuhan Sambeng berkomitmen untuk memajukan kesejahteraan warganya melalui pemberdayaan ekonomi kreatif, pertanian, serta pemanfaatan teknologi informasi untuk pelayanan desa yang transparan dan akuntabel. Warga Sambeng menjunjung tinggi nilai gotong royong dan kebersamaan dalam kehidupan sehari-hari.`,
  statistics: [
    { category: 'Jumlah Penduduk', detail: '1,245 Jiwa' },
    { category: 'Jumlah Kepala Keluarga', detail: '342 KK' },
    { category: 'Luas Wilayah', detail: '87.4 Hektar' },
    { category: 'Penduduk Laki-laki', detail: '612 Jiwa' },
    { category: 'Penduduk Perempuan', detail: '633 Jiwa' },
    { category: 'Mata Pencaharian Utama', detail: 'Petani & Buruh Tani' }
  ],
  gallery: [
    'https://images.unsplash.com/photo-1596422846543-75c6fc18a523?w=800&auto=format&fit=crop&q=60', // Sawah
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60', // Hijau alam
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60', // Rumah joglo/tradisional
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=60'  // Gunung/bukit
  ],
  logoUrl: '',
  updatedAt: '2026-07-04T12:00:00Z'
};

export const dummyOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Kepengurusan Padukuhan Sambeng',
    description: 'Struktur pemerintahan dan administrasi tingkat padukuhan yang bertugas melayani masyarakat Padukuhan Sambeng.'
  },
  {
    id: 'org-2',
    name: 'KIM (Kelompok Informasi Masyarakat) Sambeng',
    description: 'Kelompok masyarakat yang bergerak di bidang pengelolaan informasi dan komunikasi guna memberdayakan masyarakat desa.'
  },
  {
    id: 'org-3',
    name: 'Karang Taruna Tunas Bhakti',
    description: 'Wadah pengembangan generasi muda padukuhan yang bergerak di bidang sosial, olahraga, seni, dan kepemudaan.'
  }
];

export const dummyOrganizationDetails: OrganizationDetail[] = [
  // Kepengurusan Padukuhan (org-1)
  {
    id: 'od-1',
    orgId: 'org-1',
    positionName: 'Kepala Dukuh Sambeng',
    personName: 'Budi Santoso',
    contact: '6281234567890',
    parentId: null,
    order: 1
  },
  {
    id: 'od-2',
    orgId: 'org-1',
    positionName: 'Sekretaris Dukuh',
    personName: 'Siti Aminah',
    contact: '6281234567891',
    parentId: 'od-1',
    order: 1
  },
  {
    id: 'od-3',
    orgId: 'org-1',
    positionName: 'Bendahara Dukuh',
    personName: 'Dewi Lestari',
    contact: '6281234567892',
    parentId: 'od-1',
    order: 2
  },
  {
    id: 'od-4',
    orgId: 'org-1',
    positionName: 'Ketua RW 01',
    personName: 'Heri Prasetyo',
    contact: '6281234567893',
    parentId: 'od-1',
    order: 3
  },
  {
    id: 'od-5',
    orgId: 'org-1',
    positionName: 'Ketua RW 02',
    personName: 'Wawan Setiawan',
    contact: '6281234567894',
    parentId: 'od-1',
    order: 4
  },
  {
    id: 'od-6',
    orgId: 'org-1',
    positionName: 'Ketua RT 01 (RW 01)',
    personName: 'Supardi',
    contact: '6281234567895',
    parentId: 'od-4',
    order: 1
  },
  {
    id: 'od-7',
    orgId: 'org-1',
    positionName: 'Ketua RT 02 (RW 01)',
    personName: 'Paimin',
    contact: '6281234567896',
    parentId: 'od-4',
    order: 2
  },
  {
    id: 'od-8',
    orgId: 'org-1',
    positionName: 'Ketua RT 03 (RW 02)',
    personName: 'Slamet',
    contact: '6281234567897',
    parentId: 'od-5',
    order: 1
  },

  // KIM Sambeng (org-2)
  {
    id: 'od-201',
    orgId: 'org-2',
    positionName: 'Ketua KIM Sambeng',
    personName: 'Rian Hidayat',
    contact: '6285712345678',
    parentId: null,
    order: 1
  },
  {
    id: 'od-202',
    orgId: 'org-2',
    positionName: 'Divisi Redaksi & Konten',
    personName: 'Bagas Pratama',
    contact: '6285712345679',
    parentId: 'od-201',
    order: 1
  },
  {
    id: 'od-203',
    orgId: 'org-2',
    positionName: 'Divisi IT & Website',
    personName: 'Fajar Nugroho',
    contact: '6285712345680',
    parentId: 'od-201',
    order: 2
  },
  {
    id: 'od-204',
    orgId: 'org-2',
    positionName: 'Divisi Humas & Kemitraan',
    personName: 'Mega Utami',
    contact: '6285712345681',
    parentId: 'od-201',
    order: 3
  },

  // Karang Taruna (org-3)
  {
    id: 'od-301',
    orgId: 'org-3',
    positionName: 'Ketua Karang Taruna',
    personName: 'Andi Wijaya',
    contact: '628991234567',
    parentId: null,
    order: 1
  },
  {
    id: 'od-302',
    orgId: 'org-3',
    positionName: 'Wakil Ketua',
    personName: 'Bambang Tri',
    contact: '628991234568',
    parentId: 'od-301',
    order: 1
  },
  {
    id: 'od-303',
    orgId: 'org-3',
    positionName: 'Sekretaris',
    personName: 'Indah Permata',
    parentId: 'od-301',
    order: 2
  },
  {
    id: 'od-304',
    orgId: 'org-3',
    positionName: 'Bendahara',
    personName: 'Citra Kirana',
    parentId: 'od-301',
    order: 3
  }
];

export const dummyUMKM: UMKM[] = [
  {
    id: 'umkm-1',
    ownerName: 'Ibu Sugiyanti',
    businessName: 'Camilan Khas Sambeng (Kripik Pisang & Singkong)',
    description: 'Produsen berbagai macam keripik gurih dan manis yang terbuat dari bahan hasil tani lokal yang segar dan tanpa bahan pengawet.',
    address: 'RT 02 / RW 01, Padukuhan Sambeng, Ngalang',
    contact: '6281298765432',
    imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=60',
    createdAt: '2026-04-01T08:00:00Z'
  },
  {
    id: 'umkm-2',
    ownerName: 'Bapak Maryono',
    businessName: 'Kerajinan Bambu Lestari',
    description: 'Menjual aneka kerajinan bambu seperti caping, tampah, besek hias, dan aneka perlengkapan anyaman rumah tangga tradisional.',
    address: 'RT 01 / RW 02, Padukuhan Sambeng, Ngalang',
    contact: '6285743210987',
    imageUrl: 'https://images.unsplash.com/photo-1507314269661-3965ff088fcc?w=800&auto=format&fit=crop&q=60',
    createdAt: '2026-04-10T09:00:00Z'
  },
  {
    id: 'umkm-3',
    ownerName: 'Ibu Warsini',
    businessName: 'Batik Tulis & Cap Jati Sambeng',
    description: 'Menyediakan batik tulis eksklusif dengan motif khas dedaunan hutan jati dan flora lokal Gunungkidul.',
    address: 'RT 03 / RW 02, Padukuhan Sambeng, Ngalang',
    contact: '6289654321098',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=60',
    createdAt: '2026-05-02T10:00:00Z'
  }
];

export const dummyProducts: Product[] = [
  // Products for umkm-1 (Camilan Khas Sambeng)
  {
    id: 'prod-1',
    umkmId: 'umkm-1',
    name: 'Keripik Pisang Karamel',
    description: 'Keripik pisang renyah berbalut gula karamel yang manis legit. Isi 250gr.',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-2',
    umkmId: 'umkm-1',
    name: 'Keripik Singkong Balado',
    description: 'Keripik singkong gurih pedas manis dengan bumbu rempah asli. Isi 200gr.',
    price: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop&q=60'
  },

  // Products for umkm-2 (Kerajinan Bambu Lestari)
  {
    id: 'prod-3',
    umkmId: 'umkm-2',
    name: 'Anyaman Tampah Bambu',
    description: 'Tampah tradisional berkualitas tinggi dari serat bambu pilihan untuk menjemur atau memilah beras.',
    price: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1507314269661-3965ff088fcc?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-4',
    umkmId: 'umkm-2',
    name: 'Set Besek Hias Hantaran',
    description: 'Sepasang besek dengan anyaman halus dan hiasan pita cantik untuk kemasan kado atau hantaran nikah.',
    price: 35000,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=60'
  },

  // Products for umkm-3 (Batik Jati)
  {
    id: 'prod-5',
    umkmId: 'umkm-3',
    name: 'Kain Batik Tulis Daun Jati',
    description: 'Kain batik tulis katun primisima ukuran 2x1.15 meter dengan pewarnaan alam dari ekstrak daun jati.',
    price: 250000,
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=60'
  }
];

export const dummyNews: News[] = [
  {
    id: 'news-1',
    title: 'Gotong Royong Perbaikan Saluran Irigasi Menjelang Musim Tanam',
    slug: 'gotong-royong-perbaikan-saluran-irigasi',
    content: `<p>Masyarakat Padukuhan Sambeng melaksanakan kerja bakti memperbaiki saluran irigasi pertanian di wilayah persawahan selatan pada hari Minggu kemarin. Kegiatan ini diikuti oleh puluhan warga yang antusias guna memastikan suplai air persawahan lancar menjelang musim tanam padi mendatang.</p>
              <p>Kepala Dukuh Sambeng, Bapak Budi Santoso, menyatakan bahwa gotong royong ini merupakan agenda rutin guna merawat fasilitas umum secara mandiri. "Dengan irigasi yang bersih, kami berharap hasil panen petani musim ini bisa meningkat," ujarnya.</p>
              <p>Acara diakhiri dengan makan siang bersama tumpeng yang disediakan secara swadaya oleh ibu-ibu warga RT 02.</p>`,
    imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a523?w=800&auto=format&fit=crop&q=60',
    authorId: 'user-4',
    authorName: 'Rian Hidayat',
    publishedAt: '2026-06-25T10:00:00Z',
    isPublished: true
  },
  {
    id: 'news-2',
    title: 'Pelatihan Pemasaran Digital bagi UMKM Padukuhan Sambeng',
    slug: 'pelatihan-pemasaran-digital-umkm-sambeng',
    content: `<p>Guna meningkatkan jangkauan pasar bagi pelaku usaha mikro di desa, KIM Sambeng menyelenggarakan lokakarya singkat tentang teknik pemasaran digital (digital marketing) berbasis media sosial dan WhatsApp Business.</p>
              <p>Acara yang berlangsung di Balai Padukuhan ini menghadirkan narasumber praktisi bisnis online lokal. Ibu Sugiyanti, salah satu pelaku UMKM keripik pisang, mengaku sangat terbantu. "Sekarang saya jadi paham cara memotret produk yang menarik dan menawarkan lewat status WA agar lebih laris," ungkapnya.</p>`,
    imageUrl: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=800&auto=format&fit=crop&q=60',
    authorId: 'user-4',
    authorName: 'Rian Hidayat',
    publishedAt: '2026-07-02T09:00:00Z',
    isPublished: true
  },
  {
    id: 'news-3',
    title: 'Rencana Kegiatan Hari Kemerdekaan RI ke-81 Padukuhan Sambeng',
    slug: 'rencana-kegiatan-hari-kemerdekaan-ri-81',
    content: `<p>Karang Taruna Tunas Bhakti mulai menyusun kepanitiaan dan rencana lomba untuk memeriahkan Hari Ulang Tahun Kemerdekaan Republik Indonesia ke-81 di bulan Agustus mendatang. Beberapa jenis lomba anak-anak, ibu-ibu, hingga turnamen voli antar RT direncanakan akan meramaikan perayaan tahun ini.</p>
              <p>Ketua Karang Taruna, Andi Wijaya, mengajak seluruh warga berpartisipasi aktif baik sebagai panitia, sponsor, maupun peserta guna mempererat silaturahmi antar warga Sambeng.</p>`,
    imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=60',
    authorId: 'user-4',
    authorName: 'Rian Hidayat',
    publishedAt: '2026-07-04T15:00:00Z',
    isPublished: true
  }
];
