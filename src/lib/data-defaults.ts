export interface SystemSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  dukuhName: string;
  dukuhGreeting: string;
  dukuhImageUrl: string;
  profileSummary: string;
  profileHistory: string;
  profileVision: string;
  profileMission: string;
  stats: { label: string; value: string; icon: string }[];
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string;
  vision: string;
  mission: string;
  contact: string;
  logoUrl: string;
  structure: { id: string; name: string; role: string; parentId: string | null }[];
}

export interface UMKMItem {
  id: string;
  name: string;
  owner: string;
  description: string;
  category: string;
  address: string;
  whatsapp: string;
  imageUrl: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  summary: string;
  content: string;
  category: string;
  status: "draft" | "published";
  author: string;
  publishedAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  isVisible: boolean;
}

export const DEFAULT_SETTINGS: SystemSettings = {
  heroTitle: "Selamat Datang di Padukuhan Sambeng",
  heroSubtitle: "Membangun masyarakat yang mandiri, sejahtera, harmonis, dan berbudaya luhur.",
  heroImageUrl: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?q=80&w=1200&auto=format&fit=crop",
  dukuhName: "Bapak Maryono",
  dukuhGreeting: "Puji syukur kehadirat Tuhan Yang Maha Esa atas terwujudnya situs resmi digital Padukuhan Sambeng. Portal ini dibuat untuk memudahkan warga mengakses informasi desa secara cepat serta memperkenalkan potensi UMKM dan organisasi Sambeng kepada khalayak luas. Kami berkomitmen untuk terus transparan dan melayani warga dengan tulus.",
  dukuhImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
  profileSummary: "Padukuhan Sambeng merupakan salah satu padukuhan yang kaya akan nilai adat gotong royong, keindahan alam pertanian, serta potensi ekonomi kreatif dari pelaku UMKM lokal.",
  profileHistory: "Padukuhan Sambeng memiliki sejarah panjang yang berakar dari pemukiman agraris di wilayah Gunungkidul. Sejak masa lalu, warga Sambeng hidup berdampingan secara damai dengan mengutamakan pertanian tadah hujan dan peternakan. Seiring berjalannya waktu, semangat pemuda-pemudi dan kesadaran digital mendorong Sambeng untuk bertransformasi menjadi padukuhan modern tanpa meninggalkan nilai-nilai luhur budaya Jawa.",
  profileVision: "Mewujudkan masyarakat Padukuhan Sambeng yang bertaqwa, cerdas, berbudaya, berwirausaha mandiri, dan bergotong royong.",
  profileMission: "1. Meningkatkan kerukunan antar umat beragama dan kelestarian budaya.\n2. Memberdayakan pelaku UMKM lokal dan kelompok wanita tani.\n3. Meningkatkan penyediaan infrastruktur publik yang merata.\n4. Mengoptimalkan pelayanan masyarakat berbasis digital.",
  stats: [
    { label: "Jumlah Penduduk", value: "480 Jiwa", icon: "Users" },
    { label: "Kelompok UMKM", value: "8 Usaha", icon: "ShoppingBag" },
    { label: "Organisasi Warga", value: "6 Lembaga", icon: "Layers" },
    { label: "Rukun Tetangga (RT)", value: "4 RT", icon: "Home" }
  ]
};

