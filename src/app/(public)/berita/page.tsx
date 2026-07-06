'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { News } from '@/lib/dummy-data';
import { Calendar, User, Search, ArrowRight } from 'lucide-react';
import { getNews } from '@/lib/db';

export default function BeritaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from Firestore
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const loadedNews = await getNews();
        // Sort by date descending
        const sorted = loadedNews.sort(
          (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        setNewsList(sorted);
      } catch (err) {
        console.error('Gagal memuat berita di halaman publik:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter news based on search and isPublished
  const filteredNews = newsList.filter(
    (item) =>
      item.isPublished &&
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Berita & Pengumuman Desa
          </h1>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Temukan informasi terbaru, pengumuman penting, serta liputan seputar kegiatan warga di Padukuhan Sambeng.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-md mx-auto mb-16 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Cari berita atau pengumuman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-900 dark:text-white shadow-sm transition-all"
          />
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="text-center py-20 text-zinc-500 italic">
            Memuat berita...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredNews.map((news) => (
            <article
              key={news.id}
              className="flex flex-col bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800/80 shadow-sm hover:shadow-md transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
              </div>

              {/* Card Body */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(news.publishedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      <span>{news.authorName}</span>
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-3 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    <Link href={`/berita/${news.slug}`}>{news.title}</Link>
                  </h3>
                  
                  <div
                    className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-6"
                    dangerouslySetInnerHTML={{ __html: news.content }}
                  />
                </div>

                <Link
                  href={`/berita/${news.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors group/btn"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}

          {filteredNews.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl text-zinc-400 border border-zinc-200 dark:border-zinc-800">
              Tidak ada berita yang cocok dengan kata kunci pencarian Anda.
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
