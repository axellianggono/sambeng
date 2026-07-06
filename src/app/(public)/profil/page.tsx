'use client';

import React, { useState, useEffect } from 'react';
import { dummyProfile as initialProfile, VillageProfile } from '@/lib/dummy-data';
import { Calendar } from 'lucide-react';
import { getVillageProfile } from '@/lib/db';

export default function ProfilPage() {
  const [profile, setProfile] = useState<VillageProfile | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const loaded = await getVillageProfile();
        setProfile(loaded);
      } catch (err) {
        console.error('Gagal memuat profil desa di halaman publik:', err);
      }
    }
    loadData();
  }, []);

  if (!profile) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen pt-28 pb-16 flex items-center justify-center">
        <p className="text-zinc-500 italic">Memuat profil desa...</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Profil Padukuhan Sambeng
          </h1>
          <div className="mt-4 flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm">
            <Calendar className="h-4 w-4" />
            <span>Terakhir diperbarui: </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {new Date(profile.updatedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 border border-zinc-100 dark:border-zinc-800 shadow-sm mb-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Sekilas Tentang Sambeng</h2>
          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-lg whitespace-pre-line">
            {profile.description}
          </p>
        </div>

        {/* Dynamic Statistics Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center sm:text-left">Statistik Padukuhan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.statistics.length > 0 ? (
              profile.statistics.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600 dark:bg-emerald-500 rounded-l-2xl group-hover:scale-y-110 transition-transform" />
                  <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wider">
                    {stat.category}
                  </p>
                  <p className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                    {stat.detail}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl text-zinc-400">
                Belum ada data statistik padukuhan.
              </div>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center sm:text-left">Galeri Foto Desa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profile.gallery.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-video sm:aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              >
                <img
                  src={img}
                  alt={`Galeri foto Sambeng ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-sm font-medium">Padukuhan Sambeng #{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
