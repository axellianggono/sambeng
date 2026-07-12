import React from 'react';
import Link from 'next/link';
import { ArrowRight, Landmark, Users, ShoppingBag, Newspaper, ChevronRight } from 'lucide-react';
import { getVillageProfile, getNews } from '@/lib/db';
import { News, VillageProfile } from '@/lib/dummy-data';
import InstagramFeed from '@/components/InstagramFeed';


export const revalidate = 60; // revalidate every 60 seconds

export default async function HomePage() {
  let profile: VillageProfile | null = null;
  let latestNews: News[] = [];

  try {
    profile = await getVillageProfile();
    const loadedNews = await getNews();
    // Filter published news and sort by date descending
    latestNews = loadedNews
      .filter((n) => n.isPublished)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 3);
  } catch (err) {
    console.error('Gagal memuat data beranda dari Firestore:', err);
  }

  const mainStats = profile?.statistics.slice(0, 3) || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-zinc-950 text-white min-h-screen overflow-hidden flex items-center justify-center py-20">
        <div className="absolute inset-0 opacity-40">
          <img
            src="/images/sambeng-landscape.jpg"
            alt="Pemandangan Alam Sambeng"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6">
            Selamat Datang di <span className="text-emerald-400">Padukuhan Sambeng</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-300 mb-8 leading-relaxed">
            Pusat informasi resmi Padukuhan Sambeng, Desa Ngalang, Gedangsari, Gunungkidul. Wadah keterbukaan informasi dan pemberdayaan potensi lokal padukuhan.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/profil"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-colors shadow-lg shadow-emerald-600/20"
            >
              <span>Jelajahi Profil</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/umkm"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-emerald-50 text-emerald-800 font-semibold rounded-full transition-all border border-emerald-100 shadow-sm"
            >
              <span>Lihat Produk UMKM</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Highlight Section */}
      <section className="bg-white dark:bg-zinc-900 py-12 border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mainStats.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800"
              >
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 rounded-xl">
                  {idx === 0 && <Users className="h-6 w-6" />}
                  {idx === 1 && <Landmark className="h-6 w-6" />}
                  {idx === 2 && <Landmark className="h-6 w-6" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.category}</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.detail}</p>
                </div>
              </div>
            ))}
            {mainStats.length === 0 && (
              <div className="col-span-full text-center py-4 text-zinc-450 italic">
                Belum ada data statistik padukuhan yang disematkan.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Layanan & Informasi Padukuhan</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Akses cepat ke berbagai segmen informasi penting desa kami</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Profil Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group">
              <Landmark className="h-8 w-8 text-emerald-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-white mb-2">Profil Dukuh</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Informasi demografi, sejarah, dan visual galeri Padukuhan Sambeng.</p>
              <Link href="/profil" className="inline-flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 gap-1 group-hover:gap-2 transition-all">
                <span>Selengkapnya</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Organisasi Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group">
              <Users className="h-8 w-8 text-emerald-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-white mb-2">Organisasi Desa</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Melihat daftar kepengurusan, KIM, Karang Taruna, dan bagan strukturnya.</p>
              <Link href="/organisasi" className="inline-flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 gap-1 group-hover:gap-2 transition-all">
                <span>Lihat Bagan</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* UMKM Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group">
              <ShoppingBag className="h-8 w-8 text-emerald-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-white mb-2">UMKM & Produk</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Eksplorasi potensi usaha lokal, produk unggulan, dan nomor kontak UMKM.</p>
              <Link href="/umkm" className="inline-flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 gap-1 group-hover:gap-2 transition-all">
                <span>Belanja Lokal</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Berita Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group">
              <Newspaper className="h-8 w-8 text-emerald-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-white mb-2">Berita Terkini</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Kumpulan berita, pengumuman, dan liputan kegiatan warga padukuhan.</p>
              <Link href="/berita" className="inline-flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 gap-1 group-hover:gap-2 transition-all">
                <span>Baca Berita</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <InstagramFeed />

      {/* Latest News Section */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Kabar Terbaru Sambeng</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-2">Dapatkan informasi terkini mengenai aktivitas warga desa kami</p>
            </div>
            <Link
              href="/berita"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 transition-colors"
            >
              <span>Lihat Semua Berita</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((news) => (
              <article key={news.id} className="flex flex-col bg-zinc-50 dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all">
                <div className="relative h-48 w-full">
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      {new Date(news.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white mt-2 mb-3 line-clamp-2">
                      <Link href={`/berita/${news.slug}`} className="hover:text-emerald-600 transition-colors">
                        {news.title}
                      </Link>
                    </h3>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-4" dangerouslySetInnerHTML={{ __html: news.content }} />
                  </div>
                  <Link
                    href={`/berita/${news.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
