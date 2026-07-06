'use client';

import React, { useEffect, useState } from 'react';
import { User } from '@/lib/dummy-data';
import { Landmark, Users, ShoppingBag, Newspaper, ShieldAlert, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

// Firestore imports
import { getAdminUsers, getOrganizations, getUMKMs, getNews } from '@/lib/db';

export default function DashboardOverviewPage() {
  const [user, setUser] = useState<User | null>(null);
  const [statValues, setStatValues] = useState({
    users: 0,
    orgs: 0,
    umkm: 0,
    news: 0,
  });

  useEffect(() => {
    // Load current user from localStorage cache
    const userStr = localStorage.getItem('sambeng_admin_user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    // Load live stats from Firestore
    async function loadStats() {
      try {
        const [loadedUsers, loadedOrgs, loadedUmkm, loadedNews] = await Promise.all([
          getAdminUsers(),
          getOrganizations(),
          getUMKMs(),
          getNews(),
        ]);
        setStatValues({
          users: loadedUsers.length,
          orgs: loadedOrgs.length,
          umkm: loadedUmkm.length,
          news: loadedNews.filter((n) => n.isPublished).length,
        });
      } catch (err) {
        console.error('Gagal memuat statistik dari Firestore:', err);
      }
    }
    loadStats();
  }, []);

  const stats = [
    {
      name: 'Total Pengguna CMS',
      value: statValues.users,
      icon: Users,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      name: 'Jumlah Organisasi',
      value: statValues.orgs,
      icon: Landmark,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      name: 'Jumlah UMKM Lokal',
      value: statValues.umkm,
      icon: ShoppingBag,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      name: 'Berita Terpublikasi',
      value: statValues.news,
      icon: Newspaper,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome Hero */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
          Selamat Datang Kembali, {user?.name || 'Admin'}!
        </h1>
        <p className="text-zinc-550 text-sm mt-2 max-w-xl">
          Selamat datang di panel pengelolaan informasi Padukuhan Sambeng. Di sini Anda dapat memperbarui data profil desa, struktur organisasi, UMKM warga, dan menerbitkan berita.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white border border-zinc-200 rounded-2xl p-6 flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{stat.name}</p>
                <p className="text-3xl font-extrabold text-zinc-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl border ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Guide Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Permission card */}
        <div className="col-span-2 bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h3 className="font-bold text-zinc-900 text-lg mb-4 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-emerald-600" />
            <span>Panduan Hak Akses Anda</span>
          </h3>
          <p className="text-zinc-600 text-sm leading-relaxed mb-6">
            Sebagai pengguna dengan peran{' '}
            <span className="font-extrabold text-zinc-800">
              {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Staff Admin'}
            </span>
            , Anda dapat mengakses menu di sidebar sesuai dengan izin yang diberikan oleh Dukuh. Izin ini dapat diubah sewaktu-waktu oleh Super Admin.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className={`w-2 h-2 rounded-full mt-1.5 ${user?.role === 'SUPER_ADMIN' || user?.permissions.includes('MANAGE_PROFIL') ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
              <div className="text-xs text-zinc-650">
                <span className="font-bold text-zinc-800">Kelola Profil:</span> Mengatur deskripsi, statistik dinamis, dan foto galeri padukuhan.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className={`w-2 h-2 rounded-full mt-1.5 ${user?.role === 'SUPER_ADMIN' || user?.permissions.includes('MANAGE_ORGANISASI') ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
              <div className="text-xs text-zinc-650">
                <span className="font-bold text-zinc-800">Kelola Organisasi:</span> Mengubah daftar lembaga desa serta menyusun bagan tree strukturnya.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className={`w-2 h-2 rounded-full mt-1.5 ${user?.role === 'SUPER_ADMIN' || user?.permissions.includes('MANAGE_UMKM') ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
              <div className="text-xs text-zinc-650">
                <span className="font-bold text-zinc-800">Kelola UMKM:</span> Memperbarui profil usaha mikro milik warga.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className={`w-2 h-2 rounded-full mt-1.5 ${user?.role === 'SUPER_ADMIN' || user?.permissions.includes('MANAGE_BERITA') ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
              <div className="text-xs text-zinc-650">
                <span className="font-bold text-zinc-800">Kelola Berita:</span> Menulis berita dan artikel pengumuman desa.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className={`w-2 h-2 rounded-full mt-1.5 ${user?.role === 'SUPER_ADMIN' || user?.permissions.includes('MANAGE_KONTAK') ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
              <div className="text-xs text-zinc-650">
                <span className="font-bold text-zinc-800">Kelola Hubungi Kami:</span> Memperbarui info kontak balai resmi desa dan meninjau pesan-pesan masuk dari publik.
              </div>
            </div>
          </div>
        </div>

        {/* Shortcuts card */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="font-bold text-zinc-900 text-base mb-4">Akses Cepat Publik</h3>
            <p className="text-zinc-550 text-xs leading-relaxed mb-6">
              Buka tab baru untuk melihat hasil tampilan di sisi publik website Padukuhan Sambeng.
            </p>
          </div>
          <div className="space-y-2">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-between px-4 py-2.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-xl text-xs font-semibold border border-zinc-200/80 transition-colors"
            >
              <span>Beranda Publik</span>
              <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </Link>
            <Link
              href="/profil"
              target="_blank"
              className="w-full flex items-center justify-between px-4 py-2.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-xl text-xs font-semibold border border-zinc-200/80 transition-colors"
            >
              <span>Profil Publik</span>
              <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