export const DEFAULT_ORGANISATIONS: Organization[] = [
  {
    id: "org-1",
    name: "Pemerintahan Padukuhan",
    slug: "pemerintahan",
    description: "Pemerintahan resmi tingkat padukuhan yang dipimpin langsung oleh Dukuh dibantu pengurus RT dan tokoh masyarakat.",
    vision: "Mengayomi dan melayani masyarakat secara bersih, transparan, dan adil.",
    mission: "Menyelenggarakan pelayanan publik yang ramah, cepat, dan akuntabel.",
    contact: "Dukuh Maryono (+62 812-1111-2222)",
    logoUrl: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=200&auto=format&fit=crop",
    structure: [
      { id: "1", name: "Bapak Maryono", role: "Dukuh Sambeng", parentId: null },
      { id: "2", name: "Bapak Sugeng", role: "Ketua RT 01", parentId: "1" },
      { id: "3", name: "Bapak Supardi", role: "Ketua RT 02", parentId: "1" },
      { id: "4", name: "Bapak Wawan", role: "Ketua RT 03", parentId: "1" },
      { id: "5", name: "Bapak Tri", role: "Ketua RT 04", parentId: "1" }
    ]
  },
  {
    id: "org-2",
    name: "Karang Taruna Wira Karya",
    slug: "karang-taruna",
    description: "Wadah pengembangan generasi muda Padukuhan Sambeng yang bergerak di bidang sosial, olahraga, seni, dan wirausaha produktif.",
    vision: "Menumbuhkan pemuda mandiri, kreatif, dan berjiwa sosial tinggi.",
    mission: "Aktif dalam pembangunan sosial, melestarikan seni lokal, dan memupuk kepemimpinan pemuda.",
    contact: "Andi Wijaya (+62 813-2222-3333)",
    logoUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=200&auto=format&fit=crop",
    structure: [
      { id: "1", name: "Andi Wijaya", role: "Ketua Karang Taruna", parentId: null },
      { id: "2", name: "Budi Santoso", role: "Wakil Ketua", parentId: "1" },
      { id: "3", name: "Siti Rahma", role: "Sekretaris", parentId: "1" },
      { id: "4", name: "Rian Hidayat", role: "Bendahara", parentId: "1" },
      { id: "5", name: "Dina Amelia", role: "Divisi Humas & Olahraga", parentId: "2" },
      { id: "6", name: "Eko Prasetyo", role: "Divisi Seni & Budaya", parentId: "2" }
    ]
  },
  {
    id: "org-3",
    name: "PKK Padukuhan Sambeng",
    slug: "pkk",
    description: "Pemberdayaan Kesejahteraan Keluarga untuk meningkatkan kesehatan, ketahanan pangan keluarga, dan ekonomi kreatif ibu rumah tangga.",
    vision: "Mewujudkan keluarga sejahtera lahir batin menuju Sambeng tangguh.",
    mission: "Mengembangkan posyandu, ketrampilan wanita, dan kebun gizi rumah tangga.",
    contact: "Ibu Maryono (+62 815-3333-4444)",
    logoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    structure: [
      { id: "1", name: "Ibu Maryono", role: "Ketua PKK", parentId: null },
      { id: "2", name: "Ibu Sri Hartati", role: "Wakil Ketua", parentId: "1" },
      { id: "3", name: "Ibu Endang", role: "Sekretaris", parentId: "1" },
      { id: "4", name: "Ibu Yanti", role: "Bendahara", parentId: "1" }
    ]
  }
];

export const DEFAULT_UMKM: UMKMItem[] = [
  {
    id: "umkm-1",
    name: "Kripik Singkong Gurih Sambeng",
    owner: "Ibu Hartini",
    description: "Camilan tradisional renyah dengan bahan dasar singkong segar organik hasil tani lokal Sambeng. Tersedia varian rasa original bawang, pedas manis, dan keju.",
    category: "Makanan",
    address: "RT 02 / RW 01, Padukuhan Sambeng",
    whatsapp: "6281234567890",
    imageUrl: "https://images.unsplash.com/photo-1566847438217-76e82d383f84?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "umkm-2",
    name: "Madu Lanceng Asli",
    owner: "Pak Pardi",
    description: "Madu murni kualitas super dari budidaya lebah lanceng (Trigona) liar di kebun kelapa Sambeng. Kaya akan nutrisi dan khasiat kesehatan alami.",
    category: "Kesehatan",
    address: "RT 04 / RW 01, Padukuhan Sambeng",
    whatsapp: "6281298765432",
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "umkm-3",
    name: "Kerajinan Anyaman Bambu Lestari",
    owner: "Mbah Wiro",
    description: "Peralatan rumah tangga tradisional dan dekorasi anyaman bambu buatan tangan bernilai seni tinggi seperti tampah, besek, caping, dan keranjang hias.",
    category: "Kerajinan",
    address: "RT 01 / RW 01, Padukuhan Sambeng",
    whatsapp: "6281311112222",
    imageUrl: "https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?q=80&w=400&auto=format&fit=crop"
  }
];

