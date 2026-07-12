import React from 'react';
import { ExternalLink } from 'lucide-react';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface BeholdPostSize {
  width: number;
  height: number;
  mediaUrl: string;
}

interface BeholdPost {
  id: string;
  mediaUrl: string;
  permalink: string;
  caption?: string;
  prunedCaption?: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  thumbnailUrl?: string;
  timestamp: string;
  sizes?: {
    small?: BeholdPostSize;
    medium?: BeholdPostSize;
    large?: BeholdPostSize;
    full?: BeholdPostSize;
  };
}

interface BeholdResponse {
  username?: string;
  posts?: BeholdPost[];
  [key: string]: any;
}

// Fallback dummy posts representing Padukuhan Sambeng activities
const FALLBACK_POSTS: BeholdPost[] = [
  {
    id: 'fallback-1',
    mediaUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&auto=format&fit=crop&q=80',
    permalink: 'https://www.instagram.com/kim_padukuhansambeng/',
    caption: 'Kegiatan gotong royong warga Padukuhan Sambeng dalam memperbaiki saluran irigasi pertanian guna kelancaran musim tanam. #gotongroyong #sambeng',
    mediaType: 'IMAGE',
    timestamp: '2026-07-10T08:00:00Z',
  },
  {
    id: 'fallback-2',
    mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
    permalink: 'https://www.instagram.com/kim_padukuhansambeng/',
    caption: 'Musyawarah perencanaan pembangunan padukuhan (Musdus) Sambeng bersama tokoh masyarakat dan pemuda Karang Taruna. #rembugwarga #demokrasi',
    mediaType: 'IMAGE',
    timestamp: '2026-07-08T14:30:00Z',
  },
  {
    id: 'fallback-3',
    mediaUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&auto=format&fit=crop&q=80',
    permalink: 'https://www.instagram.com/kim_padukuhansambeng/',
    caption: 'Pelatihan pengembangan produk UMKM kuliner khas Sambeng untuk meningkatkan nilai jual dan jangkauan pasar digital. #UMKMBisa #ekonomikreatif',
    mediaType: 'IMAGE',
    timestamp: '2026-07-05T09:15:00Z',
  },
  {
    id: 'fallback-4',
    mediaUrl: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&auto=format&fit=crop&q=80',
    permalink: 'https://www.instagram.com/kim_padukuhansambeng/',
    caption: 'Panen raya padi di lahan pertanian bulak Sambeng. Syukur alhamdulillah hasil panen tahun ini melimpah ruah. #pertanian #panenraya',
    mediaType: 'IMAGE',
    timestamp: '2026-07-02T10:00:00Z',
  },
  {
    id: 'fallback-5',
    mediaUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=600&auto=format&fit=crop&q=80',
    permalink: 'https://www.instagram.com/kim_padukuhansambeng/',
    caption: 'Keseruan dan keceriaan anak-anak Padukuhan Sambeng dalam kegiatan posyandu remaja dan pembagian makanan tambahan bergizi. #anaksehat #generasiemas',
    mediaType: 'IMAGE',
    timestamp: '2026-06-28T16:00:00Z',
  },
  {
    id: 'fallback-6',
    mediaUrl: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?w=600&auto=format&fit=crop&q=80',
    permalink: 'https://www.instagram.com/kim_padukuhansambeng/',
    caption: 'Keindahan senja di area perbukitan Sambeng, Gedangsari. Pesona alam Gunungkidul yang selalu menenangkan hati. #pesonaalam #gunungkidul',
    mediaType: 'IMAGE',
    timestamp: '2026-06-25T17:45:00Z',
  },
];

async function getInstagramPosts(): Promise<BeholdPost[]> {
  const feedUrl = process.env.NEXT_PUBLIC_BEHOLD_FEED_URL;

  if (!feedUrl) {
    console.log('NEXT_PUBLIC_BEHOLD_FEED_URL tidak dikonfigurasi. Menggunakan feed fallback.');
    return FALLBACK_POSTS;
  }

  try {
    // Fetch data from Behold with a revalidation time of 1 hour (3600 seconds)
    const res = await fetch(feedUrl, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Gagal memuat feed Behold: ${res.statusText}`);
    }

    const data = await res.json();
    
    let postsList: BeholdPost[] = [];
    if (Array.isArray(data)) {
      postsList = data;
    } else if (data && Array.isArray(data.posts)) {
      postsList = data.posts;
    } else if (data && typeof data === 'object') {
      // In case Behold response has another format
      const potentialArray = Object.values(data).find(val => Array.isArray(val));
      if (potentialArray) {
        postsList = potentialArray as BeholdPost[];
      }
    }

    if (postsList.length === 0) {
      return FALLBACK_POSTS;
    }

    // Map and normalize fields
    return postsList.slice(0, 6).map((post) => {
      // Prioritize Behold proxied image URLs to bypass Instagram CDN hotlink protection
      const proxiedUrl = post.sizes?.medium?.mediaUrl || post.sizes?.small?.mediaUrl || post.sizes?.large?.mediaUrl || post.sizes?.full?.mediaUrl;
      return {
        id: post.id,
        mediaUrl: proxiedUrl || post.mediaUrl || post.thumbnailUrl || '',
        permalink: post.permalink || 'https://www.instagram.com/kim_padukuhansambeng/',
        caption: post.caption || post.prunedCaption || '',
        mediaType: post.mediaType || 'IMAGE',
        timestamp: post.timestamp,
      };
    });
  } catch (error) {
    console.error('Error saat mengambil feed Instagram dari Behold:', error);
    return FALLBACK_POSTS;
  }
}

export default async function InstagramFeed() {
  const posts = await getInstagramPosts();
  const instagramUsername = '@kim_padukuhansambeng';
  const instagramUrl = 'https://www.instagram.com/kim_padukuhansambeng/';

  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-sm mb-2">
              <InstagramIcon className="h-5 w-5" />
              <span>Instagram Kami</span>
            </div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Galeri Kegiatan Terkini
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              Dokumentasi aktivitas dan info terbaru dari Padukuhan Sambeng langsung dari <span className="font-semibold text-zinc-700 dark:text-zinc-300">{instagramUsername}</span>
            </p>
          </div>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-colors shadow-sm text-sm"
          >
            <span>Kunjungi Profil</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Grid Posts */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-2xl overflow-hidden group bg-zinc-200 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800/80 shadow-sm"
            >
              <img
                src={post.mediaUrl}
                alt={post.caption || 'Postingan Instagram Sambeng'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                loading="lazy"
              />
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                <div className="flex justify-end">
                  <InstagramIcon className="h-5 w-5 text-emerald-400" />
                </div>
                <p className="text-xs line-clamp-4 leading-relaxed font-medium">
                  {post.caption || 'Lihat postingan selengkapnya di Instagram'}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
