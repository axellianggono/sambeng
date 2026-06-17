"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import { NewsItem } from "@/lib/data-defaults";

export default function NewsListClient({ initialNews }: { initialNews: NewsItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = ["Semua", ...Array.from(new Set(initialNews.map((n) => n.category)))];

  const filteredNews = initialNews.filter((news) => {
    const matchesCategory = selectedCategory === "Semua" || news.category === selectedCategory;
    const matchesSearch =
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Filters & Search Row */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berita atau pengumuman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                selectedCategory === cat
                  ? "bg-primary-600 border-primary-600 text-white shadow-sm"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 text-gray-500">
          Tidak ada berita yang ditemukan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredNews.map((news) => (
            <article
              key={news.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-gray-50">
                  <Image
                    src={news.thumbnailUrl || "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=600&auto=format&fit=crop"}
                    alt={news.title}
                    fill
                    className="object-cover group-hover:scale-102 transition duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-bold text-primary-800 border border-primary-100 uppercase tracking-widest shadow-sm">
                    {news.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h2 className="text-lg font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-primary-600 transition">
                    <Link href={`/berita/${news.slug}`}>{news.title}</Link>
                  </h2>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                    {news.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-4 border-t border-gray-50 bg-gray-50/20 flex flex-col space-y-3">
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium">
                  <div className="flex items-center space-x-1">
                    <User className="h-3.5 w-3.5 text-primary-600" />
                    <span>{news.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5 text-primary-600" />
                    <span>
                      {new Date(news.publishedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/berita/${news.slug}`}
                  className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-200 hover:border-primary-500 hover:text-primary-600 text-xs font-semibold rounded-xl transition space-x-1"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