export const DEFAULT_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "Kerja Bakti Massal Menyambut Musim Penghujan",
    slug: "kerja-bakti-massal-menyambut-musim-penghujan",
    thumbnailUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=600&auto=format&fit=crop",
    summary: "Warga Padukuhan Sambeng kompak membersihkan saluran drainase utama guna mengantisipasi luapan air dan mencegah banjir sarang nyamuk jelang musim hujan.",
    content: "<p>Pada hari Minggu pagi kemarin, seluruh warga Padukuhan Sambeng dari RT 01 hingga RT 04 berkumpul bersama untuk melaksanakan kerja bakti massal. Fokus utama dari kegiatan ini adalah pengerukan lumpur di saluran drainase utama sepanjang jalan padukuhan serta pemangkasan ranting pohon yang rawan tumbang.</p><p>Dukuh Sambeng, Bapak Maryono, menyampaikan apresiasi atas tingginya antusiasme warga. 'Gotong royong seperti ini adalah identitas asli desa kita yang harus selalu kita jaga. Dengan saluran air yang bersih, lingkungan kita akan lebih sehat dan terhindar dari potensi banjir genangan,' tuturnya di sela-sela kegiatan.</p><p>Kegiatan ditutup dengan acara makan siang bersama nasi tumpeng yang disiapkan oleh ibu-ibu PKK Padukuhan Sambeng.</p>",
    category: "Kegiatan",
    status: "published",
    author: "Sekretariat Padukuhan",
    publishedAt: "2026-06-15T08:00:00Z"
  },
  {
    id: "news-2",
    title: "Pemeriksaan Kesehatan Gratis Posyandu Sambeng",
    slug: "pemeriksaan-kesehatan-gratis-posyandu-sambeng",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop",
    summary: "Kader PKK bekerja sama dengan Puskesmas menggelar pemeriksaan gratis bagi balita dan lansia guna mendeteksi kesehatan dini serta cegah stunting.",
    content: "<p>Kader Posyandu Balita dan Lansia Padukuhan Sambeng kembali menyelenggarakan program bulanan pemeriksaan kesehatan gratis. Bertempat di balai padukuhan, kegiatan ini menyasar puluhan balita untuk pemantauan tumbuh kembang (berat badan, tinggi badan, imunisasi) serta pemeriksaan tekanan darah dan gula darah bagi lansia.</p><p>Ibu Maryono selaku ketua penggerak PKK menyatakan bahwa fokus bulan ini adalah pencegahan dini stunting. 'Kami memberikan konseling gizi dan membagikan Pemberian Makanan Tambahan (PMT) berbahan baku kelor dan telur yang kaya protein,' ujarnya.</p>",
    category: "Pengumuman",
    status: "published",
    author: "Tim Kader Kesehatan",
    publishedAt: "2026-06-10T09:30:00Z"
  }
];

export const DEFAULT_EVENTS: EventItem[] = [
  {
    id: "event-1",
    title: "Malam Pentas Seni & Bersih Dusun Sambeng",
    description: "Perayaan tahunan Bersih Dusun (Rasulan) menampilkan pagelaran seni karawitan Karang Taruna, tari tradisional anak-anak, dan ketoprak warga.",
    location: "Halaman Balai Padukuhan Sambeng",
    startDate: "2026-07-04T19:00:00Z",
    endDate: "2026-07-04T23:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
    isVisible: true
  },
  {
    id: "event-2",
    title: "Sosialisasi Pemasaran Digital bagi Pelaku UMKM",
    description: "Pelatihan praktis bersama narasumber KKN mengenai cara beriklan lewat media sosial, pendaftaran lokasi usaha di Google Maps, dan optimalisasi WhatsApp Business.",
    location: "Pendopo Dukuh Sambeng",
    startDate: "2026-06-25T09:00:00Z",
    endDate: "2026-06-25T13:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop",
    isVisible: true
  }
];
