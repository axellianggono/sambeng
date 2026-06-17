"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MessageCircle, MapPin, Tag } from "lucide-react";
import { UMKMItem } from "@/lib/data-defaults";

export default function UMKMCatalogClient({ initialItems }: { initialItems: UMKMItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Dynamically get unique categories from UMKM items
  const categories = ["Semua", ...Array.from(new Set(initialItems.map((item) => item.category)))];

  // Filter items based on search query and category
  const filteredItems = initialItems.filter((item) => {
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search and Filter Controls */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama produk, pemilik, atau deskripsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
          />
        </div>

        {/* Category Filters */}
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

      {/* Catalog Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 text-gray-500">
          Tidak ditemukan produk UMKM yang sesuai dengan pencarian Anda.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition group"
            >
              <div>
                {/* Product Photo */}
                <div className="relative h-56 w-full overflow-hidden bg-gray-50">
                  <Image
                    src={item.imageUrl || "https://images.unsplash.com/photo-1566847438217-76e82d383f84?q=80&w=400&auto=format&fit=crop"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-102 transition duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-bold text-primary-800 border border-primary-100 uppercase tracking-widest shadow-sm">
                    {item.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Pemilik: {item.owner}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition">
                    <Link href={`/umkm/${item.id}`}>{item.name}</Link>
                  </h2>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-3">
                <div className="flex items-center text-xs text-gray-500 space-x-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary-600 flex-shrink-0" />
                  <span className="truncate">{item.address}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href={`/umkm/${item.id}`}
                    className="flex items-center justify-center py-2 px-3 border border-gray-200 hover:border-primary-500 hover:text-primary-600 rounded-xl text-xs font-semibold text-gray-600 transition"
                  >
                    Lihat Detail
                  </Link>
                  <a
                    href={`https://wa.me/${item.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition space-x-1"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
