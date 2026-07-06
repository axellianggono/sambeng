'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getNews } from '@/lib/db';
import { News } from '@/lib/dummy-data';
import { Calendar, User, ArrowLeft, ChevronRight, Newspaper } from 'lucide-react';

export default function BeritaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [news, setNews] = useState<News | null>(null);
  const [otherNews, setOtherNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const loadedNews = await getNews();
        const found = loadedNews.find((item) => item.slug === slug);
        if (found) {
          setNews(found);
          const others = loadedNews
            .filter((item) => item.id !== found.id && item.isPublished)
            .slice(0, 2);
          setOtherNews(others);
        }
      } catch (err) {
        console.error('Gagal memuat berita detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen pt-28 pb-16 flex items-center justify-center">
        <p className="text-zinc-500 italic">Memuat detail berita...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen py-24 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 max-w-md shadow-sm">
          <Newspaper className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Berita Tidak Ditemukan</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm">
            Maaf, artikel berita yang Anda cari tidak dapat ditemukan atau telah dihapus.
          </p>
          <Link
            href="/berita"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors inline-block"
          >
            Kembali ke Berita
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Back */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-650 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-450 dark:text-zinc-500">
            <Link href="/" className="hover:text-emerald-600">Beranda</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/berita" className="hover:text-emerald-600">Berita</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-600 dark:text-zinc-400 font-medium truncate max-w-[200px]">
              {news.title}
            </span>
          </div>
        </div>

        {/* Article Container */}
        <article className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm mb-12">
          {/* Main Image */}
          <div className="relative h-[250px] sm:h-[450px] w-full bg-zinc-100 dark:bg-zinc-800">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-12">
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-zinc-450 dark:text-zinc-500 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                <span>
                  {new Date(news.publishedAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <User className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                <span>Ditulis oleh: {news.authorName}</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight mb-8">
              {news.title}
            </h1>

            {/* Content (HTML) */}
            <div
              className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-350 leading-relaxed text-base sm:text-lg space-y-6"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </div>
        </article>

        {/* Recommendations Section */}
        {otherNews.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Kabar Menarik Lainnya</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherNews.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="h-36 w-full bg-zinc-150 dark:bg-zinc-800 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        {new Date(item.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white mt-1 mb-2 line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        <Link href={`/berita/${item.slug}`}>{item.title}</Link>
                      </h4>
                    </div>
                    <Link
                      href={`/berita/${item.slug}`}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-4 inline-flex items-center gap-1 hover:text-emerald-700"
                    >
                      <span>Baca</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
